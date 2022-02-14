import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { GET_GENRES, POST_GENRES } from '../../Utils/apiroutes'
import { CgChevronDoubleRight } from "react-icons/cg";
import { useSelector, useDispatch } from 'react-redux'
import { ToastContainer, toast } from "react-toastify";
import { UPDATE_GENRE } from '../../Redux/actions';
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { useHistory } from 'react-router';



const GenreSelection = () => {

    const history = useHistory();

    const [genrestate, setgenrestate] = useState([])
    const dispatch = useDispatch();

    const token = useSelector(state => state.account.token)
    const genre_check = useSelector(state => state.account.genre_selected)
    const id = useSelector(state => state.account.user)
    const [loadscreen, setloadscreen] = useState(false);

    useEffect(() => {
        console.log(genre_check)

        // if (genre_check) {
        //     window.location.href = '/';
        // }
        // else {
        setloadscreen(true);
        // }


        //after implementation
        const getgenres = async () => {
            try {
                const response = await axios.get(GET_GENRES, {
                    mode: "cors",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                });
                console.log(response);

            } catch (error) {
                console.log(error);
            }
        }




    }, [])


    const submitgenre = async () => {
        if (genrestate.length == 0) {
            toast.error("Select atleast one genre to continue!");
            return
        }

        let body = {
            user_id: id,
            genre_list: genrestate
        }

        fetch(`${POST_GENRES}`, {
            mode: 'cors',
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => {
                console.log(response)
                return response.json();
            })
            .then((response) => {
                console.log(response)
                if (response.success) {
                    dispatch({
                        type: UPDATE_GENRE,
                        payload: { genre_status: true }
                    })

                    history.push("/")
                }
                else {
                    window.location.href = '/logout'
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const handlegenreselection = (e) => {

        let element = e.target
        if (e.target.id == "") {
            element = e.target.parentElement;
        }

        if (genrestate.includes(element.id)) {
            // selectiongenre
            element.classList.remove("selectiongenre")
            var index = genrestate.indexOf(element.id);
            let new_array = JSON.parse(JSON.stringify(genrestate))
            new_array.splice(index, 1);
            setgenrestate(new_array)
            return;
        }
        else {
            element.classList.add("selectiongenre")
        }
        setgenrestate([...genrestate, element.id])
    }


    if (loadscreen) {
        return (
            <>
                <ToastContainer autoClose={2400} />

                <div className="text-2xl flex justify-center w-full items-center mt-10 tracking-wide font-semibold text-center">
                    <h2>Select genres that best suits your interest !</h2>



                </div>
                <div className="genres flex justify-center mt-10">
                    <div className="flex flex-col ">
                        <div className="divison mt-1">

                            <div className="genresection  flex flex-wrap justify-around mt-10">
                                <button id="Entertainment" onClick={handlegenreselection} className="  p-3 pr-4 pl-4 bg-white border-2 border-gray-400 rounded-full m-2">✨ <span className="font-semibold tracking-wider">Entertainment</span> </button>
                                <button id="Finance" onClick={handlegenreselection} className="  p-3 pr-4 pl-4 bg-white border-2 border-gray-400 rounded-full m-2">💰 <span className="font-semibold tracking-wider">Finance</span> </button>
                                <button id="Hustle" onClick={handlegenreselection} className="  p-3 pr-4 pl-4 bg-white border-2 border-gray-400 rounded-full m-2">💪 <span className="font-semibold tracking-wider">Hustle</span> </button>
                                <button id="Investing" onClick={handlegenreselection} className="  p-3 pr-4 pl-4 bg-white border-2 border-gray-400 rounded-full m-2">💸 <span className="font-semibold tracking-wider">Investing</span> </button>
                                <button id="Knowledge" onClick={handlegenreselection} className="  p-3 pr-4 pl-4 bg-white border-2 border-gray-400 rounded-full m-2">📚 <span className="font-semibold tracking-wider">Knowledge</span> </button>
                                <button id="Life" onClick={handlegenreselection} className="  p-3 pr-4 pl-4 bg-white border-2 border-gray-400 rounded-full m-2">💓 <span className="font-semibold tracking-wider">Life</span> </button>
                                <button id="Motivation" onClick={handlegenreselection} className="  p-3 pr-4 pl-4 bg-white border-2 border-gray-400 rounded-full m-2">🏆 <span className="font-semibold tracking-wider">Motivation</span> </button>
                                <button id="Technology" onClick={handlegenreselection} className="  p-3 pr-4 pl-4 bg-white border-2 border-gray-400 rounded-full m-2">💻 <span className="font-semibold tracking-wider">Technology</span> </button>
                                <button id="Travel" onClick={handlegenreselection} className="  p-3 pr-4 pl-4 bg-white border-2 border-gray-400 rounded-full m-2">✈️ <span className="font-semibold tracking-wider">Travel</span> </button>
                                <button id="Wellness" onClick={handlegenreselection} className="  p-3 pr-4 pl-4 bg-white border-2 border-gray-400 rounded-full m-2">🧑‍🤝‍🧑 <span className="font-semibold tracking-wider">Wellness</span> </button>
                            </div>
                        </div>


                    </div>

                </div>
                <div className="w-full flex justify-center ">

                    <button onClick={submitgenre} className="genrebutton border-2 border-black mr-5 md:mr-10 flex items-center justify-around rounded-full p-2 pr-3 pl-3 w-36 text-lg tracking-wide  mt-10 mb-10">Continue <CgChevronDoubleRight className="text-2xl" /></button>
                    <button onClick={() => window.location.href = "/"} className=" border-2 border-black ml-5 md:ml-10 flex items-center justify-around rounded-full bg-gray-300 p-2 pr-3 pl-3 w-24 text-lg tracking-wide  mt-10 mb-10">Skip </button>

                </div>
            </>
        )
    }
    else {
        return (
            <div className=" flex justify-center mt-2">
                <Loader
                    type="Puff"
                    color="#00BFFF"
                    height={70}
                    width={70}
                />
            </div>
        )
    }
}

export default GenreSelection
