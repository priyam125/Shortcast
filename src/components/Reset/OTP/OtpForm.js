import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AiOutlineDoubleRight } from "react-icons/ai";
import axios from "axios";
import { CHECK_OTP } from "../../../Utils/apiroutes";


const OtpForm = () => {
  let { email } = useParams();
  console.log(email);
  localStorage.setItem("email_params", email)

  const initialData = {
    otp: "",
  };
  const [formData, setFormData] = useState(initialData);
  //const [otp, setOtp] = useState()
  const [formErrors, setFormErrors] = useState({}); //error
  // const [email, setEmail] = useState()
  // const [errorStatus, setErrorStatus]=useState(false)
  // const [errors,seterrors] = ({
  //     email:"",
  //     username:""
  // })
  let errorStatus = false;
  const [loginfailure, setloginfailure] = useState(false);

  const dispatcher = useDispatch();
  const history = useHistory();

  // useEffect(() => {
  //   let email_params = ""
  // },[])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
    console.log(email);
  };

  const handleSubmit = (e) => {
    setloginfailure(false);

    e.preventDefault();
    console.log(formData);
    validate(formData);

    // console.log(errorStatus);

    if (!errorStatus) {
      // window.location.href = `/checkotp`;
      // let data2 = {
      //   username: formData.username,
      //   password: formData.password,
      // };

      let data = {
        email: email,
        otp: formData.otp
      };
      console.log(data)
      // // console.log(data2);

      axios
        .post(CHECK_OTP, data, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res)
          if(res.data.otp_match) {
            window.location="/changepassword"
          } else {
            let errors = {}
            errors.message=res.data.message
            setFormErrors(errors)
          }
          console.log("SENT1");
        })
        .catch((err) => {
          console.log(err.response.data);
          // seterrors()
          // console.log(err.response.data.email)

          setloginfailure(true);
        });
    } else console.log("ERRRORRR");
  };
    

  const validate = (data) => {
    const errors = {};
    const email_regex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
    if (!data.otp) {
      errors.otp = "OTP is required";
      //  setFormErrors({...formErrors, username: errors.username})
    }
    // if (!data.password) {
    //   errors.password = "Password is required";
      // setFormErrors({...formErrors, password: errors.password})
  // }
    // console.log(errors);

    setFormErrors(errors);

    // console.log(Object.entries(errors).length);
    if (Object.entries(errors).length > 0) errorStatus = true;

    console.log(errorStatus);

    return errors;

    // // setFormErrors(errors)
    // // console.log(formErrors);
    // // if(Object.entries(errors).length === 0)
    // // return true
    // // else return false
  };

  return (
    <form
      className="bg-white rounded-tr-3xl px-8 py-10 flex flex-col justify-center items-center space-y-2 relative"
      onSubmit={handleSubmit}
    >
        
      <label className="absolute top-4 left-8 ">Enter Otp</label>
      <input
        name="otp"
        className="border-2 p-2 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
        placeholder=""
        value={formData.email}
        onChange={handleChange}
      />
      <small className="text-red-500 mt-1">{formErrors.otp}</small>    
      <small className="text-red-500 mt-1">{formErrors.message}</small>      
  
      

      {loginfailure && (
        <div className="text-red-400">{formErrors.message}</div>
      )}



      <div className="relative"> 
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

export default OtpForm;
