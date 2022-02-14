import React, { useState, useEffect, useRef } from 'react'
import { LISTEN_NOTES_GET_DUMMY_USERS, LISTEN_NOTES_GET_GENRES, LISTEN_NOTES_GET_PODCASTS, LISTEN_NOTES_POST_LISTEN_NOTES } from '../../Utils/apiroutes'
import Select from 'react-select'
import { ToastContainer, toast } from 'react-toastify';
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Checkbox from 'react-simple-checkbox';
import { useSelector } from "react-redux"
import {  AiOutlineUpload } from "react-icons/ai";





const Listen_notes = () => {

    const [options, setoptions] = useState([])
    const [query, setquery] = useState("");
    const [adddata, setadddata] = useState([])
    const [selecteddata, setselecteddata] = useState([])

    const persist_query = useRef();
    const persist_nextoffset = useRef();
    const persist_genre = useRef();


    const [offset, setoffset] = useState(0);
    const [results, setresults] = useState([]);
    const [multivalue, setmultivalue] = useState([]);
    const [multivalueid, setmultivalueid] = useState([])
    const [loadingresults, setloadingresults] = useState(false);
    const [emptyresults, setemptyresults] = useState(false);
    const [nextoffset, setnextoffset] = useState(null);
    const prevref_ref = useRef(null);

    let options1 = []
    let itemsid_array=[]
    let nextitemsid_array = []
    // let genreArray_dup





    const [resultssearched, setresultssearched] = useState(false);


    const [users, setusers] = useState([]);


    const [genreList, setGenreList] = useState([])
    const [genreArray, setGenreArray] = useState([])
    

    const [selecteduser, setselecteduser] = useState("");


    const token = useSelector(state => state.account.token)



    let type = "episode";
    let len_max = 30;
    let language = "English";




    useEffect(() => {
        setGenreArray([])
        const onScroll = function (e) {
            e.preventDefault();

            if (
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 2
            ) {
                if (prevref_ref.current != "true") {
                    console.log("here")
                    callnextposts();
                }
            }
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);


    //call next posts
    const callnextposts = () => {
        prevref_ref.current = "true";

        if (persist_nextoffset.current == 0) {
            prevref_ref.current = "false";
            return;
        }
        fetch(`${LISTEN_NOTES_GET_PODCASTS}?q=${persist_query.current}&len_max=${len_max}&language=${language}&type=${type}&genre_ids=${persist_genre.current}&offset=${persist_nextoffset.current}`, {
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-ListenAPI-Key': `${process.env.REACT_APP_LISTENER_KEY}`
            },
        })
            .then((res) => {

                setloadingresults(false)

                return res.json();
            })
            .then((res) => {

                console.log(res);

                let item_array = []
                res.results.forEach((item) => {
                    // console.log(item.podcast.genre_ids);
                    
                    item_array.push(item.podcast.genre_ids)
                    
                    
                    // item_array.push(options.find(element => element.value === item.podcast.genre_ids[0]).label)

                    
                    
                })
                console.log(item_array);
                item_array.map((item) => {
                    console.log(item);
                    let id_array = []
                    item.map((items) => {
                        console.log(items);
                        // let idopr = options.find(element => element.value === items).label
                        // console.log(idopr);
                        let idopr = options.find(element => element.value === items).label
                        // console.log(idopr);
                        id_array.push({value: items, label: idopr})

                    })
                    console.log(id_array);
                    nextitemsid_array.push(id_array)
                    

                })

                console.log(nextitemsid_array);
                // item_array.map((item) => {
                //     let id_array=[]
                //     item.map((items) => {
                //         let idopr = options.find(element => element.value === items).label
                //         // console.log(idopr);
                //         id_array.push({value: items, label: idopr})
                //     })
                //     console.log(id_array);
                //     itemsid_array.push(id_array)
                // })
                // console.log(itemsid_array);
                // setGenreList(...genreList, itemsid_array)





                prevref_ref.current = "false";

                setresults((old) => {
                    console.log(old)
                    return [...old, ...res.results];
                });

                persist_nextoffset.current = res.next_offset
                setloadingresults(false)
                setresultssearched(true)
            })
            .catch((err) => {
                console.log(err)
            })
    };




    useEffect(() => {


        const getgenres = () => {

            fetch(`${LISTEN_NOTES_GET_GENRES}`, {
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-ListenAPI-Key': `${process.env.REACT_APP_LISTENER_KEY}`
                },
            })
                .then((res) => {
                    return res.json();
                })
                .then((res) => {
                    console.log(res)
                    let options_array = [];
                    res.genres.forEach((genre) => {
                        options_array.push({ value: genre.id, label: genre.name })
                    })
                    console.log(options_array);
                    setoptions(options_array)
                    
                })
                .catch((err) => {
                    console.log(err)
                })
        }


        const getusers = () => {
            fetch(`${LISTEN_NOTES_GET_DUMMY_USERS}`, {
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
                .then((res) => {
                    console.log(res)
                    return res.json();
                })
                .then((res) => {
                    console.log(res)
                    let user_array = [];
                    res.forEach((user) => {
                        user_array.push({ value: user.user_id, label: user.username })
                    })
                    setusers(user_array)

                })
                .catch((err) => {
                    console.log(err)
                })

        }


        getgenres();
        getusers();



    }, [])


    const handleuserchange = (value) => {
        console.log(value)
        setselecteduser(value);
    }




    const getpodcast = () => {
        
        console.log(genreArray);


        if (query == "") {
            toast.error("Query field cannot be empty")

            return;
        }
    
        persist_query.current = query;



        setloadingresults(true)
        setemptyresults(false)
        let genreid = multivalueid.join(",");
        console.log(genreid)

        fetch(`${LISTEN_NOTES_GET_PODCASTS}?q=${query}&len_max=${len_max}&language=${language}&type=${type}&genre_ids=${genreid}&offset=${offset}`, {
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-ListenAPI-Key': `${process.env.REACT_APP_LISTENER_KEY}`
            },
        })
            .then((res) => {
                console.log(res)
                setloadingresults(false)

                return res.json();
            })
            .then((res) => {
                console.log(res)
                if (res.results.length == 0) {
                    setemptyresults(true)
                }


                
                let item_array = []
                res.results.forEach((item) => {
                    // console.log(item.podcast.genre_ids);
                    
                    item_array.push(item.podcast.genre_ids)
                    
                    
                    // item_array.push(options.find(element => element.value === item.podcast.genre_ids[0]).label)

                    
                    
                })
                console.log(item_array);
                item_array.map((item) => {
                    let id_array=[]
                    item.map((items) => {
                        let idopr = options.find(element => element.value === items).label
                        // console.log(idopr);
                        id_array.push({value: items, label: idopr})
                    })
                    console.log(id_array);
                    itemsid_array.push(id_array)
                })
                console.log(itemsid_array);
                setGenreList(itemsid_array)

                // options1.push({ value: genre.id, label: genre.name })
                // setGenreList(...genreList, item_array)


                setnextoffset(res.next_offset)
                persist_nextoffset.current = res.next_offset
                persist_genre.current = genreid
                setresults(res.results)
                setloadingresults(false)
                setresultssearched(true)
            })
            .catch((err) => {
                console.log(err)
            })
    }







    const handleMultiChange = (option) => {
        let value_array_id = []

        option.forEach((option_selected) => {
            value_array_id.push(option_selected.value)
        })
        console.log(value_array_id)
        setmultivalueid(value_array_id)
        setmultivalue(option)
    }


    const addlisten = (id, audio_object) => {
        console.log(id)
        console.log(genreList);
        console.log(`Selected data is ${selecteddata}`);

        if (adddata.includes(id)) {
            let temp_data = [...adddata]
            let selected_data = [...selecteddata];

            

            const index = temp_data.indexOf(id);
            if (index > -1) {
                temp_data.splice(index, 1);
                selected_data.splice(index, 1);

                setadddata(temp_data)
                setselecteddata(selected_data)
            }
        }
        else {
            setadddata([...adddata, id])
            setselecteddata([...selecteddata, audio_object])

        }

    }


    const handleupload = () => {
        console.log(selecteddata)
        console.log(selecteduser)


        let upload_object = {
            "post_list": []
        }
        let errors = false
        let index1
        selecteddata.forEach((data,index) => {
            console.log(data)
            let individual_object = {};
            console.log(genreArray);

            let value = genreArray.find(element => element.label == data.id)
            console.log(value);
            if(value) {
                individual_object.post_heading = data.title_original
            individual_object.image_url = data.image
            individual_object.audio_file_name = `${data.id}.mp3`
            individual_object.audio_file_url = data.audio
            individual_object.audio_duration = data.audio_length_sec
            individual_object.user_id = selecteduser.value
            individual_object.post_likes_count = 0
            individual_object.post_plays_count = 0
            individual_object.post_time_length = data.audio_length_sec
            individual_object.parent_id = null
            individual_object.hashtag = null
            // individual_object.genre = options.find(element => element.value === data.podcast.genre_ids[0]).label
            
            individual_object.genre = genreArray.find(element => element.label === data.id).value
            
            console.log(individual_object.genre);
            individual_object.post_status = "active"
            individual_object.post_type = "parent"

            upload_object.post_list.push(individual_object)
            } else {
                errors=true
                index1 = index
            }



            

        })

        if(errors) {
            toast.error(`Genre field of ${index1+1} element empty`)
        } else {
            console.log(upload_object);

            fetch(`${LISTEN_NOTES_POST_LISTEN_NOTES}`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(upload_object)
            })
            .then((res)=>{
                console.log(res);
                toast.success("Audio posted succesfully")
                setselecteddata([])
                setresults([])
                setadddata([])
                setquery("");
    
            })
            .then((res)=>{
                console.log(res)
            })
            .catch((err)=>{
                console.log(err)
            })
    
    
            console.log(upload_object)


        }

    }

    useEffect(() => {
        console.log(adddata, selecteddata, selecteduser)
    }, [adddata, selecteddata, selecteduser])

    const handleGenreChange = (value, id) => {
        let id_matched = false
        console.log(value);
        console.log(id);
        console.log(`GenreArray ${genreArray}`);
        let genreArray_dup = genreArray
        console.log(genreArray_dup);
        if(genreArray_dup.length > 0) console.log(true)
        else console.log(false);

        // genreArray_dup.push({value: value.label, label: id})

        if(genreArray_dup) {
            genreArray_dup.map((genre, index) => {
                if(genre.label == id) {
                    id_matched=true
                    genreArray_dup[index].value = value.label
                    // genreArray_dup[index].label = id
                    // genreArray_dup.splice(-1) 
                } 
                
            })
            
            
        }



        genreArray_dup.push({value: value.label, label: id})
            if(id_matched) {
                genreArray_dup.splice(-1)
            }

        
        

        

        console.log(genreArray_dup);
        // setGenreArray(oldArray => [...oldArray, {value: value.label, label: id}]);

        setGenreArray(genreArray_dup)
        console.log(genreArray);
        
        
        
    }

    useEffect(() => {
        console.log(genreArray);
        // console.log(genreArray_dup);
    }, [genreArray])

    useEffect(() => {
        // console.log(selecteddata);
        // console.log(options);
        // console.log(genreArray);
    })



    return (
        <div>
            <ToastContainer autoClose={2400} />


            <div className="m-10 flex justify-center">
                <Select placeholder="User" className="md:w-3/6 w-96" options={users} onChange={handleuserchange} />
            </div>

            <div className="mx-10 flex justify-center">

                <Select placeholder="Genres" className="md:w-3/6 w-96" options={options} isMulti onChange={handleMultiChange} value={multivalue} />
            </div>



            <div className="inputfield mt-10 flex justify-center items-center">
                <input value={query} onChange={(e) => setquery(e.target.value)} className="md:w-3/6 w-3/5 p-3 border-t-2 border-l-2 border-b-2 border-black border-r-2 rounded-tl-xl rounded-bl-xl" placeholder="Search podcasts..." type="text" />
                <button onClick={getpodcast} className="primarycolor p-3 border-t-2 border-r-2 border-b-2 border-black rounded-tr-xl rounded-br-xl ">Search</button>
            </div>



            {
                selecteddata.length !== 0 &&
                (
                    <div className="flex justify-center items-center mt-5">
                        <h2 className="bg-white border-2 p-2 rounded-l-lg flex items-center border-black font-bold ">{selecteddata.length} </h2>
                        <button onClick={handleupload} className="bg-black p-2 text-white rounded-r-lg flex items-center w-36 justify-around border-2 border-black">Upload <AiOutlineUpload className="text-xl" /></button>

                    </div>
                )
            }


            {
                !loadingresults && !emptyresults &&






                <>




                    {

                        results.map((audio,index) => {

                            let options_genre = []
                            // console.log(audio);
                            let audio2 = audio
                            
                            
                            // audio.podcast.genre_ids.map((genre) => {
                            //     console.log(genre);
                            // })
                            // console.log(audio);
                            // audio.podcast.genre_ids.map()
                            // console.log(options);
                            
                            
                            
                            return (

                                <>
                            <div key={audio.id} className="flex justify-center items-center ">
                                <div className="mt-10">
                                    <Checkbox
                                        checked={adddata.includes(audio.id)}
                                        size="3"
                                        tickSize="4"
                                        borderThickness="3"
                                        name="one"
                                        color="#fabf1b"
                                        tickAnimationDuration="100"
                                        backAnimationDuration="100"
                                        onChange={() =>
                                            addlisten(audio.id, audio)
                                        }
                                    />
                                </div>
                                

                                <div className="flex relative lg:items-start lg:w-4/6 xl:3/6 soundiv w-72  items-center flex-col justify-center mt-10 md:mx-10 mx-3 rounded-2xl primarycolor p-5 border-2 border-gray-500 lg:p-10 ">

                                
                                



                                    <h2 onClick={() => console.log(options)} className="font-semibold tracking-wide mt-2 mb-8 m-10 text-xl text-center w-72 lg:w-3/5">{audio.title_original}</h2>
                                    <div className='md:hidden top-0 left-0 pb-2'>
                                        <Select options={genreList[index]} onChange={(e) => handleGenreChange(e,audio.id)}></Select>                                    </div>
                                    <audio className="lg:ml-10 lg:w-3/5 w-60" controls id="beep" >
                                        <source src={audio.audio} type="audio/mp3" />
                                        Your browser does not support the audio tag.
                                    </audio>
                                    <img onClick={() => console.log(audio.podcast.genre_ids)} className="   h-40 md:mt-10 mt-5 w-40 rounded-xl md:mb-10 mb-5 lg:absolute right-2" src={audio.image} />

                                </div>
                            
                            <div className='md:block hidden'>
                                <Select options={genreList[index]} onChange={(e) => handleGenreChange(e,audio.id)}></Select>
                            </div> 
                            </div>
                            
                            </>


                        )})
                    }

                </>


            }

            {
                loadingresults &&

                <div className=" flex justify-center mt-2">
                    <Loader
                        type="Puff"
                        color="#00BFFF"
                        height={70}
                        width={70}
                    />
                </div>

            }
            {
                emptyresults &&

                <div className="flex justify-center mt-10 text-2xl">
                    No results found
                </div>
            }

        </div >
    )
}

export default Listen_notes
