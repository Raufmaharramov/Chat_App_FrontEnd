import React, { useEffect, useContext } from "react";
import Page from "./Page";
import stateContext from "../stateContext";
import { useImmer } from "use-immer";
import { Link } from "react-router-dom";
import Axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";
import Posts from "./Posts";

function Home() {
  const appState = useContext(stateContext);
  const [state, setState] = useImmer({
    isLoading: true,
    feed: []
  });

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await Axios.post("/getHomeFeed", { token: appState.user.token });
        setState(draft => {
          draft.feed = response.data;
          draft.isLoading = false;
        });
      } catch (e) {
        console.log("There was a problem.");
      }
    }
    fetchPosts();
  }, []);

  if (state.isLoading) return <LoadingDotsIcon />;

  return (
    <Page title="Home">
      <h2 className="text-center mt-4">These are the latest posts of those you follow.</h2>
      <div className="list-group">
        {state.feed.length > 0 && (
          <>
            {state.feed.map(post => {
              return <Posts post={post} key={post._id} />;
            })}
          </>
        )}
      </div>
      {state.feed.length === 0 && (
        <>
          <h2 className="text-center">
            Hello <strong>{appState.user.username}</strong>, your feed is empty.
          </h2>
          <p className="lead text-muted text-center">Your feed displays the latest posts from the people you follow. If you don&rsquo;t have any friends to follow that&rsquo;s okay; you can use the &ldquo;Search&rdquo; feature in the top menu bar to find content written by people with similar interests and then follow them.</p>
        </>
      )}
    </Page>
  );
}
export default Home;
