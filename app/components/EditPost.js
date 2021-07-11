import React, { useEffect, useState, useContext } from "react";
import Page from "./Page";
import { useParams } from "react-router-dom";
import Axios from "axios";
import { Link, withRouter } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import { useImmerReducer } from "use-immer";
import dispatchContext from "../dispatchContext";
import stateContext from "../stateContext";
import NotFound from "./NotFound";

function EditPost(props) {
  const appDispatch = useContext(dispatchContext);
  const appState = useContext(stateContext);
  const initialState = {
    title: {
      value: "",
      hasError: false,
      message: ""
    },
    body: {
      value: "",
      hasError: false,
      message: ""
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    notFound: false
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case "FetchComplete":
        draft.title.value = action.value.title;
        draft.body.value = action.value.body;
        draft.isFetching = false;
        return;
      case "titleChanged":
        draft.title.hasError = false;
        draft.title.value = action.value;
        return;
      case "bodyChanged":
        draft.body.hasError = false;
        draft.body.value = action.value;
        return;
      case "requestStarted":
        draft.isSaving = true;
        return;
      case "countIncreased":
        if (!draft.title.hasError && !draft.body.hasError) {
          draft.sendCount++;
        }
        return;
      case "requestFinished":
        draft.isSaving = false;
        return;
      case "titleRules":
        if (!action.value.trim()) {
          draft.title.hasError = true;
          draft.title.message = "You must provide a title";
        }
        return;
      case "bodyRules":
        if (!action.value.trim()) {
          draft.body.hasError = true;
          draft.body.message = "You must provide a body";
        }
        return;
      case "notFound":
        draft.notFound = true;
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function addPost() {
      try {
        const response = await Axios.get(`/post/${state.id}`, { cancelToken: ourRequest.token });
        if (response.data) {
          dispatch({ type: "FetchComplete", value: response.data });
          if (appState.user.username != response.data.author.username) {
            appDispatch({ type: "flashmsg", value: "You don't have a permission to edit that post." });
            props.history.push("/");
          }
        } else {
          dispatch({ type: "notFound" });
        }
      } catch (e) {
        console.log("errooo");
      }
    }
    addPost();
    return () => {
      ourRequest.cancel();
    };
  }, []);

  function saveUpdate(e) {
    e.preventDefault();
    dispatch({ type: "titleRules", value: state.title.value });
    dispatch({ type: "countIncreased" });
  }

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "requestStarted" });
      const ourRequest = Axios.CancelToken.source();
      async function addPost() {
        try {
          const response = await Axios.post(`/post/${state.id}/edit`, { title: state.title.value, body: state.body.value, token: appState.user.token }, { cancelToken: ourRequest.token });
          dispatch({ type: "requestFinished" });
          appDispatch({ type: "flashmsg", value: "Post Updated!!!" });
          console.log(response.data);
        } catch (e) {
          console.log("errooo");
        }
      }
      addPost();
      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.sendCount]);

  if (state.notFound) {
    return <NotFound />;
  }

  if (state.isFetching) return <LoadingDotsIcon />;

  return (
    <Page title="Edit Post">
      <Link className="small font-weight-bold" to={`/post/${state.id}`}>
        &laquo; Back to post permalink
      </Link>
      <form className="mt-3" onSubmit={saveUpdate}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onBlur={e => dispatch({ type: "titleRules", value: e.target.value })} onChange={e => dispatch({ type: "titleChanged", value: e.target.value })} value={state.title.value} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
          {state.title.hasError && <div className="alert alert-danger small liveValidateMessage">{state.title.message}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>

          <textarea onBlur={e => dispatch({ type: "bodyRules", value: e.target.value })} onChange={e => dispatch({ type: "bodyChanged", value: e.target.value })} name="body" id="post-body" className="body-content tall-textarea form-control" type="text" value={state.body.value} />
          {state.body.hasError && <div className="alert alert-danger small liveValidateMessage">{state.body.message}</div>}
        </div>

        <button disabled={state.isSaving} className="btn btn-primary">
          Save Updates
        </button>
      </form>
    </Page>
  );
}
export default withRouter(EditPost);
