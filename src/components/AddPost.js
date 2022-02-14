import React, { useEffect, useState, useRef } from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UPLOAD_AUDIO, SPLASH_API, UPLOAD_POST } from '../Utils/apiroutes'
import getBlobDuration from 'get-blob-duration'
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import { FaLocationArrow } from "react-icons/fa"
import Modal from 'react-modal';
import { useHistory } from 'react-router-dom'

// Demo styles, see 'Styles' section below for some notes on use.
import 'react-accessible-accordion/dist/fancy-example.css';
import { useSelector } from 'react-redux'
import MicRecorder from 'mic-recorder-to-mp3';


const AddPost = () => {



    let initial_state = {
        total_seconds_duration: 98, // 99 seconds start --> 98 seconds
        timetracker_duration: 97000, // 99 seconds --> 97000 milliseconds
        total_percentage: 100, // 100% --> round progress bar
        initial_current_minutes: 9, // minute field available if format of time changes in future 
        initial_current_seconds: 98, // 98 seconds when clock starts
    }


    //Recording UI
    const [percentage, setPercentage] = useState(initial_state.total_percentage);
    const [totalseconds, settotalseconds] = useState(initial_state.total_seconds_duration);
    const [currentseconds, setcurrentseconds] = useState(initial_state.initial_current_seconds)
    const [currentminutes, setcurrentminutes] = useState(initial_state.initial_current_minutes)
    const [isRecording, setisRecording] = useState(false);
    const [noofthreadpost, setnoofthreadpost] = useState(1);
    const [timer_tracker, settimer_track] = useState(initial_state.timetracker_duration);
    const [recordingcomplete, setrecordingcomplete] = useState(false);
    const [generatedurls, setgeneratedurls] = useState([])
    const [generatedfilenames, setgeneratedfilenames] = useState([])
    const [tag, setTag] = useState('');
    const [audioduration, setaudioduration] = useState([])

    const genre_section = ['Arts', 'Entertainment', 'Finance', 'Hustle', 'Investing',
        'Knowledge',
        'Life', 'Motivation',
        'Technology',
        'Travel',
        'Wellness', 'Others'
    ];


    //user_token
    const token = useSelector(state => state.account.token)




    //Post details
    const [imagetext, setimagetext] = useState("")
    const [imageresult, setimageresult] = useState([])
    const [selected_imageurl, setselected_imageurl] = useState("");
    const [selectedimage, setselectedimage] = useState(false);
    const [loadingimages, setloadingimages] = useState(false);



    const history = useHistory();


    //Recorder 
    const Mp3Recorder = new MicRecorder({ bitRate: 128 });
    let currentmedia = useRef(null);
    let timeout = useRef(null);
    const remaining_time_ref = React.useRef(null);
    remaining_time_ref.current = initial_state.timetracker_duration;



    //Button Disable functionality
    const seconds_interval_ref = React.useRef(null);
    const startrecording_interval_ref = React.useRef(null);
    const endrecording_interval_ref = React.useRef(null);
    const timertracker_ref = React.useRef(null);


    //data adding functionality for continious flow
    const [data, setData] = useState([]);

    //modal
    Modal.setAppElement('#root');
    const [deletemodalisOpen, setdeletemodalIsOpen] = useState(false);


    //toggle share modal
    const toggleModal = () => {
        setdeletemodalIsOpen(!deletemodalisOpen);
    }


    useEffect(() => {
        endrecording_interval_ref.current.disabled = true;
        startrecording_interval_ref.current.disabled = true;


        //get audio permission
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function () {
                console.log('getUserMedia completed successfully.');
                currentmedia.current = Mp3Recorder
                startrecording_interval_ref.current.disabled = false;
            })
            .catch(function (error) {
                toast.error("Please allow audio user permission")
                console.log(error.name + ": " + error.message);
            });
    }, [])





    //change progressbar on recording
    const change_progressbar_input = (timer) => {
        setPercentage((timer / initial_state.total_seconds_duration) * 100)
    };



    //generate current seconds and minute
    const getcurrentminutesandseconds = (timer) => {
        console.log(timer)
        let int_timer = Number(timer)
        // if ((Math.floor(int_timer % 3600 % 60)).toString().length <= 1) {
        //     let str = "0" + Math.floor(int_timer % 3600 % 60).toString();
        //     var minutes = Math.floor(int_timer / 60);
        //     setcurrentminutes(minutes)
        //     setcurrentseconds(str)
        // }
        // else {
        //     var minutes = Math.floor(int_timer / 60);
        //     setcurrentminutes(minutes)
        //     setcurrentseconds(Math.floor(Number(timer) % 3600 % 60))
        // }
        if (timer.length <= 1) {

            let str = "0" + Math.floor(int_timer).toString();
            setcurrentseconds(str)
        }
        else {
            setcurrentseconds(int_timer)
        }
    }


    //update the fields of post details based on the no of audio files generated
    const updateFieldChanged = index => e => {
        let newArr = [...data];
        newArr[index] = {
            id: index,
            value: e.target.value
        }
        setData(newArr);
    }

    //timeinterval wrapper to get minutes and seconds
    const getsecondsandminutes = () => {
        settotalseconds((total) => {

            if (total < 1) {
                clearInterval(seconds_interval_ref)
                return total
            }
            change_progressbar_input(total - 1)
            getcurrentminutesandseconds(total - 1)
            return total - 1;
        })
    }


    //timeinterval for start recording
    const start_recording_intervals = () => {

        startrecording_interval_ref.current.disabled = true;
        endrecording_interval_ref.current.disabled = false;

        seconds_interval_ref.current = setInterval(() => {
            getsecondsandminutes();
        }, 1000);
        currentmedia.current
            .start()
            .then(() => {
                console.log('started')

            }).catch((e) => console.error(e));
        split_audio();
        track_time();
    }


    const split_audio = () => {
        timeout.current = setInterval(() => {
            //split audio after 10 minutes
            splitstop();
        }, initial_state.timetracker_duration);
    }


    //update timer evry second
    const track_time = () => {
        timertracker_ref.current = setInterval(() => {
            settimer_track((prev) => {

                if (prev <= 0) {
                    clearInterval(timertracker_ref.current)
                }

                return prev - 1000
            })
        }, 1000)
    }




    // start a new media stream if audio goes above 10 minutes
    const startnavigator = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function () {
                console.log('getUserMedia completed successfully.');
                currentmedia.current = Mp3Recorder
                settimer_track(initial_state.timetracker_duration)
                settotalseconds(initial_state.total_seconds_duration)

                setnoofthreadpost((prevno) => {
                    toast.success(`Recording thread no. ${prevno}`)
                    return prevno + 1
                })
                //start recording 
                startRecording_again();
            })
            .catch(function (error) {
                toast.error("Please allow audio user permission")
                console.log(error.name + ": " + error.message);
            });
    }




    //start recording again after 10 minutes
    const startRecording_again = () => {
        currentmedia.current
            .start()
            .then(() => {
                console.log("start again")

            }).catch((e) => console.error(e));
    }





    //get current audio and save it and start a new stream
    const splitstop = () => {
        currentmedia.current
            .stop()
            .getMp3()
            .then(([buffer, blob]) => {
                getBlobDuration(blob).then(function (duration) {
                    setaudioduration((prev) => [...prev, duration])
                });
                const file = new File(buffer, 'music.mp3', {
                    type: blob.type,
                    lastModified: Date.now()
                });
                return file;
            })
            .then((file) => {
                const formData = new FormData();
                formData.append('file', file);
                fetch(`${UPLOAD_AUDIO}/`, {
                    mode: 'cors',
                    method: "POST",
                    body: formData,
                })
                    .then(response => {
                        return response.json();
                    })
                    .then((response) => {
                        setgeneratedurls(oldurls => [...oldurls, response.publicUrl]);
                        setgeneratedfilenames(oldfilenames => [...oldfilenames, response.filename])
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            })
            .catch((e) => console.log(e));
        startnavigator();
    }


    //set image
    const handleimage = (image_url) => {
        // console.log(image_url)
        setselected_imageurl(image_url)
        setimageresult([])
    }

    //end recording
    const end_recording_intervals = () => {
        clearInterval(seconds_interval_ref.current)
        clearInterval(timeout.current)
        endrecording_interval_ref.current.disabled = true;
        setrecordingcomplete(true);


        currentmedia.current
            .stop()
            .getMp3()
            .then(([buffer, blob]) => {

                //get total length of audio recorded
                getBlobDuration(blob).then(function (duration) {
                    setaudioduration((prev) => [...prev, duration])
                });
                const file = new File(buffer, 'music.mp3', {
                    type: blob.type,
                    lastModified: Date.now()
                });
                return file;
            })
            .then((file) => {

                const formData = new FormData();
                formData.append('file', file);

                fetch(`${UPLOAD_AUDIO}/`, {
                    mode: 'cors',
                    method: "POST",
                    body: formData,

                })
                    .then(response => {
                        return response.json();
                    })
                    .then((response) => {
                        setgeneratedurls(oldurls => [...oldurls, response.publicUrl]);
                        setgeneratedfilenames(oldfilenames => [...oldfilenames, response.filename])
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            })
            .catch((e) => console.log(e));
    }


    //image search

    const searchimage = () => {

        if (imagetext === "") {
            return;
        }
        setimageresult([])
        setloadingimages(true);
        const url = `${SPLASH_API}?page=1&client_id=${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}&query=${imagetext}`
        fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((res) => {
                setimageresult(res.results)
                setloadingimages(false)
            })
            .catch((err) => {
                console.log(err)
                setloadingimages(false)
            })
    }


    //delete audio
    const deleterecordedaudio = () => {
        setgeneratedurls([])
        setrecordingcomplete(false)
        window.location.reload();
    }

    //post all recorded audios
    const postallrecordedaudio = () => {

        //check if user has entered main post heading
        if (data[0] !== undefined) {
            if (data[0].value.length === 0) {
                toast.error("Main Post Heading is required!")
                return;
            }
            //main post
            let elapsed_time = audioduration[0];
            let posttype = "parent";
            let parent_id_post = null;
            let final_genre = tag;


            if (final_genre === "")
                final_genre = "others";
            let data_post = {
                post_heading: data[0].value,
                image_url: selected_imageurl,
                audio_duration: elapsed_time,
                post_time_length: 600,
                parent_id: parent_id_post,
                genre: final_genre,
                audio_file_name: generatedfilenames[0],
                audio_file_url: generatedurls[0],
                hashtag: null,
                post_type: posttype
            }
            fetch(`${UPLOAD_POST}`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data_post)
            })
                .then((response) => {
                    if (response.statusText == "Unauthorized") {
                        window.location.href = "/logout"
                    }
                    return response.json()
                })
                .then((res) => {
                    // console.log(generatedurls.length)
                    if (generatedurls.length > 1) {


                        //loop through thread audios
                        generatedurls.forEach((urls, index) => {
                            let post_thread_heading = `${data[0].value} [Thread]`

                            //check if user has entered thread post headings
                            if (data[index] !== undefined) {
                                if (data[index].value !== "") {
                                    post_thread_heading = data[index]
                                }
                            }

                            if (index !== 0) {
                                let data_post_thread = {
                                    post_heading: post_thread_heading,
                                    image_url: selected_imageurl,
                                    audio_duration: audioduration[index],
                                    post_time_length: 600,
                                    parent_id: res.post_id,
                                    genre: final_genre,
                                    audio_file_name: generatedfilenames[index],
                                    audio_file_url: generatedurls[index],
                                    hashtag: null,
                                    post_type: "thread"
                                }

                                fetch(`${UPLOAD_POST}`, {
                                    method: 'POST',
                                    mode: 'cors',
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${token}`,
                                    },
                                    body: JSON.stringify(data_post_thread)
                                })
                                    .then((response) => {
                                        if (response.statusText == "Unauthorized") {
                                            window.location.href = "/logout"
                                        }
                                        return response.json()
                                    })
                                    .then((res) => {

                                        if (index + 1 === generatedurls.length) {
                                            history.push("/")
                                        }
                                        console.log(res)
                                    })
                                    .catch((err) => {
                                        console.log(err)
                                    })
                            }
                        })
                    }
                    else {
                        history.push("/")
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        }

        else {
            toast.error("Main Post Heading is required!")
            return;

        }
    }


    return (
        <div className="addpostwrapper flex justify-center items-center mt-1 ">
            <ToastContainer autoClose={2400} />

            <Modal
                isOpen={deletemodalisOpen}
                onRequestClose={toggleModal}
                contentLabel="My dialog"
                className=" sharemodal z-50 bg-white p-4 md:p-7 md:h-96 md:w-96 h-80 w-80  absolute border-2 border-black outline-none rounded-lg"
            >
                <div className=" md:h-80 md:w-80 h-72 w-72  relative p-2">
                    <h2 className="text-xl font-extrabold">This will delete the recorded audio. Do you want to continue?</h2>
                    <div className="md:mt-52 mt-44 flex justify-around">
                        <button onClick={deleterecordedaudio} className="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded ">Delete</button>
                        <button onClick={toggleModal} className="bg-red-500 hover:bg-red-700 text-white  py-2 px-4 rounded">Close</button>
                    </div>
                </div>
            </Modal>

            <div className="addpostcontent rounded-2xl p-3 mt-6">
                <div className=" border-2 border-gray-300 p-4">
                    <div className="addpost-header flex justify-center p-3 text-center  tracking-wider text-lg font-normal rounded-xl border-2">
                        Express what's on your mind !
                    </div>
                </div>
                <div className="addpostrecordcontent border-2 border-gray-300 p-4">

                    {(recordingcomplete && generatedurls.length === 0)
                        &&
                        (<div className=" flex justify-center mt-2">
                            <Loader
                                type="Puff"
                                color="#00BFFF"
                                height={70}
                                width={70}
                            />
                        </div>)
                    }

                    {recordingcomplete ?
                        (<>
                            {generatedurls.map((url, index) => (
                                <div key={index} className="">
                                    {(index === 0)
                                        ?
                                        (
                                            <>
                                                <Accordion preExpanded={[0]}>
                                                    <AccordionItem uuid={0}>
                                                        <AccordionItemHeading>
                                                            <AccordionItemButton>
                                                                Main Post
                                                            </AccordionItemButton>
                                                        </AccordionItemHeading>
                                                        <AccordionItemPanel>
                                                            <div className="p-4 bg-gray-200 mt-4 rounded-2xl">
                                                                <div className="flex justify-center items-center">
                                                                    <audio className="mr-2" src={url} controls />
                                                                </div>
                                                                <div className="flex justify-center mt-4 ">
                                                                    <div>
                                                                        <div className="mb-4 ">
                                                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                                                                Post Heading
                                                                            </label>
                                                                            {
                                                                                (data[index] !== undefined) ?

                                                                                    (
                                                                                        <input value={data[index].value} onChange={updateFieldChanged(index)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Post Heading" />

                                                                                    )
                                                                                    :
                                                                                    (
                                                                                        <input onChange={updateFieldChanged(index)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Post Heading" />
                                                                                    )

                                                                            }
                                                                        </div>
                                                                        <div className="mb-6">
                                                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                                                                Image
                                                                            </label>
                                                                            <div className="flex items-center">
                                                                                <input value={imagetext} onChange={(e) => setimagetext(e.target.value)} className="shadow appearance-none border   w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline mt-1" id="password" type="text" placeholder="Search for an image" />
                                                                                <button className="search-button bg-blue-500 p-2 text-white rounded-r-xl" onClick={() => {
                                                                                    setselected_imageurl("")
                                                                                    searchimage()
                                                                                }}>Search</button>

                                                                            </div>
                                                                            <div className="imagecontainer flex   flex-wrap justify-center cursor-pointer ">
                                                                                {

                                                                                    imageresult.map((imagearray, index) => {

                                                                                        if (index < 6) {
                                                                                            return (<img key={index} onClick={() => handleimage(imagearray.urls.regular)} className="images md:w-28 md:h-28 h-20 w-20 m-1 transform hover:scale-105 rounded-xl" src={imagearray.urls.thumb} alt="" />)
                                                                                        }


                                                                                    })
                                                                                }
                                                                            </div>
                                                                            <div>
                                                                                {(selected_imageurl.length > 0) &&
                                                                                    <div className=" flex justify-center">
                                                                                        <img className="images md:w-36 md:h-36 h-36 w-36 m-1 transform rounded-xl" src={selected_imageurl} alt="" />
                                                                                    </div>
                                                                                }
                                                                                {loadingimages &&
                                                                                    (
                                                                                        <div className=" flex justify-center mt-2">
                                                                                            <Loader
                                                                                                type="Puff"
                                                                                                color="#00BFFF"
                                                                                                height={70}
                                                                                                width={70}
                                                                                            />

                                                                                        </div>
                                                                                    )
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                        <>
                                                                            <div className="time-post font-semibold text-gray-800">Genre</div>
                                                                            <div className="time-input tag-cont">
                                                                                {genre_section.map((ele) => (
                                                                                    <div
                                                                                        onClick={() => {
                                                                                            setTag(ele);
                                                                                        }}
                                                                                        className={ele === tag ? 'tag active' : 'tag'}
                                                                                    >
                                                                                        {ele}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </>
                                                                    </div>

                                                                </div>

                                                                <div className=" p-2 flex  md:mr-5 justify-end ">
                                                                    <button onClick={toggleModal} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded  w-20 md:w-40 flex items-center justify-center">Delete </button>

                                                                </div>

                                                            </div>
                                                        </AccordionItemPanel>
                                                    </AccordionItem>

                                                </Accordion>

                                            </>

                                        )
                                        :
                                        (
                                            <>
                                                <Accordion allowZeroExpanded>
                                                    <AccordionItem key={index} >
                                                        <AccordionItemHeading>
                                                            <AccordionItemButton>
                                                                Thread Post {index}
                                                            </AccordionItemButton>
                                                        </AccordionItemHeading>
                                                        <AccordionItemPanel>
                                                            <div className="p-4 bg-gray-200 mt-4 rounded-2xl">
                                                                <div className="flex justify-center items-center">
                                                                    <audio className="mr-2" src={url} controls />
                                                                </div>
                                                                <div className="flex justify-center mt-4 ">
                                                                    <div>
                                                                        <div className="mb-4 md:w-96">
                                                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                                                                Post Heading
                                                                            </label>

                                                                            {
                                                                                (data[index] !== undefined)
                                                                                    ?

                                                                                    (
                                                                                        <input value={data[index].value} onChange={updateFieldChanged(index)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Post Heading" />

                                                                                    )
                                                                                    :
                                                                                    (
                                                                                        <input onChange={updateFieldChanged(index)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Post Heading" />

                                                                                    )

                                                                            }
                                                                        </div>

                                                                    </div>

                                                                </div>

                                                            </div>
                                                        </AccordionItemPanel>
                                                    </AccordionItem>
                                                </Accordion>
                                            </>
                                        )
                                    }
                                </div>
                            ))
                            }

                            {(recordingcomplete && generatedurls.length !== 0) &&
                                < div className=" p-2 flex md:justify-end md:mr-5 justify-center">
                                    <button onClick={postallrecordedaudio} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-40 flex items-center justify-center"><span className="mr-2">Post</span> <FaLocationArrow className="ml-2" /></button>
                                </div>
                            }
                        </>)
                        :
                        (<>
                            <div className="text-center text-xl tracking-wider font-semibold">
                                {(noofthreadpost > 1) && `Recording Thread No: ${noofthreadpost - 1}`}
                                <div className="h-56 p-4 relative flex  justify-center md:mt-10">
                                    {isRecording ?
                                        (
                                            <CircularProgressbar styles={buildStyles({
                                                pathColor: `#03c000`,
                                                textColor: '#494949',
                                                trailColor: '#d6d6d6',
                                            })} strokeWidth={5} value={percentage} text={`${currentseconds}s`} />

                                        )
                                        :
                                        (
                                            <CircularProgressbar styles={buildStyles({
                                                pathColor: `#03c000`,
                                                textColor: '#494949',
                                                trailColor: '#d6d6d6',
                                            })} strokeWidth={5} value={percentage} text={`99s`} />

                                        )
                                    }
                                </div>
                                <div className=" flex justify-center md:mt-10">
                                    <div className="buttons flex justify-evenly w-96 md:flex-row flex-col items-stretch ">
                                        <button ref={startrecording_interval_ref} className="startrecording p-3 border-2   md:w-40 rounded-xl mr-2 mb-2" onClick={() => { setisRecording(true); start_recording_intervals() }}>Start Recording</button>
                                        <button ref={endrecording_interval_ref} className="endrecording p-3 border-2 text-white md:w-40 rounded-xl mb-2" onClick={() => { end_recording_intervals() }} >Stop Recording</button>
                                    </div>
                                </div>
                            </div>
                        </>)
                    }
                </div>
            </div>
        </div >
    )
}


export default AddPost
