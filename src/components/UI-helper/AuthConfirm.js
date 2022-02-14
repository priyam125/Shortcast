import React, { useState, useEffect } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
// import Loader from '../../ui-component/Loader'

const AuthConfirm = ({ component: Component, ...rest }) => {
    const [isAuth, setisAuth] = useState(false);
    const [isloading, setisloading] = useState(true);


    const login = useSelector((state) => state.account.isLoggedIn);
    useEffect(() => {
        if (login) {
            setisAuth(true);
            setisloading(false);
        }
        else {
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
                        return (
                            <Redirect to={{ pathname: "/" }} />
                        )
                    }
                    else {
                        return <Component />
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

export default AuthConfirm