import React, { useState, useEffect } from "react";
import { BsShareFill } from "react-icons/bs";
import Modal from "react-modal";
import {
  AiOutlineTwitter,
  AiOutlineFacebook,
  AiOutlineWhatsApp,
  AiOutlineLinkedin,
  AiOutlineDelete,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
} from "react-share";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BiCommentDots } from "react-icons/bi";
import { IoIosCopy } from "react-icons/io";
import copy from "copy-to-clipboard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, Link } from "react-router-dom";
import {
  USER_PROFILE,
  USER_POSTS,
  UNFOLLOW,
  FOLLOW,
  ARCHIVE_POST,
} from "../Utils/apiroutes";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiArchiveIn } from "react-icons/bi";
import { RiDeleteBin2Line } from "react-icons/ri";

import Skeleton from "react-loading-skeleton";
import { useSelector } from "react-redux";
import {
  LIKED_POST,
  ADD_BOOKMARK,
  REMOVE_BOOKMARK,
  GET_BOOKMARK,
  DELETE_POST,
} from "../Utils/apiroutes";
import { AiOutlineUpload } from "react-icons/ai";


const Profile = () => {
  Modal.setAppElement("#root");

  const token = useSelector((state) => state.account.token);



  const [modalisOpen, setmodalIsOpen] = useState(false);
  const [urltobeshared, seturltobeshared] = useState(
    `${window.location.protocol}//${window.location.host}${window.location.pathname}`
  );
  let { id } = useParams();
  const [userposts, setuserposts] = useState([]);
  const [userdata, setuserdata] = useState({});
  const [threedotactive, setthreedotactive] = useState(null);
  const [loadingposts, setloadingposts] = useState(false);

  //bookmark post id
  const [postisbookmarked, setpostisbookmarked] = useState(null);
  const [isBookmarked, setisBookmarked] = useState();
  const [bookmarkPostid, setBookmarkPostid] = useState();

  const [isProfileShare, setisProfileShare] = useState(false);

  // follower count
  const [followersCount, setFollowersCount] = useState();
  const [followingCount, setFollowingCount] = useState();

  const [playsCount, setPlaysCount] = useState();

  const loggedIn_id = useSelector((state) => state.account.user);



  useEffect(() => {
    window.addEventListener("click", handleclick, true);
    window.scrollTo(0, 0);
    return () => {
      document.removeEventListener("click", handleclick);
    };
  }, []);

  const handleclick = (event) => {
    if (!event.target.classList.contains("share-popup")) {
      setthreedotactive(null);
    }
  };

  //modal
  const toggleModal = (isprofile = "postshare") => {
    // console.log(isprofile);
    if (isprofile == "profile") setisProfileShare(true);
    else setisProfileShare(false);
    setmodalIsOpen(!modalisOpen);
    // console.log("modal open");
  };

  // For broken images display default logo
  const brokenimages = (event) => {
    event.target.src = `/images/SHRTCAST_logo.jpg`;
  };

  //success msg
  const notify_copy_text = () => {
    toast.success("URL copied!");
  };

  //share profile

  const shareprofile = () => {
    seturltobeshared(
      `${window.location.protocol}//${window.location.host}${window.location.pathname}`
    );
    toggleModal();
  };

  const sharepost = (post_id, isBookmarked1) => {
    // console.log("open share modal");
    setthreedotactive(null);
    setBookmarkPostid(post_id);
    setpostisbookmarked(isBookmarked1);
    // console.log(isBookmarked1);
    seturltobeshared(
      `${window.location.protocol}//${window.location.host}/post-details/${post_id}`
    );
    toggleModal();
  };

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
      local_posts = JSON.parse(JSON.stringify(userposts));
      local_posts.forEach((post) => {
        if (post.post_id === postid) {
          if (post.is_liked === false) {
            post.post_likes_count += 1;
          } else {
            post.post_likes_count -= 1;
          }
          post.is_liked = !post.is_liked;
        }
      });
      // console.log(local_posts);
      setuserposts(local_posts);
    } catch (error) {
      console.log(error);
    }
  };

  //archive post

  const archivepost = (archive_post_id) => {
    const request_body = {
      post_id: archive_post_id,
      status: "archive",
    };

    fetch(ARCHIVE_POST, {
      mode: "cors",
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request_body),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        // console.log(res)
        let local_posts = [];
        local_posts = JSON.parse(JSON.stringify(userposts));
        // console.log(`All posts from feed ${local_posts}`);
        let filtered_posts = [];
        filtered_posts = local_posts.filter((post) => {
          return post.post_id != archive_post_id;
        });
        // console.log(filtered_posts)
        setuserposts(filtered_posts);
        toast.success("Post Deleted!");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // handle bookamrk

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
          //   console.log("ADDED");
          let local_posts = [];
          local_posts = JSON.parse(JSON.stringify(userposts));
          // console.log(`All posts from feed ${local_posts}`);
          local_posts.forEach((post) => {
            if (post.post_id === bookmarkPostid) {
              //   console.log("BOOKMARKED");
              post.is_bookmark = true;
              //   console.log(post.is_bookmark);
            }
          });
          setuserposts(local_posts);
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
          //console.log("removed");
          let local_posts = [];
          local_posts = JSON.parse(JSON.stringify(userposts));
          local_posts.forEach((post) => {
            // console.log(post);
            if (post.post_id === bookmarkPostid) {
              //console.log("REMOVED");
              post.is_bookmark = false;
              //console.log(post.is_bookmark);
            }
          });
          setuserposts(local_posts);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    // console.log(userposts);

    const fetchuserdetails = () => {
      try {
        axios
          .get(`${USER_PROFILE}${id}/`, {
            mode: "cors",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            // console.log(res);
            setuserdata(res.data.data);
            // console.log(res.data.data);
            setFollowersCount(res.data.data.followers_count);
            setFollowingCount(res.data.data.following_count);
            setPlaysCount(res.data.data.number_of_plays);
            // console.log(res.data.data.number_of_plays);
          });
      } catch (error) {
        console.log(error);
      }
    };

    const fetchuserpostdetails = () => {
      setloadingposts(true);

      try {
        axios
          .get(`${USER_POSTS}${id}/?limit=8`, {
            mode: "cors",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            // console.log(res)
            setuserposts(res.data.results);
            setloadingposts(false);
          })
          .catch((err) => {
            console.log(err.response);
          });
      } catch (error) {
        console.log(error);
        setloadingposts(false);
      }
    };

    fetchuserdetails();
    fetchuserpostdetails();
  }, [id]);

  const handlefollow = (current_target) => {
    //current_target --> true --> following --> trigger unfollow API
    //current_target --> false --> not following --> trigger follow API

    let follow_data = {
      target_username: userdata.username,
      target_user_id: userdata.user_id,
    };
    let unfollow_data = {
      target_username: userdata.username,
    };

    if (current_target) {
      //Unfollow

      fetch(`${UNFOLLOW}`, {
        mode: "cors",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(unfollow_data),
      })
        .then((res) => {
          if (res.statusText === "Unauthorized") {
            window.location.href = "/logout";
          }
          return res.json();
        })
        .then((res) => {
          let userupdateddetails = JSON.parse(JSON.stringify(userdata));
          userupdateddetails.is_following = !userupdateddetails.is_following;
          setuserdata(userupdateddetails);
          // console.log(res)
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      //follow

      fetch(`${FOLLOW}`, {
        mode: "cors",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(follow_data),
      })
        .then((res) => {
          if (res.statusText === "Unauthorized") {
            window.location.href = "/logout";
          }
          return res.json();
        })
        .then((res) => {
          let userupdateddetails = JSON.parse(JSON.stringify(userdata));
          userupdateddetails.is_following = !userupdateddetails.is_following;
          setuserdata(userupdateddetails);
          // console.log(res)
        })
        .catch((err) => {
          console.log(err);
        });
    }

    // console.log(current_target)
  };

  return (
    <div className="profilewrapper flex md:flex-row flex-col ">
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
              }}
              className="text-xl  mt-2 ml-1 md:h-6 md:w-32 w-10 cursor-pointer"
            />
          </div>

          <div className="shareicons mt-10 p-4 mr-10 md:mr-5 text-3xl flex justify-around">
            <FacebookShareButton
              url={urltobeshared}
              quote={"hello"}
              className="Demo__some-network__share-button"
            >
              <AiOutlineFacebook className="facebook-share " />
            </FacebookShareButton>

            <TwitterShareButton
              url={urltobeshared}
              quote={"hello"}
              hashtag={"#hashtag"}
              className="Demo__some-network__share-button"
              title={`Checkout my profile on SHORTCAST`}
            >
              <AiOutlineTwitter className="twitter-share" />
            </TwitterShareButton>

            <WhatsappShareButton
              url={urltobeshared}
              className="Demo__some-network__share-button"
              title={`Checkout my profile on SHORTCAST`}
            >
              <AiOutlineWhatsApp className="whatsapp-share" />
            </WhatsappShareButton>

            <LinkedinShareButton
              url={urltobeshared}
              className="Demo__some-network__share-button"
              title={`Checkout my profile on SHORTCAST`}
            >
              <AiOutlineLinkedin className="linkedin-share" />
            </LinkedinShareButton>
          </div>

          {!isProfileShare && (
            <div>
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
            </div>
          )}

          <AiOutlineCloseCircle
            onClick={() => shareprofile()}
            className="closemodal text-2xl absolute cursor-pointer"
          />
        </div>
      </Modal>

      <div className="profilecard text-white  relative md:ml-6 md:mt-6 md:rounded-2xl flex flex-col justify-center ">
        <div className="profile-details flex justify-center items-center ">
          <img
            className="md:h-32 md:w-32 h-28 w-28 mt-8 md:mt-10 border-2 border-gray-400 rounded-full"
            src={userdata.avatar_link}
            alt=""
          />
          <div className="md:mt-8 ml-5">
            <h2 className="mt-5 text-2xl tracking-wide">
              {userdata.full_name}
            </h2>
            <h2 className="username-profile  text-md tracking-wide ">
              @{userdata.username}
            </h2>

            {userdata.is_following === null && (
              <div className="follow flex items-center relative top-3">
                <Link to="/editprofile">
                  {" "}
                  <button className="border-2 border-blue-600 pl-4 pr-4 p-2 rounded-full w-28  top-3 font-semibold tracking-wide">
                    Edit Profile
                  </button>{" "}
                </Link>
                <BsShareFill
                  onClick={() => toggleModal("profile")}
                  className="ml-3 text-xl cursor-pointer"
                />
              </div>
            )}

            {userdata.is_following !== undefined &&
              userdata.is_following &&
              userdata.is_following !== null && (
                <div className="follow flex items-center relative top-3">
                  <button
                    onClick={() => handlefollow(true)}
                    className="bg-blue-600 text-white pl-4 pr-4 p-2 rounded-full w-28  top-3 font-semibold tracking-wide"
                  >
                    Unfollow
                  </button>
                  <BsShareFill
                    onClick={() => toggleModal("profile")}
                    className="ml-3 text-xl cursor-pointer"
                  />
                </div>
              )}
            {userdata.is_following !== undefined &&
              !userdata.is_following &&
              userdata.is_following !== null && (
                <div className="follow flex items-center relative top-3">
                  <button
                    onClick={() => handlefollow(false)}
                    className=" border-2 border-blue-600 pl-4 pr-4 p-2 rounded-full w-28  top-3 font-semibold tracking-wide"
                  >
                    Follow
                  </button>
                  <BsShareFill
                    onClick={() => toggleModal("profile")}
                    className="ml-3 text-xl cursor-pointer"
                  />
                </div>
              )}
          </div>
        </div>
        <div className="followercount mt-7 text-xl flex justify-evenly mb-10">
          <div className="profile-user-interaction flex flex-col text-center p-1 border-white w-24 rounded-xl">
            <span className="font-semibold">
              {playsCount == 0 ||
                playsCount === undefined ||
                playsCount === null
                ? 0
                : playsCount}
            </span>
            <h2 className="text-lg user-interaction-keyword">Plays</h2>
          </div>
          <div className="profile-user-interaction flex flex-col text-center p-1  border-white w-24  rounded-xl">
            <span className="font-semibold">{followingCount}</span>
            <h2 className="text-lg user-interaction-keyword">Following</h2>
          </div>
          <div className="profile-user-interaction flex flex-col text-center  p-1 border-white w-24  rounded-xl">
            <span className="font-semibold">{followersCount}</span>
            <h2 className="text-lg user-interaction-keyword">Followers</h2>
          </div>
        </div>

        {userdata.twitter_handle && (
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://twitter.com/${userdata.twitter_handle}`}
          >
            <div className="user-interaction flex justify-center mt-5 items-center text-md p-2">
              <span className="mr-1 text-xl twitter-share-profile">
                {" "}
                <AiOutlineTwitter />
              </span>
              <span className="hover:underline">
                @{userdata.twitter_handle}
              </span>
            </div>
          </a>
        )}

        <div className="bio flex justify-center mt-5 text-xl text-center mb-5">
          {userdata.bio}
        </div>

        
      </div>

      {userposts.length > 0 && !loadingposts && (
        <div className=" content-profile md:m-10 m-5 flex rounded-2xl justify-start flex-wrap md:p-4 md:pl-5">
          {userposts.map((post) => (
            <div key={post.post_id} className="cardwrapper-profile ">
              <Link to={`/post-details/${post.post_id}`}>
                <div className="card-profile h-52 w-72 rounded-t-2xl ">
                  <img
                    onError={(event) => brokenimages(event)}
                    className="card-image  right-0 h-52 w-80 rounded-t-2xl"
                    src={`${post.image_url}`}
                    alt=""
                  />
                </div>
              </Link>
              <div className="card-profile-content rounded-b-2xl p-3 flex justify-between">
                {post.post_heading && (
                  <h2 className="font-semibold">
                    {post.post_heading.length > 23
                      ? `${post.post_heading.substring(0, 20)}...`
                      : post.post_heading}
                  </h2>
                )}

                <div className="flex items-center relative">
                  <h2 className="flex items-center">
                    <span className="mr-2">
                      {post.post_likes_count === null
                        ? 0
                        : post.post_likes_count}
                    </span>
                    {post.is_liked ? (
                      <FaHeart
                        onClick={() =>
                          handlelikepost(post.post_id, post.is_liked)
                        }
                        className="text-red-500 cursor-pointer"
                      />
                    ) : (
                      <FaRegHeart
                        onClick={() =>
                          handlelikepost(post.post_id, post.is_liked)
                        }
                        className="text-red-500 cursor-pointer"
                      />
                    )}
                  </h2>
                  <Link key={post.post_id} to={`/post-details/${post.post_id}`}>
                    <h2 className="flex items-center ml-5 text-xl">
                      <BiCommentDots />
                    </h2>
                  </Link>
                  <h2
                    onClick={() => setthreedotactive(post.post_id)}
                    className="flex items-center ml-5 text-xl cursor-pointer"
                  >
                    <BsThreeDotsVertical />
                  </h2>
                  <div
                    className={
                      "share-popup z-20 bg-white absolute h-auto w-32 mb-32 p-2 rounded-lg " +
                      (post.post_id === threedotactive ? "block" : "hidden")
                    }
                  >
                    <div
                      onClick={() => sharepost(post.post_id, post.is_bookmark)}
                      className="share-popup flex items-center hover:bg-gray-300 cursor-pointer p-2 rounded-lg"
                    >
                      <BsShareFill />
                      <span className="ml-5 share-popup">Share</span>
                    </div>
                    {id == loggedIn_id && (
                      <div
                        onClick={() => archivepost(post.post_id)}
                        className="share-popup flex items-center hover:bg-gray-300 cursor-pointer p-2 rounded-lg"
                      >
                        <RiDeleteBin2Line className="text-xl share-popup" />
                        <span className="ml-5">Delete</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {userposts.length === 0 && !loadingposts && (
        <div className=" content-profile md:m-10 m-5 rounded-2xl flex justify-center items-center flex-col">
          <h2 className="text-black text-4xl mt-5 text-center">
            No Posts here!
          </h2>

          {id == loggedIn_id && (
            <Link to="/addpost">
              <div className="mt-10 md:mt-10 text-center ">
                <button className="p-4 record-short-profile font-semibold tracking-wide rounded-2xl">
                  Record Your First SHORT
                </button>
              </div>
            </Link>
          )}
        </div>
      )}

      {loadingposts && (
        <div className=" content-profile md:m-10 m-5 rounded-2xl flex justify-center items-center flex-col">
          <Skeleton
            className="mb-10 ml-10"
            count={9}
            height={150}
            width={300}
          />
        </div>
      )}
    </div>
  );
};

export default Profile;
