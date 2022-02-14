import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AiFillCaretDown } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import { RiFeedbackFill } from "react-icons/ri";
import { BiLogOut } from "react-icons/bi";
import { USER_PROFILE, } from '../../Utils/apiroutes'
import { UPDATE_USER, UPDATE_AVATAR } from '../../Redux/actions';
import { FaMicrophone } from "react-icons/fa";
import { AiOutlineUpload } from "react-icons/ai";



const Nav = () => {


    //navbar

    const [navbarisopen, setnavbarisopen] = useState(false)
    const [generateUrl, setGenerateUrl] = useState("https://robohash.org/dummy")
    const location = useLocation();
    const [isProfilepage, setisProfilepage] = useState(false);

    const [userDetails, setUserDetails] = useState({})
    const [username, setusername] = useState();
    const [isDesktop, setDesktop] = useState(window.innerWidth > 800);

    const dispatcher = useDispatch();


    //dropdown ref
    const dropdown = useRef(null);
    const id = useSelector(state => state.account.user)
    const issuper = useSelector(state => state.account.issuper);
    const token = useSelector(state => state.account.token)
    const avatar_link = useSelector(state => state.account.userdata.avatar_link)



    useEffect(() => {
        window.addEventListener("click", handleclick);
        return () => {
            document.removeEventListener('click', handleclick);
        };
    }, [])

    useEffect(() => {

        if (location.pathname.substr(0, 8) === "/profile") {
            setisProfilepage(true);
        }
        else {
            setisProfilepage(false)
        }




    }, [location])

    useEffect(() => {
        window.addEventListener("resize", updateMedia);
        return () => window.removeEventListener("resize", updateMedia);
    }, []);


    useEffect(() => {


        if (id === null) {
            return;
        }

        fetch(`${USER_PROFILE}${id}/`, {
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
            .then((res) => {
                // console.log(res)
                if (res.statusText === "Unauthorized") {
                    window.location.href = "/logout"
                }
                return res.json()
            })
            .then((res) => {

                setGenerateUrl(res.data.avatar_link)
                dispatcher({
                    type: UPDATE_AVATAR,
                    payload: { user_avatar: res.data.avatar_link }
                });
                setusername(res.data.username)
                setUserDetails(res.data);
                dispatcher({
                    type: UPDATE_USER,
                    payload: { user: res.data }
                });

            })
            .catch((err) => {
                console.log(err);
            })
    }, [])


    //update screen change
    const updateMedia = () => {
        setDesktop(window.innerWidth > 800);
    };

    //handle click outside
    const handleclick = (event) => {

        if (event.target.tagName === "H2" && event.target.classList[0] === "profileimage") {
            return;
        }

        if (event.target.tagName === "svg" && event.target.parentElement.parentElement !== null && event.target.parentElement.parentElement.classList[0] === "profile") {
            return;
        }
        if (event.target.tagName === "path" && event.target.parentElement.parentElement !== null && event.target.parentElement.parentElement.classList[0] === "profilename") {
            return;
        }
        if (event.target.tagName === "DIV" && event.target.classList[0] === "profilename") {
            return;
        }


        if (dropdown.current !== null && !dropdown.current?.contains(event.target)) {
            setnavbarisopen(false)
        }
    }


    return (
        <>
            <div className="navbar h-14 flex items-center justify-between">
                <Link to="/">
                    <div className="logo flex items-center  md:text-xl text-md tracking-wider px-3 md:px-0 ">
                        <img className="logoimagenav md:h-16 h-14 md:ml-5" src="/images/SHRTCAST_logo.jpg" alt="" />
                        {/* <h2 className="hidden md:block"></h2> */}
                        {/* <img className="h-9 w-52" src={`/images/SHRTCAST_text.jpg`} alt="" /> */}
                    </div>
                </Link>
                <div className="profile flex items-center">
                    {isProfilepage && (
                        <Link to="/addpost">
                            <div className="createbutton mr-3 text-md bg-black  cursor-pointer text-white pr-2 pl-2 pt-1 pb-1 rounded-lg   shadow-lg">
                                <button className="flex items-center space-between tracking-wide p-1 pt-2 pb-2 md:pt-1 md:pb-1 "><FaMicrophone className="" />
                                    {
                                        isDesktop &&
                                        <span className="ml-2">Create</span>
                                    }
                                </button>
                            </div>
                        </Link>
                    )}

                    <img className="h-12 w-12 rounded-full mr-2 border-2 border-white" src={avatar_link} alt="" />
                    <div onClick={() => setnavbarisopen(!navbarisopen)} className="profilename flex items-center p-1 pt-3 pb-3 md:pr-2 md:pl-2   cursor-pointer  md:mr-10 mr-2  rounded-lg">
                        <AiFillCaretDown className=" text-xl" />
                    </div>
                    <div ref={dropdown} className={`dropdown absolute top-14 right-3 bg-white p-5 rounded-lg  md:w-72 w-60 z-30 mt-3 ` + ((navbarisopen) ? "block" : "hidden")}>
                        <Link to={`/profile/${id}`}>
                            <div onClick={() => setnavbarisopen(false)} className="flex items-center p-3  mb-2 rounded-lg cursor-pointer hover:bg-gray-200 ">
                                <FaUserCircle className="md:text-xl text-2xl  " />
                                <span className="ml-3 text-md">Profile</span>
                            </div>
                        </Link>

                        <Link to='/feedback'>
                            <div onClick={() => setnavbarisopen(false)} className="flex items-center p-3 mb-2 rounded-lg cursor-pointer hover:bg-gray-200 ">
                                <RiFeedbackFill className="md:text-xl text-2xl text-gray-800 " />

                                <span className="ml-3">Feedback</span>
                            </div>
                        </Link>
                        {issuper &&
                            <Link to="/admin/ls">
                                <div className="flex items-center p-3  mb-2 rounded-lg cursor-pointer hover:bg-gray-200">

                                    <AiOutlineUpload className="md:text-xl text-2xl text-gray-800 " />
                                    <span className="ml-3">Listen Notes</span>
                                </div>
                            </Link>
                        }

                        {issuper &&
                            <Link to="/upload-excel">
                                <div className="flex items-center p-3  mb-2 rounded-lg cursor-pointer hover:bg-gray-200">

                                    <AiOutlineUpload className="md:text-xl text-2xl text-gray-800 " />
                                    <span className="ml-3">Upload Excel</span>
                                </div>
                            </Link>
                        }

                        
                        <Link to="/logout">
                            <div className="flex items-center p-3  mb-2 rounded-lg cursor-pointer hover:bg-gray-200">
                                <BiLogOut className="md:text-xl text-2xl text-gray-800 " />

                                <span className="ml-3">Logout</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Nav
