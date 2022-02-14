import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AiOutlineDoubleRight } from "react-icons/ai";
import { SEND_OTP } from "../../../Utils/apiroutes";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RECOVERY_EMAIL } from "../../../Redux/actions";

const EmailForm = () => {
  const initialData = {
    email: "",
  };
  const [formData, setFormData] = useState(initialData);
  const [formErrors, setFormErrors] = useState({}); //errors
  const [errors, setErrors] = useState()
  // const [errorStatus, setErrorStatus]=useState(false)
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

      let data = {
        email: formData.email
      };
      // // console.log(data)
      // // console.log(data2);

      axios
        .post(SEND_OTP, data, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          // console.log(res)
          // console.log("SENT1");
          // console.log(res.data.otp_sent);

            if (res.data.otp_sent) {
              // console.log("SENT")
              console.log(res);
              toast.success("OTP sent")

              dispatcher({
                type: RECOVERY_EMAIL,
                payload: {
                  recoverymail: formData.email 
                },
              })
          } else if ((res.data.otp_sent) === false) {
            // console.log("NOT SENT")

            let errors = {}
            errors.message=res.data.message
            console.log(errors.message);
            setFormErrors(errors)
          }
        })
        .catch((err) => {
          console.log(err.response.data.message);
          let errors = err.response.data.message
            console.log(errors.message);
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
    if (!data.email) {
      errors.email = "email is required";
      // setFormErrors({...formErrors, email: errors.email})
    } 
    // if (!data.password) {
    //   errors.password = "Password is required";
    // setFormErrors({...formErrors, password: errors.password})
    // }
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
      className="bg-white rounded-tr-3xl px-8 py-6 flex flex-col justify-center items-center space-y-5 relative"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col space-y-1">
        <label className="font-italic">Enter recovery email</label>
        <input
          type="email"
          name="email"
          className="border-2 p-2 px-4 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
          placeholder=""
          value={formData.email}
          onChange={handleChange}
        />
        <small className="text-red-500 mt-1">{formErrors.email}</small>
        {loginfailure && (
          <div className="text-red-400">{errors}</div>
        )}
      </div>

      

      <div className="relative">
        <button
          type="submit"
          className="navbar flex justify-center items-center border-2 rounded-lg border-yellow-200 hover:bg-yellow-400 py-1.5 px-10 text-xl"
        >
          Get OTP
          <AiOutlineDoubleRight className="ml-2" />
        </button>
      </div>
    </form>
  );
};

export default EmailForm;
