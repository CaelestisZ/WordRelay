import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Game from "./component/Game";
import Leaderboard from "./component/Leaderboard";
import ParticlesContainer from "./component/ParticlesContainer";

ReactDOM.render(
    <React.StrictMode>
        <div
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
            }}
        >
            <ParticlesContainer />
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                }}
            >
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/" component={App} />
                        <Route path="/game" component={Game} />
                        <Route path="/leaderboard" component={Leaderboard} />
                    </Switch>
                </BrowserRouter>
            </div>
        </div>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
