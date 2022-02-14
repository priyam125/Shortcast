import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AiOutlineDoubleRight } from "react-icons/ai";
import axios from "axios";
import OtpInput from 'react-otp-input';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RESET_PASSWORD } from "../../../Utils/apiroutes";


const PasswordForm = () => {
  const initialData = {
    email: "",
    password: "",
    password2: ""
  };
  const [formData, setFormData] = useState(initialData);
//   const [otp, setOtp] = useState()
  const [formErrors, setFormErrors] = useState({}); //error
//   const [errorStatus, setErrorStatus]=useState(false)
  // const [errors,seterrors] = ({
  //     email:"",
  //     username:""
  // })
  let errorStatus = false;
  const [loginfailure, setloginfailure] = useState(false);

  const dispatcher = useDispatch();
  const history = useHistory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // console.log(formData);
  };

  const handleSubmit = (e) => {
    setloginfailure(false);

    e.preventDefault();
    // console.log(formData);
    validate(formData);


    // console.log(errorStatus);

    if (!errorStatus) {
      window.location.href = `/`;
      // let data2 = {
      //   username: formData.username,
      //   password: formData.password,
      // };

      let data = {
        email: formData.email,
        password: formData.password,
        confirm_password: formData.password2
      };
      // // console.log(data)
      // // console.log(data2);

      axios
        .post(RESET_PASSWORD, data, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res)     
          toast.success("Password Changed");
          window.location = "/login"
            
        })
        .catch((err) => {
          console.log(err.response.data);
          // seterrors()
          // console.log(err.response.data.email)

          setloginfailure(true);
        });
    }
  };

  const validate = (data) => {
    const errors = {};
    const email_regex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
    if(!data.email) {
        errors.email= "email is required"
        // setFormErrors({...formErrors, email: errors.email})
    } else if(!email_regex.test(data.email)) {
        errors.email="Not a valid email format"
        // setFormErrors({...formErrors, email: errors.email})
    }
    if(!data.password) {
        errors.password= "Password is required"
        // setFormErrors({...formErrors, password: errors.password})
    }
    if(data.password !== data.password2) {
        errors.password2 = "Password does not match"
        // setFormErrors({...formErrors, password2: errors.password2})
    }
    // console.log(errors);

    setFormErrors(errors);

    // console.log(Object.entries(errors).length);
    if (Object.entries(errors).length > 0) errorStatus = true;

    // console.log(errorStatus);

    return errors;

    // // setFormErrors(errors)
    // // console.log(formErrors);
    // // if(Object.entries(errors).length === 0)
    // // return true
    // // else return false
  };

  return (
    <form
      className="bg-white rounded-tr-3xl px-6 py-4 flex flex-col justify-center items-center space-y-2.5 relative"
      onSubmit={handleSubmit}
    >
        
    <div className="flex flex-col space-y-0.5">
        <input
        type="email"
        name="email"
        className="border-2 p-2 px-4 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
        placeholder="Email id"
        value={formData.email}
        onChange={handleChange}
      />
      <small className="text-red-500 mt-1">{formErrors.email}</small>      
    </div>

    <div className="flex flex-col space-y-1">
        <input
        type="password"
        name="password"
        className="border-2 p-2 px-4 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
        placeholder="New Password"
        value={formData.password}
        onChange={handleChange}
      />
      <small className="text-red-500 mt-1">{formErrors.password}</small>      
    </div>

    <div className="flex flex-col space-y-1">
        <input
        type="password"
        name="password2"
        className="border-2 p-2 px-4 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
        placeholder="Confirm Password"
        value={formData.password2}
        onChange={handleChange}
      />
      <small className="text-red-500 mt-1">{formErrors.password2}</small>      
    </div>


      {/*<label className="absolute top-4 left-8 ">Enter new passowrd</label>*/}
      

      {loginfailure && (
        <div className="text-red-400">Invalid username or password</div>
      )}



      <div className="relative py-2"> 
        <button
          type="submit"
          className="navbar flex justify-center items-center border-2 rounded-lg border-yellow-200 hover:bg-yellow-400 py-1.5 px-10 text-xl"
        >
        Confirm OTP
        <AiOutlineDoubleRight className="ml-2" />
        </button>
      </div>

      
    </form>
  );
};

export default PasswordForm;
