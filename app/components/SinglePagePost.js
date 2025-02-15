import React, { useEffect, useState, useContext } from "react";
import Page from "./Page";
import { useParams } from "react-router-dom";
import Axios from "axios";
import { Link, withRouter } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import ReactMarkdown from "react-markdown";
import ReactTooltip from "react-tooltip";
import NotFound from "./NotFound";
import dispatchContext from "../dispatchContext";
import stateContext from "../stateContext";

function SinglePagePost(props) {
  const appDispatch = useContext(dispatchContext);
  const appState = useContext(stateContext);
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState([]);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function addPost() {
      try {
        const response = await Axios.get(`/post/${id}`, { cancelToken: ourRequest.token });
        setPost(response.data);
        setIsLoading(false);
        console.log(response.data);
      } catch (e) {
        console.log("errooo");
      }
    }
    addPost();
    return () => {
      ourRequest.cancel();
    };
  }, [id]);

  if (!isLoading && !post) {
    return <NotFound />;
  }

  async function handleDelete() {
    const areyousure = window.confirm("Doyou really want to delete this post?");
    if (areyousure) {
      try {
        const response = await Axios.delete(`/post/${id}`, { data: { token: appState.user.token } });
        if (response.data == "Success") {
          appDispatch({ type: "flashmsg", value: "The post was successfully deleted" });
          props.history.push(`/profile/${appState.user.username}`);
        }
      } catch (e) {
        console.log("there is error while deleting the post");
      }
    }
  }

  function isOwner() {
    if (appState.loggedIn) {
      return appState.user.username == post.author.username;
    }
    return false;
  }

  if (isLoading) return <LoadingDotsIcon />;

  const date = new Date(post.createdDate);
  const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
                <h2>{post.title}</h2>    
        {isOwner() && (
          <span className="pt-2">
            {" "}
                      
            <Link to={`/post/${post._id}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-2">
              <i className="fas fa-edit"></i>
            </Link>
               
            <ReactTooltip id="edit" className="custom-tooltip" />
            <a onClick={handleDelete} data-tip="Delete" data-for="delete" className="delete-post-button text-danger">
              <i className="fas fa-trash"></i>
            </a>
                
            <ReactTooltip id="delete" className="custom-tooltip" />
               
          </span>
        )}
           
      </div>
           
      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          {" "}
                    
          <img className="avatar-tiny" src={post.author.avatar} />         
        </Link>
                Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {dateFormatted}      
      </p>
       
      <div className="body-content">
        <ReactMarkdown children={post.body} />
      </div>
    </Page>
  );
}
export default withRouter(SinglePagePost);
