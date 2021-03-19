import React from "react";
import ReactDOM from "react-dom";
import {
  HashRouter,
  Switch,
  Route,
} from "react-router-dom";
import "./main.css"
import { Provider } from "react-redux"
import store from "@STORE/index"
import App from/* webpackPrefetch: true */ "@PAGE/App"
import Home from/* webpackPrefetch: true */ "@PAGE/Home"
const Main = function () {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/" component={App}>
        </Route>
        <Route path="/home" name="home" component={Home}>
        </Route>
      </Switch>
    </HashRouter>
  )
}


ReactDOM.render(
  <Provider store={store}><Main /></Provider>,
  document.getElementById("app")
);
