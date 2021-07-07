import React, { useEffect, useContext } from "react";
import { useParams, NavLink, Switch, Route } from "react-router-dom";
import Axios from "axios";
import Page from "./Page";
import stateContext from "../stateContext";
import ProfilePost from "./ProfilePost";
import { useImmer } from "use-immer";
import ProfileFollower from "./ProfileFollower";
import ProfileFollowing from "./ProffileFollowing";

function Profile() {
  const appState = useContext(stateContext);
  const { username } = useParams();
  const [state, setState] = useImmer({
    followActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,
    profileData: {
      profileUsername: "...",
      isFollowing: false,
      profileAvatar: `${appState.user.avatar}`,
      counts: { followerCount: "", followingCount: "", postCount: "" }
    }
  });
  useEffect(() => {
    async function postData() {
      try {
        const response = await Axios.post(`/profile/${username}`, { token: appState.user.token });
        console.log(response.data);
        setState(draft => {
          draft.profileData = response.data;
        });
      } catch (e) {
        console.log("errorrrr");
      }
    }
    postData();
  }, [username]);

  useEffect(() => {
    if (state.startFollowingRequestCount) {
      setState(draft => {
        draft.followActionLoading = true;
      });
      const ourRequest = Axios.CancelToken.source();

      async function postData() {
        try {
          const response = await Axios.post(`/addFollow/${state.profileData.profileUsername}`, { token: appState.user.token }, { cancelToken: ourRequest.token });
          console.log(response.data);
          setState(draft => {
            draft.profileData.isFollowing = true;
            draft.profileData.counts.followerCount++;
            draft.followActionLoading = false;
          });
        } catch (e) {
          console.log("errorrrr");
        }
      }
      postData();
      return () => ourRequest.cancel();
    }
  }, [state.startFollowingRequestCount]);

  function startFollowing() {
    setState(draft => {
      draft.startFollowingRequestCount++;
    });
  }

  useEffect(() => {
    if (state.stopFollowingRequestCount) {
      setState(draft => {
        draft.followActionLoading = true;
      });
      const ourRequest = Axios.CancelToken.source();

      async function postData() {
        try {
          const response = await Axios.post(`/removeFollow/${state.profileData.profileUsername}`, { token: appState.user.token }, { cancelToken: ourRequest.token });
          console.log(response.data);
          setState(draft => {
            draft.profileData.isFollowing = false;
            draft.profileData.counts.followerCount--;
            draft.followActionLoading = false;
          });
        } catch (e) {
          console.log("errorrrr");
        }
      }
      postData();
      return () => ourRequest.cancel();
    }
  }, [state.stopFollowingRequestCount]);

  function stopFollowing() {
    setState(draft => {
      draft.stopFollowingRequestCount++;
    });
  }
  return (
    <Page title="profile">
      <h2>
        <img className="avatar-small" src={state.profileData.profileAvatar} />
        {username}
        {appState.loggedIn && !state.profileData.isFollowing && appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != "..." && (
          <button onClick={startFollowing} disabled={state.followActionLoading} className="btn btn-primary btn-sm ml-2">
            Follow <i className="fas fa-user-plus"></i>
          </button>
        )}
        {appState.loggedIn && state.profileData.isFollowing && appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != "..." && (
          <button onClick={stopFollowing} disabled={state.followActionLoading} className="btn btn-danger btn-sm ml-2">
            Stop Following <i className="fas fa-user-times"></i>
          </button>
        )}
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <NavLink to={`/profile/${state.profileData.profileUsername}`} className="nav-item nav-link">
          Posts: {state.profileData.counts.postCount}
        </NavLink>
        <NavLink to={`/profile/${state.profileData.profileUsername}/followers`} className="nav-item nav-link">
          Followers: {state.profileData.counts.followerCount}
        </NavLink>
        <NavLink to={`/profile/${state.profileData.profileUsername}/following`} className="nav-item nav-link">
          Following: {state.profileData.counts.followingCount}
        </NavLink>
      </div>
      <Switch>
        <Route exact path="/profile/:username">
          <ProfilePost />
        </Route>
        <Route path="/profile/:username/followers">
          <ProfileFollower />
        </Route>
        <Route path="/profile/:username/following">
          <ProfileFollowing />
        </Route>
      </Switch>
    </Page>
  );
}
export default Profile;
