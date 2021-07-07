import React, { useEfffect, useState, useContext } from "react";
import Page from "./Page";
import Axios from "axios";
import { withRouter } from "react-router-dom";
import dispatchContext from "../dispatchContext";
import stateContext from "../stateContext";

function CreatePost(props) {
  const [title, setTitle] = useState();
  const [body, setBody] = useState();
  const appDispatch = useContext(dispatchContext);
  const appState = useContext(stateContext);
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await Axios.post("/create-post", { title, body, token: appState.user.token });
      appDispatch({ type: "flashmsg", value: "Congrats You Did!!!" });
      props.history.push(`/post/${response.data}`);
    } catch (e) {
      console.log("err");
    }
  }
  return (
    <Page title="Create-Post">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onChange={e => setTitle(e.target.value)} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onChange={e => setBody(e.target.value)} name="body" id="post-body" className="body-content tall-textarea form-control" type="text"></textarea>
        </div>

        <button className="btn btn-primary">Save New Post</button>
      </form>
    </Page>
  );
}
export default withRouter(CreatePost);
