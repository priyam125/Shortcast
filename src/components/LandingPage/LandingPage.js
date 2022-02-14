import React, {useState, useRef, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { AiFillCaretDown } from "react-icons/ai";
import ReactPlayer from 'react-player'



const LandingPage = () => {

    const [navbarisopen, setnavbarisopen] = useState(false)
    const dropdown = useRef(null);

    const [videoPlaying, setVideoPlaying] = useState(true)


    useEffect(() => {
        window.addEventListener("click", handleclick);
        return () => {
            document.removeEventListener('click', handleclick);
        };
        setVideoPlaying(true)
    }, [])

    const handleclick = (event) => {

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
        <div className='landingpage'>

            
            

            <div className= 'landingpage navbar h-24 flex items-center justify-between md:px-20 px-4'>
                <Link to="/landingpage">
                    <div className="logo flex flex-col items-center  md:text-xl text-md tracking-wider px-3 md:px-0 overflow-hidden">
                        <img className="logoimagenav md:h-20 h-14 md:ml-5" src="/images/SHRTCAST_logo.jpg" alt="" />
                        <img className="logoimagenav md:h-4 h-3 md:ml-5" src="/images/SHRTCAST_text.jpg" alt="" />
                        {/* <h2 className="hidden md:block"></h2> */}
                        {/* <img className="h-9 w-52" src={`/images/SHRTCAST_text.jpg`} alt="" /> */}
                    </div>
                </Link>
                <div className='flex space-x-8 items-center'>
                    <a href = 'https://calendly.com/creatorx'>
                        <div className='font-bold text-lg hidden md:block'>RING THE FOUNDER</div>
                    </a>
                    <div className='space-x-2 text-white text-lg font-bold hidden md:block'>
                        <button className='bg-black rounded-full py-2 px-6'>SIGN UP</button>
                        <button className='bg-black rounded-full py-2 px-6'>LOGIN</button>
                    </div>
                    
                    <div onClick={() => setnavbarisopen(!navbarisopen)} className="profilename flex items-center p-1 pt-3 pb-3 md:pr-2 md:pl-2   cursor-pointer  md:mr-10 mr-2  rounded-lg md:hidden">
                        <AiFillCaretDown className=" text-xl" />
                    </div>
                    <div ref={dropdown} className={`dropdown absolute top-14 right-3 bg-white p-5 rounded-lg  md:w-72 w-60 z-30 mt-3 ` + ((navbarisopen) ? "block" : "hidden")}>

                        <div className='p-2 px-4'>RING THE FOUNDER</div>
                        <Link to={`/register`}>
                            <div onClick={() => setnavbarisopen(false)} className="flex items-center p-3  mb-2 rounded-lg cursor-pointer hover:bg-gray-200 ">
                                
                                <span className="ml-3 text-md">Signup</span>
                            </div>
                        </Link>

                        <Link to='/login'>
                            <div onClick={() => setnavbarisopen(false)} className="flex items-center p-3 mb-2 rounded-lg cursor-pointer hover:bg-gray-200 ">
                                

                                <span className="ml-3">Login</span>
                            </div>
                        </Link>                        
                    </div>
                </div>
            </div>

            <div className='h-auto lg:py-18 xl:py-16 lg:px-12 xl:px-2 lg:mb-6'> 
                <div className='xl:px-2 lg:px-6 px-2 py-12 flex flex-col lg:flex-row items-center justify-center lg:space-x-20 xl:space-x-50'>
                    <div className='px-1 xl:mt-4 pt-2 lg:space-y-6 xl:space-y-6 lg:space-y-12 space-y-10 flex flex-col items-center justify-center lg:items-start hero-one '>
                        <div className='lg:space-y-4 space-y-8 mb-2 flex flex-col lg:items-start items-center justify-center'>
                            <div className='hidden lg:block'>
                                <div className='flex flex-col justify-center items-center'>
                                    <div className='lg:text-6xl xl:text-5xl text-4xl font-bold text-gray-700'>Voice your stories to the world
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col justify-center items-center w-11/12'>
                                <div className='lg:hidden text-5xl font-bold text-gray-800 w-5/6 flex items-center justify-center'>Voice your stories to the world 
                                </div>
                            </div>
                            <div className='lg:text-2xl text-xl ml-12 lg:ml-0 font-extralight'>Podcasting for those who aren't podcasters.
                            </div>
                        </div>
                        <Link to='/register'>
                            <button className='bg-black rounded-full lg:py-4 xl:px-10 lg:px-10 py-3 px-10 text-white lg:text-xl text-base font-bold italic'>LET'S RECORD A SHORT</button>
                        </Link>
                    </div>
                    <div className='flex mt-20 lg:mt-5 items-center justify-center lg:w-2/5 xl:-1/3'>
                        <ReactPlayer className='lg:block hidden' muted='true'  url='SHRTCAST_video.mp4' width='350px' height='500px' playing={videoPlaying} controls='true'/>
                        <ReactPlayer className='lg:hidden block'  url='SHRTCAST_video.mp4' width='300px' height='400px' muted='true' playing={videoPlaying} controls='true'/>
                    </div>
                </div>
            </div>



            

            {/*<div className='flex flex-col items-center justify-center mb-20 lg:space-y-12 space-y-6'>
                <div className='lg:text-5xl text-3xl font-bold italic'>How it works</div>
                <div className=''>
                <ReactPlayer className='lg:block hidden'  url='https://www.youtube.com/watch?v=ysz5S6PUM-U' width='848px' height='480px' />
                <ReactPlayer className='lg:hidden block'  url='https://www.youtube.com/watch?v=ysz5S6PUM-U' width='300px' height='180px' />
                </div>
    </div>*/}

            
            <div className='h-auto py-2 lg:px-32 px-4'>
                <div className='py-2 px-4 flex flex-col items-center justify-center space-y-6  text-xl mt-20'>
                    <div className='text-4xl italic font-bold items-center px-10'>YOUR VOICE IS SPECIAL</div>
                    {/*<div className='text-2xl italic'>Share audio stories and connect with interesting people from around the world.</div>*/}    
                </div>
                
                <div className='xl:container-info lg:grid grid-cols-3 gap-6 py-1 mt-12 flex flex-col items-center justify-center'>
                    <div className='py-2 flex flex-col items-center justify-center  space-y-6 mb-8 lg:mb-0'>
                        <div className='xl:h-60 xl:w-60 h-48 w-48 bg-gray-700 rounded-full'>
                            <img className='xl:h-60 xl:w-60 h-48 w-48 object-fill rounded-full' src='/images/SHRTCAST_logo.jpg' alt=''></img>
                        </div>
                        <div className='text-3xl xl:text-5xl lg:text-4xl font-bold'>Record</div>
                        <div className='text-3xl font-medium ml-6'>Record what’s on your mind in 99 seconds or less</div>
                    </div>
                    <div className='py-2 flex flex-col items-center justify-center  space-y-6 mb-8 lg:mb-0'>
                        <div className='xl:h-60 xl:w-60 h-48 w-48 bg-gray-700 rounded-full'>
                            <img className='xl:h-60 xl:w-60 h-48 w-48 object-fill rounded-full' src='/images/SHRTCAST_logo.jpg' alt=''></img>
                        </div>
                        <div className='text-3xl xl:text-5xl lg:text-4xl font-bold'>Share</div>
                        <div className='text-3xl font-medium ml-6'>Share your voice with the world with a click </div>
                    </div>
                    <div className='py-2 flex flex-col items-center justify-center  space-y-6'>
                        <div className='xl:h-60 xl:w-60 h-48 w-48 bg-gray-700 rounded-full'>
                            <img className='xl:h-60 xl:w-60 h-48 w-48 object-fill rounded-full' src='/images/SHRTCAST_logo.jpg' alt=''></img>
                        </div>
                        <div className='text-3xl xl:text-5xl lg:text-4xl font-bold'>Discover</div>
                        <div className='text-3xl font-medium ml-4'>Connect with interesting people and their stories from around the world</div>
                    </div>
                </div>
            </div> 

            <div className='flex flex-col items-center justify-center py-36 lg:space-y-8 space-y-4'> 
                <div className='xl:text-4xl lg:text-4xl text-3xl font-bold text-gray-700 italic'>Let's record a SHORT</div>
                <Link to='/register'>
                    <button className='bg-black rounded-lg py-2 px-12 xl:px-16 xl:py-3  text-white font-bold xl:text-xl text-lg'>SIGN UP</button>
                </Link>
            </div>

            <div className='navbar h-24'></div>



        </div>
    )
}

export default LandingPage
