import React, { useEffect, useState } from "react";
import PasswordForm from "./PasswordForm";
import { useHistory, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RESET_PASSWORD } from "../../../Utils/apiroutes";
import Modal from "react-modal";
import axios from "axios";
import { AiOutlineDoubleRight } from "react-icons/ai";

// import SHRTCAST from '../../public/images/SHRTCAST_logo.jpg'

const ChangePassword = () => {
  const initialData = {
    email: "",
    password: "",
    password2: "",
  };
  const [formData, setFormData] = useState(initialData);
  //   const [otp, setOtp] = useState()
  const [formErrors, setFormErrors] = useState({}); //error
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState()
  const [prevEmail, setPrevEmail] = useState()
  //   const [errorStatus, setErrorStatus]=useState(false)
  // const [errors,seterrors] = ({
  //     email:"",
  //     username:""
  // })
  let errorStatus = false;
  
  const [loginfailure, setloginfailure] = useState(false);

  const dispatcher = useDispatch();
  const history = useHistory();

  useEffect(() => {
     let prev_email = localStorage.getItem("email_params")
     setPrevEmail(prev_email)
    //  let dataset = {
    //   email: prevEmail,
    //   password: "",
    //   password2: ""
    //  }
    //  setFormData(...formData, dataset)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // console.log(formData);
    // console.log(prevEmail);
  };

  const handleSubmit = (e) => {
    setloginfailure(false);

    e.preventDefault();
    // console.log(formData);
    validate(formData);

    // console.log(errorStatus);

    if (!errorStatus) {
      // window.location.href = `/`;
      // let data2 = {
      //   username: formData.username,
      //   password: formData.password,
      // };

      let data = {
        email: prevEmail,
        password: formData.password,
        confirm_password: formData.password2,
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
          // console.log(res);
          setIsModalOpen(true);
        })
        .catch((err) => {
          console.log(err.response.data);
          let errors = err.response.data.message
            console.log(errors);
            setErrors(errors)
          // seterrors()
          // console.log(err.response.data.email)

          setloginfailure(true);
        });
    } 
  };

  const validate = (data) => {
    const errors = {};
    const email_regex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
    // if (data.email !== prevEmail) {
    //   errors.email = "email is incorrect";
    //   // setFormErrors({...formErrors, email: errors.email})
    // } 
    if (!data.password) {
      errors.password = "Password is required";
      // setFormErrors({...formErrors, password: errors.password})
    }
    if (data.password !== data.password2) {
      errors.password2 = "Password does not match";
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
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="navbar w-auto rounded-2xl flex flex-col justify-between">
        <ToastContainer className="absolute top-0 right-0" autoClose={2500} />
        <Modal
          isOpen={isModalOpen}
          contentLabel="My dialog"
          className=" sharemodal z-50 bg-transparent p-4 md:px-8 md:h-auto md:w-auto w-3/5 flex flex-col justify-center items-center absolute border-2 border-black outline-none rounded-lg"
        >
          <div className="font-bold p-2 pb-4"> Password Updated! </div>
          <Link to="/login">
            <div className="mb-2 flex justify-center">
              <button className="flex justify-center items-center navbar py-1 px-3 rounded-md">
                Login
                <AiOutlineDoubleRight className="ml-2" />
              </button>
            </div>
          </Link>
        </Modal>

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
        <form
          className="bg-white rounded-tr-3xl px-6 py-4 flex flex-col justify-center items-center space-y-2.5 relative"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col space-y-0.5">
            <input
              type="email"
              name="email"
              className="border-2 p-2 px-4 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
              value={prevEmail}
              disabled
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
            <div className="text-red-400">{errors}</div>
          )}

          <div className="relative py-2">
            <button
              type="submit"
              className="navbar flex justify-center items-center border-2 rounded-lg border-yellow-200 hover:bg-yellow-400 py-1.5 px-10 text-xl"
            >
              Submit
              <AiOutlineDoubleRight className="ml-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
