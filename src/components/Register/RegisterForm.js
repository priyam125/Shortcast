import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AiOutlineDoubleRight } from "react-icons/ai";
import { SIGNUP_URL } from '../../Utils/apiroutes'
import axios from 'axios'
import { Link, useHistory } from 'react-router-dom';
import FacebookSocialAuth from '../Login/FacebookSocialAuth';
import GoogleSocialAuth from '../Login/GoogleSocialAuth';




const RegisterForm = () => {


    const initialValues = {
        username: "",
        email: "",
        password: "",
        password2: ""
    }

    const [formData, setFormData] = useState(initialValues)
    const [formErrors, setFormErrors] = useState({})
    let errorStatus = false;

    let history = useHistory();


    const handleChange = (e) => {
        //console.log(e.target);
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })

        // console.log(formData);
    }

    const sendNewUserDetails = (e) => {

        setFormErrors({})
        e.preventDefault()
        // console.log(formData);
        validate(formData)

        // console.log(errorStatus);

        if (!errorStatus) {

            let data = {
                username: formData.username,
                password: formData.password,
                passwordconfirm: formData.password2,
                email: formData.email
            }


            // console.log(data);


            // fetch(SIGNUP_URL,{
            //     method:"POST",
            //     headers: {
            //         'Accept': 'application/json',
            //         'Content-Type': 'application/json'
            //     },
            //     body:data
            // })
            // .then(res =>{
            //     console.log(res)
            //     return res.json()
            // })
            // .then((res)=>{
            //     console.log(res)
            // })
            // .catch((err)=>{
            //     console.log(err)
            // })

            axios.post(SIGNUP_URL, data, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then((res) => {
                    // console.log(res)
                    if (res.data.success)
                        history.push('/login')
                })
                .catch((err) => {
                    console.log(err.response.data)
                    let errors = {}

                    if (err.response.data.email !== undefined) {
                        errors.email = err.response.data.email[0]
                    }
                    if (err.response.data.username !== undefined) {
                        errors.username = err.response.data.username[0]
                    }
                    setFormErrors(errors)
                });
        }

        // else console.log("Errorrrr");

        // console.log(formErrors);
        // setIsSubmit(true)


    }

    // useEffect(() => {

    // })

    // useEffect(() => {


    //     console.log(formErrors)
    //     console.log(Object.keys(formErrors))
    //     // if(Object.keys(formErrors).length === 0 && IsSubmit)
    //     // console.log(formData);

    // },[formErrors])

    const validate = (data) => {
        const errors = {}
        const email_regex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
        if (!data.username) {
            errors.username = "Uername is required"
            //  setFormErrors({...formErrors, username: errors.username})
        }
        if (!data.email) {
            errors.email = "email is required"
            // setFormErrors({...formErrors, email: errors.email})
        } else if (!email_regex.test(data.email)) {
            errors.email = "Not a valid email format"
            // setFormErrors({...formErrors, email: errors.email})
        }
        if (!data.password) {
            errors.password = "Password is required"
            // setFormErrors({...formErrors, password: errors.password})
        }
        if (data.password !== data.password2) {
            errors.password2 = "Password does not match"
            // setFormErrors({...formErrors, password2: errors.password2})
        }
        // console.log(errors);

        setFormErrors(errors)

        // console.log(Object.entries(errors).length);
        if (Object.entries(errors).length > 0)
            errorStatus = true;



        return errors

        // setFormErrors(errors)
        // console.log(formErrors);
        // if(Object.entries(errors).length === 0)
        // return true
        // else return false

    }

    return (<>
        <form className="bg-white rounded-tr-3xl px-6 py-6 flex flex-col justify-center items-center space-y-3 " onSubmit={sendNewUserDetails}>

            <input type="username" name="username" className="border-0 py-4 px-4 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full" placeholder="Username" value={formData.username}
                onChange={handleChange} autoComplete="off" />
            {formErrors.username && <small className=" text-red-500 text-center">{formErrors.username}</small>}
            <input type="email" name="email" className="border-0 p-4 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full" placeholder="Email" value={formData.email} onChange={handleChange} autoComplete="off" />
            {formErrors.email && <small className=" text-red-500 text-center">{formErrors.email}</small>}
            <input type="password" name="password" className="border-0 p-4 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full" placeholder="Password" value={formData.password} onChange={handleChange} autoComplete="off" />
            {formErrors.password && <small className="left-0 text-red-500 text-center">{formErrors.password}</small>}
            <input type="password" name="password2" className="border-0 p-4 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full" placeholder="Confirm Password" value={formData.password2} onChange={handleChange} autoComplete="off" />
            {formErrors.password2 && <small className=" text-red-500 text-center">{formErrors.password2}</small>}
            <button type="submit" className="navbar flex justify-center items-center border-2 rounded-lg border-yellow-200 hover:bg-yellow-400 py-2 px-10 text-xl" type="submit">
                Sign Up
                <AiOutlineDoubleRight className="ml-2" />
            </button>

            <div className="flex items-center justify-center mt-3">
                <div className="divide h-1 w-24 bg-gray-600 mt-1">
                </div>
                &nbsp;
                OR
                &nbsp;
                <div className="divide h-1 w-24 bg-gray-600 mt-1">
                </div>
            </div>

            <div className="social-login flex flex-col justify-center items-center">
                <div className="p-2">
                    <GoogleSocialAuth />
                </div>

                <div className="p-2">
                    <FacebookSocialAuth />
                </div>
            </div>
        </form>

    </>
    )
}

export default RegisterForm