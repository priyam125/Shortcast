import React from 'react';
import { BsFillMicFill } from "react-icons/bs";
import { Link } from 'react-router-dom';


const RecordUIthread = ({ text = " Add a SHORT", genre, toggleModal_thread, location_redirect }) => {
    // console.log(location_redirect)



    return (

        <Link to={location_redirect}>

            <div onClick={toggleModal_thread} className="recordUI w-80 h-32 bg-black rounded-xl relative flex flex-col items-center cursor-pointer">
                <div className="innerrecordUI border-2 border-yellow-200 absolute top-10 w-64 h-12 rounded-lg flex ">
                    <BsFillMicFill className="text-white h-10 w-10 p-1 mr-2 ml-2 " />
                    <div className="navbar w-52 h-11 rounded-sm text-center pt-2 font-bold mb-2">
                        Record a Short
                    </div>

                </div>
            </div>
        </Link>
    )
}

export default RecordUIthread;