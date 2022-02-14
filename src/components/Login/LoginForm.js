import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDoubleRight } from "react-icons/ai";
import axios from "axios";
import { LOGIN_URL } from "../../Utils/apiroutes";
import { ACCOUNT_INITIALIZE, UPDATE_GENRE } from "./../../Redux/actions";
import GoogleSocialAuth from "./GoogleSocialAuth";
import FacebookSocialAuth from "./FacebookSocialAuth";
import TwitterLogin from "react-twitter-login";


const LoginForm = () => {


  const initialData = {
    email: "",
    password: "",
  };
  const [formData, setFormData] = useState(initialData);
  const [formErrors, setFormErrors] = useState({});
  const [loginfailure, setloginfailure] = useState(false);
  const dispatcher = useDispatch();
  let errorStatus = false;

  const genre_check = useSelector(state => state.account.genre_selected)
  // console.log(genre_check)



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const authHandler = (err, data) => {
    console.log(err, data);
  };


  const handleSubmit = (e) => {
    setloginfailure(false);
    e.preventDefault();
    // console.log(formData);
    validate(formData);
    if (!errorStatus) {
      let data2 = {
        email: formData.email,
        password: formData.password,
      };

      axios
        .post(LOGIN_URL, data2, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res)
          if (res.data.status == 0) {
            setloginfailure(true);
            return;
          }
          if (res.data.success) {
            dispatcher({
              type: ACCOUNT_INITIALIZE,
              payload: {
                isLoggedIn: true,
                user: res.data.user_id,
                token: res.data.tokens.token,
                genre_selection: res.data.genre_selected,
                issuper:res.data.superuser
              },
            });
            // dispatcher({
            //   type: UPDATE_GENRE,
            //   payload: res.data.genre_selected
            // })
            if (res.data.genre_selected) {
              window.location.href = `/`;

            }
            else {
              window.location.href = `/genre`;
            }
          }

        })
        .catch((err) => {
          console.log(err.response.data);
          setloginfailure(true);
        });
    }
  };

  const validate = (data) => {

    const errors = {};
    if (!data.email) {
      errors.username = "Email is required";
    }
    if (!data.password) {
      errors.password = "Password is required";
    }
    setFormErrors(errors);
    if (Object.entries(errors).length > 0) errorStatus = true;
    return errors;
  };

  return (
    <form
      className="bg-white rounded-tr-3xl px-8 py-6 flex flex-col justify-center items-center space-y-3"
      onSubmit={handleSubmit}
    >
      <input
        type="email"
        name="email"
        className="border-0 p-4 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      <small className="text-red-500 mt-1">{formErrors.username}</small>
      <input
        type="password"
        name="password"
        autoComplete="off"
        className="border-0 p-4 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
      />

      <div className="text-red-400 mt-1">{formErrors.password}</div>

      {loginfailure && (
        <div className="text-red-400">Invalid email or password</div>
      )}



      <div className="flex flex-col">




        <div className="pb-2 pt-0 flex flex-col items-center mb-1">
          <button
            type="submit"
            className="navbar flex justify-center items-center border-2 rounded-lg border-yellow-200 hover:bg-yellow-400 py-1.5 px-10 text-xl"
          >
            Log in
            <AiOutlineDoubleRight className="ml-2" />
          </button>
        </div>


        <div className="flex items-center justify-evenly">
          <Link to="/recoveryemail">
            <div className="cursor-pointer text-sm text-gray-800 password-forgot ml-1 text-center hover:underline" >
              Forgot password ?
            </div>
          </Link>





          <Link to="/register">
            <button
              type="button"
              className=" rounded-md  py-2 px-4 z-10"
            >
              {/* <small className="text-gray-600 lg:text-sm text-sm">
                Don't have an account?
              </small> */}
              <span className="hover:underline">&nbsp;Sign up</span>
            </button>
          </Link>
        </div>

        <div className="flex items-center justify-center mt-3">
          <div className="divide h-1 w-28 bg-gray-600 mt-1">
          </div>
          &nbsp;
          OR
          &nbsp;
          <div className="divide h-1 w-28 bg-gray-600 mt-1">
          </div>
        </div>
      </div>



      <div className="social-login flex flex-col justify-center items-center">
        <div className="p-2">
          <GoogleSocialAuth />
        </div>

        <div className="p-2">
          <FacebookSocialAuth />
        </div>

        {/* <TwitterLogin
          authCallback={authHandler}
          consumerKey={"PLc6vsWeMxtUj0j6yGBROcvCu"}
          consumerSecret={"rsLj0IOLVkrRZh9ggvUImQ9Vo6QJykbuMB6kv3vFqrnBtB5g7i"}
        /> */}
      </div>


    </form>
  );
};

export default LoginForm;
