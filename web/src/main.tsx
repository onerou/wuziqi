import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  HashRouter,
  Switch,
  Route,
} from "react-router-dom";
import App from/* webpackPrefetch: true */ "@PAGE/App"
import Home from/* webpackPrefetch: true */ "@PAGE/Home"
const Main = function () {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/" component={App}>
        </Route>
        <Route exact path="/home" name="home" component={Home}>
        </Route>
      </Switch>
    </HashRouter>
  )
}


ReactDOM.render(
  <Main />,
  document.getElementById("app")
);
