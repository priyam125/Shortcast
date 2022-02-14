import React from 'react';
// import SHRTCAST from '../../public/images/SHRTCAST_logo.jpg'
import { AiOutlineDoubleRight } from "react-icons/ai";
import { Link } from 'react-router-dom';
import RegisterForm from './RegisterForm';


const Register = () => {


    return (
        <div className="flex flex-col justify-center items-center h-screen px-6 md:px-0 mt-10">
            <div className="navbar md:w-80 w-11/12 rounded-2xl flex flex-col justify-between">
                <div className="navbar px-4 py-4 rounded-t-3xl flex flex-col items-center justify-center">
                    <div className="mb-3 w-36"><img src="/images/SHRTCAST_logo_crop.png" alt="logo" />
                        <img src="/images/Shrtcast-title.png" alt="Title" /></div>
                    {/*<div className="">
                        <p className="mb-1 text-2xl"> Turn your thoughts </p>
                        <h4 className="mb-5 text-gray-400 text-2xl">into SHORTS</h4>
    </div>*/}
                    <Link to="/login"> <button className="navbar border-2 rounded-md border-yellow-200 hover:bg-yellow-400 py-2 px-5 z-10" ><small className="text-gray-600 lg:text-sm text-sm">Already signed up?</small><span>&nbsp;Log in</span></button></Link>
                </div>
                <RegisterForm />
                {/*<form className="bg-white rounded-tr-3xl px-6 py-6 flex flex-col justify-center items-center space-y-4">
                    <div className="relative w-auto">
                        <input type="password" name="password" className="border-0 py-4 px-4 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full" placeholder="Email"  />
                        <small class="p-2 text-red-500">* Email</small>
                    </div>
                    <input type="username" name="email" className="border-0 p-4 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full" placeholder="Username"  />
                    <input type="password" name="password" className="border-0 p-4 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full" placeholder="Password"  />
                    <button className="navbar flex justify-center items-center border-2 rounded-lg border-yellow-200 hover:bg-yellow-400 py-2 px-10 text-xl">
                    Sign Up
                    <AiOutlineDoubleRight className="ml-2"/>
                    </button>
</form>*/}
            </div>
        </div>
    )
}

export default Register