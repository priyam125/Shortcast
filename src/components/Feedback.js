import {React, useState, useRef} from 'react';
import { useSelector } from 'react-redux';
import { BiSend } from "react-icons/bi";
import axios from 'axios';
import {FEEDBACK} from '../Utils/apiroutes'



const Feedback = () => {


    const [feedback, setfeedback] = useState("")
    const [modal, setModal] = useState(false)
    const [inputError, setInputError] = useState(false)
    const inputRef = useRef()

    const token = useSelector(state => state.account.token)

    const handleChange = (e) => {
        setfeedback(e.target.value);
        // console.log(e.target.value);
    }

    const postFeedback = (e) => {

        e.preventDefault()
        if(inputRef.current.value.trim()) {
            const data = feedback;
            axios.post(FEEDBACK, {
                body: data
            },{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            })
            .then((res) => {
                // console.log(res)
            })
            .catch((err) => console.log(err.message));

            // console.log(feedback);
            setModal(!modal);

            inputRef.current.value = ""
        }
        else {
            setInputError(true)
           
        }
    }    


    return (
        <div className="py-12">
            <form className="w-5/6 h-auto bg-white m-auto py-24 flex flex-col justify-center items-center rounded-3xl"> 
                <div className="font-bold mb-2"> Your feedback is precious to us. </div>
                <textarea className="border-gray-400 border-2 mb-2 md:w-1/2" rows={10} cols={25} ref={inputRef} onChange = {handleChange} onFocus={() => setInputError(false)} placeholder="  We would really appreciate the most honest feedbck that helps us grow. "></textarea>
                {inputError && <div className="text-red-500">*Input field empty</div>}
                <button onClick={postFeedback} className="bg-blue-500 p-2 rounded-md text-white flex justify-center items-center">Send Feedback <BiSend className="ml-1"/></button>
            </form>
        </div>
        
    )   
}

export default Feedback