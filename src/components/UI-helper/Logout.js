import React,{useState,useEffect} from 'react'
import { Redirect, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { LOGOUT } from './../../Redux/actions';

const Logout = () => {
    const [isloading, setisloading] = useState(true);
    const dispatcher = useDispatch();
    // console.log("hello")

    useEffect(() => {
        // console.log("hello")

        dispatcher({ type: LOGOUT });
        setisloading(false);
    }, [])


    if (!isloading) {
        return (

            <Redirect to={{ pathname: "/login" }} />

        )
    }

    else {
        return (<></>)
    }

}

export default Logout