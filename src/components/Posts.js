import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import { BsShareFill } from "react-icons/bs";
import { BiCommentDots } from "react-icons/bi";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import {
  DISCOVER_FEED,
  FETCH_COMMENTS,
  LIKED_POST,
  SHARE_POST,
  UPLOAD_AUDIO,
  UPLOAD_POST,
  ADD_BOOKMARK,
  REMOVE_BOOKMARK,
  GET_BOOKMARK,
  PLAYED_POST
} from "../Utils/apiroutes";
import axios from "axios";
import Modal from "react-modal";

import { AiOutlineCloseCircle } from "react-icons/ai";
import { IoIosCopy } from "react-icons/io";
import {
  AiOutlineTwitter,
  AiOutlineFacebook,
  AiOutlineWhatsApp,
  AiOutlineLinkedin,
} from "react-icons/ai";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
} from "react-share";
import copy from "copy-to-clipboard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BiExpandAlt } from "react-icons/bi";
import { Link } from "react-router-dom";
// import MicRecorder from 'mic-recorder-to-mp3';
import RecordUI from "./UI-helper/RecordUI";

const MicRecorder = require("mic-recorder-to-mp3");

const recorder = new MicRecorder({
  bitRate: 128,
});

const Posts = () => {
  const token = useSelector((state) => state.account.token);
  const prevref_ref = useRef(null);
  const nextposts_ref = useRef(null);

  useEffect(() => {
    const getposts = async () => {
      setloadingposts(true);
      try {
        const response = await axios.get(DISCOVER_FEED, {
          mode: "cors",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log(`Discover feed response ${response}`);
        setposts(response.data.results);
        nextposts_ref.current = response.data.next;
        setloadingposts(false);
      } catch (error) {
        console.log(error);
        setloadingposts(false);
      }
    };
    getposts();
  }, []);

  useEffect(() => {
    console.log(posts);
  })

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  //scroll on load
  useEffect(() => {
    const onScroll = function (e) {
      e.preventDefault();

      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 2
      ) {
        if (prevref_ref.current != "true") {
          callnextposts();
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // useEffect(() => {
  //   axios.get(GET_BOOKMARK, {
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //   }).then((res) => console.log(res))
  // }, [])

  //modal
  Modal.setAppElement("#root");

  //posts
  const [posts, setposts] = useState([]);
  const [loadingposts, setloadingposts] = useState(false);
  const [loadingcomments, setloadingcomments] = useState(false);

  const user_redux_id = useSelector((state) => state.account.user);

  //detect screen size
  const [isDesktop, setDesktop] = useState(window.innerWidth > 800);

  //audio
  const [currentaudioplayevent, setcurrentaudioplayevent] = useState(null);

  //comment section
  const [commentsection, setcommentsection] = useState([]);
  const [currentcommentpostid, setcurrentcommentpostid] = useState(null);

  //modal
  const [modalisOpen, setmodalIsOpen] = useState(false);
  const [urltobeshared, seturltobeshared] = useState("");
  const [sharepostheading, setsharepostheading] = useState("");
  const [sharefullname, setsharefullname] = useState("");
  const [sharepostid, setsharepostid] = useState(null);

  // Comment Modal
  const [isRecording, setisRecording] = useState(false);
  const [blobURL, setblobURL] = useState("");
  const [isBlocked, setisblocked] = useState(false);
  const [audiofilename, setaudiofilename] = useState("");
  const [publicURL, setpublicURL] = useState("");
  const [timer, setTimer] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  // comment modal render on change

  //fetch comments
  const [showComment, setShowComment] = useState(false);
  const [showcommentid, setshowcommentid] = useState("");
  const [allcomments, setallcomments] = useState([]);
  const [nonextcomments, setnonextcomments] = useState(false);

  //modal
  const [open, setOpen] = React.useState(false);

  const [nextcomments, setnextcomments] = useState("");

  //current id of parent's comment which is being recorded
  const [recordingparentid, setrecordingparentid] = useState(0);

  //bookmark post id
  const [postisbookmarked, setpostisbookmarked] = useState(null);
  const [isBookmarked, setisBookmarked] = useState();
  const [bookmarkPostid, setBookmarkPostid] = useState();

  // For broken images display default logo
  const brokenimages = (event) => {
    event.target.src = `./images/SHRTCAST_logo.jpg`;
  };

  //update screen change
  const updateMedia = () => {
    setDesktop(window.innerWidth > 800);
  };

  //handle current audio
  const handlecurrentaudio = (event, post_id) => {
    if (
      currentaudioplayevent !== null &&
      currentaudioplayevent !== event.target
    ) {
      currentaudioplayevent.pause();
    }
    setcurrentaudioplayevent(event.target);

    let data = { post_id: post_id }
    axios.post(PLAYED_POST, data, {
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => console.log("Played"))
      .catch((err) => console.log(err))
  };

  //load comments
  const handlecomments = async (postid) => {
    setnonextcomments(false);
    setcurrentcommentpostid(postid);
    setcommentsection([]);
    setloadingcomments(true);

    let data = {
      id: postid,
    };
    try {
      const response = await axios.post(FETCH_COMMENTS, data, {
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response);
      setnextcomments(response.data.next);
      setcommentsection(response.data.results);
      setcurrentcommentpostid(postid);
      setloadingcomments(false);
    } catch (error) {
      console.log(error);
      setloadingcomments(false);
    }
  };

  //call next posts
  const callnextposts = () => {
    // setloadingposts(true);
    prevref_ref.current = "true";

    if (nextposts_ref.current == null || nextposts_ref.current == "") {
      // setloadingposts(false);
      prevref_ref.current = "false";
      return;
    }
    fetch(nextposts_ref.current, {
      mode: "cors",
      "Access-Control-Request-Headers": "content-type",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.statusText == "Unauthorized") {
          window.location.href = "/logout";
        }
        return response.json();
      })
      .then((res) => {
        // setloadingposts(false);

        // setposts(posts => [...posts, res.results]);
        setposts((old) => {
          return [...old, ...res.results];
        });

        prevref_ref.current = "false";
        nextposts_ref.current = res.next;
      })
      .catch((err) => {
        prevref_ref.current = "false";
        console.log("err", err);
        // setloadingposts(false);
      });
  };

  //toggle share modal
  const toggleModal = () => {
    setmodalIsOpen(!modalisOpen);
  };

  //comment modal functions

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const startRecording = () => {
    setisRecording(true);
    if (isBlocked) {
      console.log("Permission Denied");
    } else {
      recorder
        .start()
        .then(() => {
          setisRecording(true);
        })
        .catch((e) => console.error(e));
    }
  };
  const stopRecording = (id) => {
    setisRecording(false);
    // setisLoadingcomments(true);
    recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob);
        setblobURL(blobURL);
        const file = new File(buffer, "music.mp3", {
          type: blob.type,
          lastModified: Date.now(),
        });
        return file;
      })
      .then((file) => {
        const formData = new FormData();
        formData.append("file", file);

        fetch(`${UPLOAD_AUDIO}/`, {
          mode: "cors",
          method: "POST",
          body: formData,
        })
          .then((response) => {
            return response.json();
          })
          .then((response) => {
            setaudiofilename(response.filename);
            setpublicURL(response.publicUrl);
            return response;
          })
          .then((response) => {
            postaudiowithdetails(id, response.filename, response.publicUrl);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((e) => console.log(e));
  };

  const postaudiowithdetails = (id, file__name, public__Url) => {
    let elapsed_time = 60 - timer;
    let posttype = "comment";

    let data = {
      post_heading: null,
      image_url: null,
      audio_duration: elapsed_time,
      post_time_length: 60,
      parent_id: id,
      genre: null,
      audio_file_name: file__name,
      audio_file_url: public__Url,
      hashtag: null,
      post_type: posttype,
    };

    fetch(`${UPLOAD_POST}`, {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.statusText == "Unauthorized") {
          window.location.href = "/logout";
        }
        return response.json();
      })
      .then((res) => {
        handleChange(id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (postid) => {
    // setnocomments(false)
    setloadingcomments(true);
    let data = {
      id: postid,
    };
    fetch(`${FETCH_COMMENTS}`, {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.statusText == "Unauthorized") {
          window.location.href = "/logout";
        }
        return response.json();
      })
      .then((res) => {
        // console.log(res)
        setcommentsection(res.results);
        setnextcomments(res.next);
        setloadingcomments(false);
      })
      .catch((err) => {
        console.log(err);
        setloadingcomments(false);
      });
    setShowComment(!showComment);
    setcurrentcommentpostid(postid);
  };

  useEffect(() => {
    let interval = null;

    if (isActive && isPaused === false) {
      interval = setInterval(() => {
        setTimer((time) => {
          if (Math.floor(time) <= 0) {
            stopRecording(recordingparentid);
            handleTimer(0);
            handleClose();
            clearInterval(interval);
            return time;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive, isPaused]);

  //handle timer of song
  const handleTimer = (val) => {
    if (val == 0) {
      setTimer(60);
    }
    setIsPaused(!isPaused);
    setIsActive(!isActive);
  };

  //open sharemodal
  const opensharemodal = (
    url_path,
    post_heading,
    user_fullname,
    postid,
    isBookmarked1
  ) => {
    const url_share = `${window.location.protocol}//${window.location.host}${url_path}`;
    // console.log(isBookmarked1);
    setsharepostid(postid);
    seturltobeshared(url_share);
    setsharefullname(user_fullname);
    setsharepostheading(post_heading);
    setBookmarkPostid(postid);
    setpostisbookmarked(isBookmarked1);
    // console.log(postisbookmarked);
    setmodalIsOpen(!modalisOpen);
  };

  //bookmark function

  const handleBookmark = () => {
    // console.log(isBookmarked);
    if (!postisbookmarked) {
      //remove
      let data = { post_id: bookmarkPostid };
      axios
        .post(ADD_BOOKMARK, data, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setpostisbookmarked(!postisbookmarked);
          // console.log("ADDED");
          let local_posts = [];
          local_posts = JSON.parse(JSON.stringify(posts));
          // console.log(`All posts from feed ${local_posts}`);
          local_posts.forEach((post) => {
            if (post.post_id === bookmarkPostid) {
              // console.log("BOOKMARKED");
              post.is_bookmark = true;
              // console.log(post.is_bookmark);
            }
          });
          setposts(local_posts);
        })
        .catch((err) => console.log(err));
    } else {
      // add
      let data = { post_id: bookmarkPostid };
      axios
        .post(REMOVE_BOOKMARK, data, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setpostisbookmarked(!postisbookmarked);
          // console.log("removed");
          let local_posts = [];
          local_posts = JSON.parse(JSON.stringify(posts));
          local_posts.forEach((post) => {
            // console.log(post);
            if (post.post_id === bookmarkPostid) {
              // console.log("REMOVED");
              post.is_bookmark = false;
              // console.log(post.is_bookmark);
            }
          });
          setposts(local_posts);
        })
        .catch((err) => console.log(err));
    }
  };

  //notifications
  const notify_copy_text = () => {
    toast.success("URL copied!");
  };

  //share API
  const trigger_share = async () => {
    let data = {
      post_id: sharepostid,
    };
    try {
      const response = await axios.post(SHARE_POST, data, {
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  //load next comments

  const loadmorecomments = (eleid) => {
    // console.log(eleid)
    let data = {
      id: eleid,
    };
    // console.log(nextcomments)
    if (nextcomments != null) {
      fetch(nextcomments, {
        method: "POST",
        mode: "cors",
        "Access-Control-Request-Headers": "content-type",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          // console.log(response)

          if (response.statusText == "Unauthorized") {
            window.location.href = "/logout";
          }
          return response.json();
        })
        .then((res) => {
          // console.log(res)
          setcommentsection((old) => {
            return [...old, ...res.results];
          });
          setnextcomments(res.next);
        })
        .catch((err) => {
          console.log("err", err);
        });
    } else {
      setnonextcomments(true);
    }
  };

  //like functionality
  const handlelikepost = async (postid, poststatus) => {
    // console.log(postid, poststatus);
    let data;

    if (!poststatus) {
      data = {
        liked: true,
        post_id: postid,
      };
    } else {
      data = {
        liked: false,
        post_id: postid,
      };
    }

    try {
      const response = await axios.post(LIKED_POST, data, {
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response);

      let local_posts = [];
      local_posts = JSON.parse(JSON.stringify(posts));
      local_posts.forEach((post) => {
        if (post.post_id === postid) {
          if (post.is_liked === false) {
            post.post_likes_count += 1;
          } else {
            if (post.post_likes_count !== 0) post.post_likes_count -= 1;
          }
          post.is_liked = !post.is_liked;
        }
      });
      // console.log(local_posts);
      setposts(local_posts);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="">
        <div className="postswrapper">
          <ToastContainer autoClose={2400} />

          <Modal
            isOpen={modalisOpen}
            onRequestClose={toggleModal}
            contentLabel="My dialog"
            className=" sharemodal z-50 bg-white p-10 md:h-96 md:w-96 h-80 w-80  absolute border-2 border-black outline-none rounded-lg"
          >
            <div className=" md:h-80 md:w-80 h-72 w-72 md:p-8 relative">
              <h2 className="text-xl font-extrabold">Share via</h2>
              <div className="flex items-center">
                <input
                  className="p-2 border-2 border-gray-400 mt-2 rounded-lg"
                  type="text"
                  value={urltobeshared}
                  disabled
                />
                <IoIosCopy
                  onClick={() => {
                    copy(urltobeshared);
                    notify_copy_text();
                    trigger_share();
                  }}
                  className="text-xl  mt-2 ml-1 md:h-6 md:w-32 w-10 cursor-pointer"
                />
              </div>

              <div className="shareicons mt-10 p-4 mr-10 md:mr-5 text-3xl flex justify-around">
                <FacebookShareButton
                  url={urltobeshared}
                  quote={`Listen to an amazing SHORT on "${sharepostheading}" by ${sharefullname} on`}
                  className="Demo__some-network__share-button"
                >
                  <AiOutlineFacebook
                    onClick={() => trigger_share()}
                    className="facebook-share "
                  />
                </FacebookShareButton>

                <TwitterShareButton
                  url={urltobeshared}
                  quote={""}
                  hashtag={"#hashtag"}
                  className="Demo__some-network__share-button"
                  title={`Listen to an amazing SHORT on "${sharepostheading}" by ${sharefullname} on`}
                >
                  <AiOutlineTwitter
                    onClick={() => trigger_share()}
                    className="twitter-share"
                  />
                </TwitterShareButton>

                <WhatsappShareButton
                  url={urltobeshared}
                  className="Demo__some-network__share-button"
                  title={`Listen to an amazing SHORT on "${sharepostheading}" by ${sharefullname} on`}
                >
                  <AiOutlineWhatsApp
                    onClick={() => trigger_share()}
                    className="whatsapp-share"
                  />
                </WhatsappShareButton>

                <LinkedinShareButton
                  url={"https://ui.short-cast.club/post"}
                  className="Demo__some-network__share-button"
                  title={`Listen to an amazing SHORT on "${sharepostheading}" by ${sharefullname} on`}
                >
                  <AiOutlineLinkedin
                    onClick={() => trigger_share()}
                    className="linkedin-share"
                  />
                </LinkedinShareButton>
              </div>

              {postisbookmarked ? (
                <span
                  className={
                    "star-icon flex items-center absolute MD:bottom-0 md:left-16 bottom-5 left-6"
                  }
                >
                  <h2 className="text-xl">Bookmark Short :</h2>{" "}
                  <AiFillStar
                    onClick={handleBookmark}
                    className="text-yellow-500 cursor-pointer text-2xl ml-2"
                  />
                </span>
              ) : (
                <span
                  className={
                    "star-icon flex items-center absolute MD:bottom-0 md:left-16 bottom-5 left-6"
                  }
                >
                  <h2 className="text-xl">Bookmark Short :</h2>{" "}
                  <AiOutlineStar
                    onClick={handleBookmark}
                    className=" cursor-pointer text-2xl ml-2"
                  />
                </span>
              )}

              <AiOutlineCloseCircle
                onClick={toggleModal}
                className="closemodal text-2xl absolute cursor-pointer"
              />
            </div>
          </Modal>

          <div className="post-heading p-8 text-3xl tracking-wider md:ml-4 lg:ml-6">
            Explore
          </div>
          <div className="seperator h-1"></div>
          <div className="flex justify-center mt-5 lg:absolute lg:right-10">
            {/* <Link to="/addpost"> */}
            <RecordUI />
            {/* </Link> */}
          </div>
          <div className="posts p-4 pt-5">
            {
              loadingposts ? (
                <div>
                  {isDesktop ? (
                    <Skeleton
                      className="mb-10 ml-10"
                      count={5}
                      height={150}
                      width={1000}
                    />
                  ) : (
                    <Skeleton
                      className="mb-10 ml-5"
                      count={5}
                      height={150}
                      width={"80vw"}
                    />
                  )}
                </div> //remove div here
              ) : (
                <div>
                  {posts.map((post) => (
                    <div key={post.post_id} className="mb-10 ">
                      <div>{console.log(post)}</div>
                      <div className="card-wrapper flex ">
                        <div className="card h-36 md:ml-11 ml-3 mr-2 md:rounded-2xl rounded-t-2xl flex flex-col relative">
                          <div className="flex flex-col md:flex-row ">
                            <div
                              className={
                                `user md:p-3 flex items-center text-white md:w-36  rounded-tl-2xl md:text-base text-xs w-24 justify-around h-14 ` +
                                (modalisOpen || open ? "" : "z-10")
                              }
                            >
                              <img
                                className="h-8 w-8 rounded-full ml-3"
                                src={post.user_data.avatar_link}
                                alt=""
                              />
                              {post.user_data.user_type == 'dummy'
                                ? <Link
                                to={`/profile/${post.user_data.user_id}`}
                                className="user-link"
                              >
                                <div className="mt-1">
                                  {(post.user_data.full_name.length > 15
                                    ? `${post.user_data.full_name.substring(0, 13)}...`
                                    : post.user_data.full_name) }
                                </div>
                              </Link> 
                                    : <Link
                                    to={`/profile/${post.user_data.user_id}`}
                                    className="user-link"
                                  >
                                    <div className="mt-1">
                                      {(post.user_data.username.length > 15
                                        ? `${post.user_data.username.substring(0, 13)}...`
                                        : post.user_data.username) }
                                    </div>
                                  </Link>}
                              {/*<Link
                                to={`/profile/${post.user_data.user_id}`}
                                className="user-link"
                              >
                                <div className="mt-1">
                                  {(post.user_data.username.length > 15
                                    ? `${post.user_data.username.substring(0, 13)}...`
                                    : post.user_data.username) }
                                </div>
                                  </Link>*/}
                            </div>
                            <div
                              className={
                                "title  text-2xl md:text-2xl lg:text-3xl text-white font-extrabold tracking-wide pt-3 lg:pr-9 pl-2 lg:text-center md:mt-5 md:ml-0 ml-10 lg:mt-3 " +
                                (modalisOpen || open ? "" : "z-10")
                              }
                            >
                              {post.post_heading.length > 20
                                ? `${post.post_heading.substring(0, 17)}...`
                                : post.post_heading}
                            </div>
                          </div>

                          <div className="absolute right-0">
                            <div className="relative">
                              <span
                                className={
                                  "genre absolute text-white pl-3 pr-3 p-1 rounded-b-md right-6 text-xs tracking-wide " +
                                  (modalisOpen || open ? "" : "z-10")
                                }
                              >
                                {post.genre}
                              </span>

                              {post.user_id === user_redux_id && (
                                <Link to={`/post-details/${post.post_id}`}>
                                  <button
                                    className={
                                      "absolute hidden md:block pl-3 pr-3 p-1 rounded-md text-xs tracking-wider bg-white bottom-2 right-4 font-semibold " +
                                      (modalisOpen || open ? "" : "z-10")
                                    }
                                  >
                                    Add Thread
                                  </button>
                                </Link>
                              )}

                              {post.user_id !== user_redux_id &&
                                post.has_thread && (
                                  <Link to={`/post-details/${post.post_id}`}>
                                    <button
                                      className={
                                        "absolute hidden md:block pl-3 pr-3 p-1 rounded-md text-xs tracking-wider bg-white bottom-2 right-4 font-semibold " +
                                        (modalisOpen || open ? "" : "z-10")
                                      }
                                    >
                                      Show Thread
                                    </button>
                                  </Link>
                                )}

                              <div className="imagewrapper">
                                <img
                                  className=" image md:rounded-r-2xl"
                                  src={post.image_url}
                                  alt=""
                                  onError={(event) => brokenimages(event)}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="absolute bottom-4 flex justify-center items-center">
                            {isDesktop ? (
                              <AudioPlayer
                                className="audioplayer rounded-2xl"
                                src={post.audio_file_url}
                                onPlay={(event) => {
                                  handlecurrentaudio(event, post.post_id);
                                }}
                                customAdditionalControls={[]}
                                customVolumeControls={[]}
                                showDownloadProgress={false}
                              />
                            ) : (
                              <AudioPlayer
                                className="audioplayer rounded-2xl"
                                src={post.audio_file_url}
                                onPlay={(event) => {
                                  handlecurrentaudio(event, post.post_id);

                                }}
                                customAdditionalControls={[]}
                                customVolumeControls={[]}
                                showDownloadProgress={false}
                                layout="horizontal-reverse"
                              />
                            )}
                          </div>
                        </div>
                        <div className="hidden user-interaction md:flex flex-col justify-around md:w-20 w-10 items-center md:text-2xl text-xl">
                          <BsShareFill
                            onClick={() =>
                              opensharemodal(
                                `/post-details/${post.post_id}`,
                                post.post_heading,
                                post.user_data.full_name,
                                post.post_id,
                                post.is_bookmark
                              )
                            }
                            className="cursor-pointer ml-5"
                          />
                          <BiCommentDots
                            onClick={() => handlecomments(post.post_id)}
                            className="cursor-pointer ml-5"
                          />
                          {post.is_liked ? (
                            <div className="flex items-center">
                              <span className="mr-3 text-xl">
                                {post.post_likes_count}
                              </span>
                              <FaHeart
                                onClick={() =>
                                  handlelikepost(post.post_id, post.is_liked)
                                }
                                style={{ color: "#EF4444" }}
                                className="cursor-pointer"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <span className="mr-3 text-xl">
                                {post.post_likes_count}
                              </span>
                              <FaRegHeart
                                onClick={() =>
                                  handlelikepost(post.post_id, post.is_liked)
                                }
                                className="cursor-pointer"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      {/* mobile panel section */}
                      <div className="mobilecommentsection md:hidden flex  justify-around pt-3 p-2 rounded-b-2xl">
                        {post.is_liked ? (
                          <div className="flex items-center">
                            <span className="mr-3">
                              {post.post_likes_count}
                            </span>

                            <FaHeart
                              onClick={() =>
                                handlelikepost(post.post_id, post.is_liked)
                              }
                              style={{ color: "#EF4444" }}
                              className="cursor-pointer text-xl"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <span className="mr-3">
                              {post.post_likes_count}
                            </span>
                            <FaRegHeart
                              onClick={() =>
                                handlelikepost(post.post_id, post.is_liked)
                              }
                              className="cursor-pointer text-xl"
                            />
                          </div>
                        )}
                        <BiCommentDots
                          onClick={() => handlecomments(post.post_id)}
                          className="cursor-pointer text-xl"
                        />
                        <BsShareFill
                          onClick={() =>
                            opensharemodal(
                              `/post-details/${post.post_id}`,
                              post.post_heading,
                              post.user_data.full_name,
                              post.post_id,
                              post.is_bookmark
                            )
                          }
                          className="cursor-pointer text-xl "
                        />
                        <Link to={`/post-details/${post.post_id}`}>
                          {post.user_id === user_redux_id && (
                            <BiExpandAlt className="cursor-pointer text-xl font-semibold" />
                          )}
                          {post.user_id !== user_redux_id &&
                            post.has_thread && (
                              <BiExpandAlt className="cursor-pointer text-xl font-semibold" />
                            )}
                        </Link>
                      </div>

                      {/* comments section */}
                      {currentcommentpostid === post.post_id &&
                        commentsection.length === 0 &&
                        !loadingcomments && (
                          <div className="md:ml-24 ml-8 mt-5  ">
                            <button
                              className="navbar mt-2 rounded-md p-2 mb-4"
                              onClick={handleOpen}
                            >
                              Add Comment
                            </button>
                            <div className="commentsection md:h-14  w-10 rounded-lg p-2 flex  items-center relative">
                              <div className="flex items-center">
                                <div className="mt-1 pl-2">No Comments</div>
                              </div>
                            </div>

                            <Modal
                              isOpen={open}
                              onRequestClose={handleClose}
                              contentLabel="My dialog"
                              // sharemodal z-50 bg-white p-10 md:h-96 md:w-96 h-80 w-80  absolute border-2 border-black outline-none rounded-lg
                              className="commentmodal md:h-96 md:w-96 w-96 absolute z-50 bg-white rounded-4xl "
                            >
                              <div className="flex flex-col justify-center items-center p-5">
                                <AiOutlineCloseCircle
                                  onClick={handleClose}
                                  className=" absolute top-2 right-10 text-2xl cursor-pointer"
                                />
                                <div className="flex justify-center border-2 border-black h-56 w-56 rounded-full items-center text-5xl ">
                                  <div className="text-6xl">{timer}s</div>
                                </div>

                                <div className="flex justify-center items-center p-8 space-x-4">
                                  <button
                                    onClick={() => {
                                      setrecordingparentid(post.post_id);
                                      startRecording();
                                      handleTimer(1);
                                    }}
                                    disabled={isRecording}
                                    className="navbar rounded-md py-2 px-6"
                                  >
                                    <span className="flex flex-col items-center justify-center">
                                      <span>Start</span>
                                      <span>Recording</span>
                                    </span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      stopRecording(post.post_id);
                                      handleTimer(0);
                                      handleClose();
                                    }}
                                    disabled={!isRecording}
                                    className="bg-red-500 rounded-md py-2 px-6"
                                  >
                                    <span className="flex flex-col items-center justify-center">
                                      <span>Stop</span>
                                      <span>Recording</span>
                                    </span>
                                  </button>
                                </div>
                              </div>
                            </Modal>
                          </div>
                        )}
                      {currentcommentpostid === post.post_id &&
                        loadingcomments &&
                        isDesktop && (
                          <div className="mt-5">
                            <Skeleton
                              className="mb-5 ml-32 "
                              count={5}
                              height={40}
                              width={800}
                            />
                          </div>
                        )}

                      {currentcommentpostid === post.post_id &&
                        loadingcomments &&
                        !isDesktop && (
                          <div className="mt-5">
                            <Skeleton
                              className="mb-5 ml-5 "
                              count={5}
                              height={40}
                              width={300}
                            />
                          </div>
                        )}

                      {currentcommentpostid === post.post_id &&
                        commentsection.length >= 1 &&
                        !loadingcomments && (
                          <div>
                            <button
                              className="navbar mt-5 rounded-md p-2 md:ml-24 ml-8"
                              onClick={handleOpen}
                            >
                              ADD Comment
                            </button>
                            {commentsection.map((comments) => (
                              <div
                                key={comments.post_id}
                                className="md:ml-24 ml-8 mt-5  "
                              >
                                <div className="commentsection md:h-14  w-10 rounded-lg p-2 flex  items-center relative mb-2">
                                  <div className="flex items-center">
                                    <img
                                      className="h-8 w-8 rounded-full md:ml-5 ml-2"
                                      src={comments.user_data.avatar_link}
                                      alt=""
                                    />
                                    <div className="mt-1 pl-2">
                                      {comments.user_data.username}
                                    </div>
                                  </div>
                                  <div className="">
                                    {isDesktop ? (
                                      <AudioPlayer
                                        className="audioplayercommentsection rounded-2xl absolute md:right-0 bottom-0"
                                        src={comments.audio_file_url}
                                        onPlay={(event) => {
                                          handlecurrentaudio(event);
                                        }}
                                        customAdditionalControls={[]}
                                        customVolumeControls={[]}
                                        showDownloadProgress={false}
                                        layout="horizontal-reverse"
                                      />
                                    ) : (
                                      <AudioPlayer
                                        className="audioplayercommentsection rounded-2xl flex justify-center items-end"
                                        src={comments.audio_file_url}
                                        onPlay={(event) => {
                                          handlecurrentaudio(event);
                                        }}
                                        customAdditionalControls={[]}
                                        customVolumeControls={[]}
                                        showDownloadProgress={false}
                                        customProgressBarSection={[]}
                                      />
                                    )}
                                  </div>
                                </div>

                                {/*COMMENT MODAL*/}
                                <Modal
                                  isOpen={open}
                                  onRequestClose={handleClose}
                                  contentLabel="My dialog"
                                  // sharemodal z-50 bg-white p-10 md:h-96 md:w-96 h-80 w-80  absolute border-2 border-black outline-none rounded-lg
                                  className="commentmodal md:h-96 md:w-96 h-80 w-80 absolute z-50 bg-white rounded-xl"
                                >
                                  <div className="flex flex-col justify-center items-center p-8 border-2 border-gray-600">
                                    <AiOutlineCloseCircle
                                      onClick={handleClose}
                                      className="closemodal absolute text-2xl cursor-pointer"
                                    />
                                    <div className="flex justify-center border-2 border-black h-56 w-56 rounded-full items-center text-5xl ">
                                      <div className="text-6xl">{timer}s</div>
                                    </div>

                                    <div className="flex justify-center items-center p-8 space-x-4">
                                      <button
                                        onClick={() => {
                                          setrecordingparentid(post.post_id);
                                          startRecording();
                                          handleTimer(1);
                                        }}
                                        disabled={isRecording}
                                        className="navbar rounded-md py-2 px-6"
                                      >
                                        <span className="flex flex-col items-center justify-center">
                                          <span>Start</span>
                                          <span>Recording</span>
                                        </span>
                                      </button>
                                      <button
                                        onClick={() => {
                                          stopRecording(post.post_id);
                                          handleTimer(0);
                                          handleClose();
                                        }}
                                        disabled={!isRecording}
                                        className="bg-red-600 rounded-md py-2 px-6"
                                      >
                                        <span className="flex flex-col items-center justify-center text-white">
                                          <span>Stop</span>
                                          <span>Recording</span>
                                        </span>
                                      </button>
                                    </div>
                                  </div>
                                </Modal>
                              </div>
                            ))}

                            {!nonextcomments && (
                              <button
                                onClick={() => loadmorecomments(post.post_id)}
                                className="md:ml-24 ml-8 mt-5 p-2 tracking-wider text-white rounded-xl bg-blue-500"
                              >
                                Load more
                              </button>
                            )}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              ) //remove div here
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default Posts;
