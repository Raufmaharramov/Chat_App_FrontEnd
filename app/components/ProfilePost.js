import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import Page from "./Page";
import stateContext from "../stateContext";
import Posts from "./Posts";

function ProfilePost() {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [userPost, setUserPost] = useState([]);
  const appState = useContext(stateContext);

  useEffect(() => {
    async function addPost() {
      try {
        const response = await Axios.get(`/profile/${username}/posts`);
        setUserPost(response.data);
        setIsLoading(false);
        console.log(response.data);
      } catch (e) {
        console.log("errooo");
      }
    }
    addPost();
  }, [username]);
  if (isLoading) return <LoadingDotsIcon />;

  return (
    <div className="list-group">
      {userPost.map(post => {
        return <Posts noAuthor={true} post={post} key={post._id} />;
      })}
    </div>
  );
}
export default ProfilePost;
