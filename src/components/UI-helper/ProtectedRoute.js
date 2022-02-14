import React, { useState, useEffect } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
// import Loader from '../../ui-component/Loader'
import { useSelector } from 'react-redux'

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const [isloading, setisloading] = useState(true);
    const [isAuth, setisAuth] = useState(false);


    const login = useSelector((state) => state.account.isLoggedIn);
    // console.log("isloggedin from protected routes",login)
        useEffect(() => {
            if(login){
                setisAuth(true);
                setisloading(false);
            }
            else{
                setisAuth(false);
                setisloading(false);
            }
        }, [])

    if (!isloading) {

        return (

            <Route
                {...rest}
                render={(props) => {
                    if (isAuth) {
                        return <Component />
                    }
                    else {
                        return (
                            <Redirect to={{ pathname: "/landingpage" }} />
                        )
                    }
                }
                }
            >

            </Route>
        )
    }
    else {
        return (<></>)
    }
}

export default ProtectedRoute