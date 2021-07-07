import React from "react";
import Page from "./Page";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <Page>
      <div className="text-center">
        <h2>Whoops we can not find the page!</h2>
        <p className="lead text-muted">
          You can always visit to the <Link to="./">homepage</Link> to get a fresh start.
        </p>
      </div>
    </Page>
  );
}
export default NotFound;
