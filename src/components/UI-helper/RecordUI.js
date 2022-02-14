import React from 'react';
import { BsFillMicFill } from "react-icons/bs";
import { Link } from 'react-router-dom';


const RecordUI = ({ text = " Add a SHORT", genre }) => {
    // console.log(genre)



    return (
        <Link to='/addpost'>
            <div className="recordUI w-80 h-32 bg-black rounded-xl relative flex flex-col items-center">
                <div className="innerrecordUI border-2 border-yellow-200 absolute top-10 w-64 h-12 rounded-lg flex ">
                    <BsFillMicFill className="text-white h-10 w-10 p-1 mr-2 ml-2 " />
                    <div className="navbar  w-full h-11 rounded-sm text-center pt-2 font-bold mb-2">
                        Add a Short
                    </div>

                </div>
            </div>
        </Link>
    )
}

export default RecordUI;