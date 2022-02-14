import React, { useState } from 'react';
// import FacebookLogin from 'react-facebook-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { GrFacebook } from "react-icons/gr";
import { FACEBOOK_LOGIN } from '../../Utils/apiroutes'
import { useDispatch } from 'react-redux'
import axios from 'axios';
import { ACCOUNT_INITIALIZE } from '../../Redux/actions';
import { useHistory } from 'react-router-dom'


const FacebookSocialAuth = () => {


  const [signinerror, setsigninerror] = useState(false);

  const [errormessage, seterrormessage] = useState("");
  const dispatcher = useDispatch();
  const history = useHistory();





  const responseFacebook = async (response) => {
    setsigninerror(false)
    let auth_token = response.accessToken;


    let res = await axios.post(FACEBOOK_LOGIN, {
      auth_token: auth_token,
    });
    // console.log(res)

    if (res.data.error || res.data.status == 0) {
      seterrormessage(res.data.error);
      setsigninerror(true)
      return;
    }

    if (res.data.status == 1) {
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

      if (res.data.genre_selected) {
        window.location.href = `/`;

      }
      else {
        window.location.href = `/genre`;
      }
    }
  }

  return (
    <div className="App">

      <FacebookLogin

        appId={process.env.REACT_APP_FACEBOOK_LOGIN}
        fields="name,email,picture"
        callback={responseFacebook}
        icon="fa-facebook"

        render={renderProps => (
          <div className="" onClick={renderProps.onClick}><button type="button" className="loginBtn loginBtn--facebook p-2 text-white flex items-center justify-around w-60">

            <GrFacebook /> Login with Facebook
          </button></div>
        )}
      />


      {signinerror &&
        <div className="flex justify-center mt-2">
          <div className="w-60 text-center">
            <h2 className="text-red-400 text-sm">{errormessage}</h2>
          </div>
        </div>
      }
    </div>
  );

}

export default FacebookSocialAuth;