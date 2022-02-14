import React, { useState } from 'react';
import GoogleLogin from 'react-google-login';
import GoogleButton from 'react-google-button'
import { GOOGLE_LOGIN } from '../../Utils/apiroutes'
import axios from 'axios';
import { useDispatch } from 'react-redux'
import { ACCOUNT_INITIALIZE } from '../../Redux/actions';
import { useHistory } from 'react-router-dom'

const GoogleSocialAuth = () => {
  const history = useHistory();


  const [signinerror, setsigninerror] = useState(false);
  const [errormessage, seterrormessage] = useState("");
  const dispatcher = useDispatch();


  const googleResponse = async (response) => {
    setsigninerror(false)
    let auth_token = response.tokenId;


    let res = await axios.post(GOOGLE_LOGIN, {
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


      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENTID}
        render={renderProps => (
          <button onClick={renderProps.onClick} ><GoogleButton /></button>
        )}
        onSuccess={googleResponse}
        onFailure={googleResponse}
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

export default GoogleSocialAuth;