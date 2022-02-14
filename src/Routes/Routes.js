import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import Posts from '../components/Posts'
import PostThread from '../components/PostThread'
import Profile from '../components/Profile'
import EditProfile from '../components/EditProfile'
import Feedback from '../components/Feedback'
import Nav from '../components/UI-helper/Nav'
import AddPost from '../components/AddPost'
import AddthreadPost from '../components/AddthreadPost'
import ProtectedRoute from '../components/UI-helper/ProtectedRoute'
import Login from '../components/Login/Login'
import Register from '../components/Register/Register'
import Logout from '../components/UI-helper/Logout'
import RecoveryEmail from '../components/Reset/Email/RecoveryEmail'
import AuthConfirm from '../components/UI-helper/AuthConfirm'
import ConfirmOtp from '../components/Reset/OTP/ConfirmOtp'
import ChangePassword from '../components/Reset/NewPassword/ChangePassword'
import GenreSelection from '../components/UI-helper/GenreSelection'
import UploadExcel from '../components/UploadExcel'
import UploadExcel2 from '../components/UploadExcel2'

import Listen_notes from '../components/Admin/Listen_notes'
import { useSelector } from 'react-redux'
import LandingPage from '../components/LandingPage/LandingPage'

const Routes = () => {

    const issuper = useSelector(state => state.account.issuper);


    return (
        <Router>
            <Route exact
                path={[
                    '/login',
                    '/register',
                    '/logout',
                    '/recoveryemail',
                    '/checkotp/:email',
                    '/changepassword',
                    '/landingpage'
                ]}
            >
                <AuthConfirm exact path="/login" component={Login} />
                <AuthConfirm exact path="/register" component={Register} />
                <Route exact path="/logout" component={Logout} />
                <Route exact path="/recoveryemail" component={RecoveryEmail} />
                <Route exact path="/checkotp/:email" component={ConfirmOtp} />
                <Route exact path="/changepassword" component={ChangePassword} />
                <Route exact path="/landingpage" component={LandingPage} />

            </Route>


            <Route exact
                path={[
                    '/add-post',
                    '/post',
                    '/profile/:id',
                    '/post-details/:id',
                    '/',
                    '/editProfile',
                    '/addpost',
                    '/post-details/:id/addthread',
                    '/genre',
                    '/feedback',
                    '/upload-excel',

                    '/admin/ls'
                ]}
            >
                <Nav />
                <Switch>
                    <Redirect exact from="/" to="/post" />
                    <ProtectedRoute exact path="/post" component={Posts} />
                    <ProtectedRoute exact path="/post-details/:id" component={PostThread} />
                    <ProtectedRoute exact path="/post-details/:id/addthread" component={AddthreadPost} />
                    <ProtectedRoute exact path="/profile/:id" component={Profile} />
                    <ProtectedRoute exact path="/editProfile" component={EditProfile} />
                    <ProtectedRoute exact path="/addpost" component={AddPost} />
                    <ProtectedRoute exact path="/feedback" component={Feedback} />
                    <ProtectedRoute exact path="/genre" component={GenreSelection} />

                    {issuper &&
                        (
                            <ProtectedRoute exact path="/upload-excel" component={UploadExcel2} />

                        )
                    }                    


                    {issuper &&
                        (
                            <ProtectedRoute exact path="/admin/ls" component={Listen_notes} />

                        )
                    }





                </Switch>
            </Route>
        </Router>
    )
}

export default Routes
