import React from "react";
import OtpForm from "./OtpForm";
// import SHRTCAST from '../../public/images/SHRTCAST_logo.jpg'

const ConfirmOtp = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="navbar w-auto rounded-2xl flex flex-col justify-between">
        <div className="navbar px-4 py-4 rounded-t-3xl flex flex-col items-center justify-center">
          <div className="mb-3 w-32">
            <img src="/images/SHRTCAST_logo_crop.png" alt="logo" />
            <img src="/images/Shrtcast-title.png" alt="Title" />
          </div>
          <div className="">
            <p className="mb-1 text-lg font-bold">
              {" "}
              Lets record a <span className="italic">SHORT</span>{" "}
            </p>
          </div>
          
        </div>
        <OtpForm />
        {/*<form className="bg-white rounded-tr-3xl px-8 py-6 flex flex-col justify-center items-center space-y-4">
                    <div className=" w-auto">
                        <input type="email" name="email" className="border-0 py-4 px-4 placeholder-gray-400 text-gray-700 bg-white rounded text-sm  shadow focus:outline-none focus:ring w-full" placeholder="Email"  />
                        <small class="p-2 text-red-500">* Email</small>
                    </div>
                    <input type="username" name="username" className="border-0 p-4 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full" placeholder="Username"  />
                    <input type="password" name="password" autoComplete="off" className="border-0 p-4 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full" placeholder="Password"  />
                    <button className="navbar flex justify-center items-center border-2 rounded-lg border-yellow-200 hover:bg-yellow-400 py-1.5 px-10 text-xl">
                    Log in
                    <AiOutlineDoubleRight className="ml-2"/>
                    </button>
                    <button className="navbar border-2 rounded-md border-yellow-200 hover:bg-yellow-400 py-2 px-4 z-10" ><small className="text-gray-600 lg:text-sm text-sm">Don't have an account?</small><span>&nbsp;Sign up</span></button>
    </form>*/}
      </div>
    </div>
  );
};

export default ConfirmOtp;
