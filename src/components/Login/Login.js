import React from 'react';
// import SHRTCAST from '../../public/images/SHRTCAST_logo.jpg'
import { AiOutlineDoubleRight } from "react-icons/ai";
import LoginForm from './LoginForm';


const Login = () => {


    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="navbar w-auto rounded-2xl flex flex-col justify-between">
                <div className="navbar px-4 py-4 rounded-t-3xl flex flex-col items-center justify-center">
                    <div className="mb-3 w-32"><img src="/images/SHRTCAST_logo_crop.png" alt="logo" />
                        <img src="/images/Shrtcast-title.png" alt="Title" /></div>
                    <div className="">
                        <p className="mb-1 text-lg font-bold"> Lets record a <span className="italic">SHORT</span> </p>
                    </div>
                </div>
                <LoginForm />
            </div>
        </div>
    )
}

export default Login