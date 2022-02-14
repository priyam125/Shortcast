import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { EDIT_PROFILE, FETCH_PROFILE_DETAILS, FIND_USERNAME } from '../Utils/apiroutes'
import { UPDATE_AVATAR, UPDATE_USER } from '../Redux/actions'
import { ToastContainer, toast } from 'react-toastify';


const EditProfile = () => {
    const [adjectiveField, setAdjectiveField] = useState()
    const [generateurl, setGenerateurl] = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgLkZXLONpZqCT138_8z2zc3X8LAnLDOhebw&usqp=CAU");
    const [userDetails, setUserDetails] = useState({});
    const [fullname, setFullname] = useState("")
    const [twitter, setTwitter] = useState("")
    const [bio, setBio] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [usernameerror, setusernameerror] = useState(false);
    // const [username, setusername] = useState("")


    const id = useSelector(state => state.account.user)
    const token = useSelector(state => state.account.token)
    const current_username = useSelector(state => state.account.userdata.username)
    const dispatcher = useDispatch();



    useEffect(() => {
        // console.log(id);

        axios.get(`${FETCH_PROFILE_DETAILS}${id}/`, {
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
            .then((res) => {
                setUserDetails(res.data.data)
                setUsername(res.data.data.username)
                setEmail(res.data.data.email_id)
                setFullname(res.data.data.full_name);
                setTwitter(res.data.data.twitter_handle);
                setBio(res.data.data.bio);
                if (res.data.data.avatar_link.length !== 0) {
                    setGenerateurl(res.data.data.avatar_link)
                }
            })
    }, [id, token])

    const handleChange = (e) => {
        if (e.target.name === "full_name")
            setFullname(e.target.value)
        if (e.target.name === "twitter_handle")
            setTwitter(e.target.value)
        if (e.target.name === "bio")
            setBio(e.target.value)
        if (e.target.name === "username") {
            setUsername(e.target.value)
            setusernameerror(false);

            let data = {
                "username": e.target.value
            }

            axios.post(FIND_USERNAME, data, {
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
                .then((res) => {
                    if (res.data.username_error && e.target.value !== current_username) {
                        setusernameerror(true);
                    }
                })

        }
    }

    const generateAvatar = () => {

        const url = `https://robohash.org/${adjectiveField}`
        setGenerateurl(url);
        let data = {
            full_name: fullname,
            twitter_handle: twitter,
            bio: bio,
            avatar_link: url
        }

        axios.patch(EDIT_PROFILE, data, {
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
            .then((res) => {
                dispatcher({
                    type: UPDATE_AVATAR,
                    payload: { user_avatar: url }
                });
            })
            .catch((err) => {
                console.log((err));
            })
    }


    const handleSubmit = (e) => {

        e.preventDefault()

        if (usernameerror) {
            toast.error("Please enter valid username")
            return;
        }

        let data = {
            username : username,
            full_name: fullname,
            twitter_handle: twitter,
            bio: bio,
            avatar_link: generateurl
        }
        console.log(data)
        axios.patch(EDIT_PROFILE, data, {
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
            .then((res) => {
                axios.get(`${FETCH_PROFILE_DETAILS}${id}/`, {
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                })
                    .then((res) => {
                        dispatcher({
                            type: UPDATE_USER,
                            payload: { user: res.data.data }
                        });
                        window.location.href = '/'
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            })
            .catch((err) => {
                console.log((err));
            })
    }





    return (
        <div className="py-12">
                <ToastContainer autoClose={2400} />
            <div className="w-11/12 h-auto bg-white m-auto py-24 flex flex-col justify-center items-center rounded-3xl
             ">
                <div className="flex flex-col justify-center items-center md:w-5/6">
                    <div className=" h-32 w-32 border-2 border-gray-500 rounded-full overflow-hidden">
                        <img className="rounded-full border-gray-500 border-2 w-auto" src={generateurl} alt="AVATAR" />
                    </div>
                    <div className="flex flex-col md:flex-row justify-center md:space-x-1 items-center py-4 w-full">
                        <div className="mb-6 md:mb-2 lg:w-2/5">
                            <input value={adjectiveField} onChange={(e) => setAdjectiveField(e.target.value)} type="text" name="adjectives" placeholder="Write 3 adjectives that best describe you" className="border-gray-300 border-2 rounded-md p-3 lg:w-full" />
                        </div>
                        <button onClick={generateAvatar} className="bg-red-500 rounded-md py-1.5 lg:py-4 px-4 text-white mb-2">Generate Avatar</button>
                    </div>
                    <div className="w-full px-2 mt-2 border-gray-400 border-b"></div>
                    <form className="bg-white rounded-tr-3xl px-4 py-6 flex flex-col justify-center lg:items-center w-full lg:w-3/5" onSubmit={handleSubmit}>

                        <div className="w-full pb-6">
                            <div className="py-2">Full Name</div>
                            <input name="full_name" value={fullname} className="border-2 border-gray-300 p-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow w-full focus:outline-none focus:ring " placeholder="" onChange={handleChange} />
                        </div>
                        <div className="w-full pb-6">
                            <div className="py-2">Email address</div>
                            <input type="email" name="email" disabled className="border-2 border-gray-300 p-4 placeholder-gray-500 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full" placeholder={email} />
                        </div>
                        <div className="w-full pb-3">
                            <div className="py-2">Username</div>
                            <input type="username" name="username" className="border-2 border-gray-300 p-4 placeholder-gray-500 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full" value={username} onChange={handleChange} />
                        </div>
                        {usernameerror && (
                            <div className="text-red-500 mb-2">Username already exists</div>
                        )}
                        <div className="w-full pb-6">
                            <div className="py-2">Twitter Handle</div>
                            <div className="flex justify-center items-center">
                                <div className="items-center justify-center border-2 border-gray-300 py-3 px-2 rounded-sm">@</div>
                                <input value={twitter} name="twitter_handle" className="border-2 border-gray-300 p-4 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full" placeholder="Twitter handle" onChange={handleChange} />
                            </div>
                        </div>
                        <div className="w-full pb-6">
                            <div className="py-2">What describes you?</div>
                            <textarea rows="5" cols="50" name="bio" value={bio} className="border-2 border-gray-300 p-4 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full" onChange={handleChange} />
                        </div>
                        <button className="bg-green-400 text-white flex justify-center items-center border-2 rounded-md py-1.5 px-1 text-md font-bold w-28 left-0">
                            Save Details
                        </button>
                    </form>
                </div>
            </div>
        </div>

    )
}


export default EditProfile