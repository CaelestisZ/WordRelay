import React from "react";
import ReactDOM from "react-dom";
import "./App.scss";
import "./component/Popups.scss";
import MobileDevice from "./component/MobileDevice.jsx";
import axios from "axios";

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            instructionsOpacity: 0,
            instructionsVisibility: "hidden",
            loginOpacity: 0,
            loginVisibility: "hidden",
            isLoading: false,
            isError: false,
            isDisabled: true,
            username: "",
        };
    }

    componentDidMount() {
        if (
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            )
        ) {
            ReactDOM.render(
                <MobileDevice></MobileDevice>,
                document.getElementById("root")
            );
        }
    }

    loadingButtonRender = () => {
        if (this.state.isLoading) {
            return (
                <button className="button is-rounded is-primary is-loading is-medium pixelated">
                    Loading
                </button>
            );
        } else {
            return (
                <button
                    className="button is-rounded is-primary is-medium pixelated"
                    type="submit"
                    disabled={this.state.isDisabled}
                >
                    Play now!
                </button>
            );
        }
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const body = {
            username: this.state.username,
        };
        localStorage.setItem("WordRelayPlayer", this.state.username);
        this.setState({
            isLoading: true,
            isError: false,
        });
        await axios
            .post(
                window.location.protocol +
                    "//" +
                    window.location.host +
                    "/api/v1/scores",
                body
            )
            .then((res) => {
                console.log(res);
                this.props.history.push("/game");
            })
            .catch((err) => {
                this.setState({
                    isLoading: false,
                    isError: true,
                });
            });
    };

    handleUsernameChange = (e) => {
        this.setState({
            username: e.target.value,
        });
        if (e.target.value.length >= 5) {
            this.setState({
                isDisabled: false,
            });
        } else {
            this.setState({
                isDisabled: true,
            });
        }
    };

    loginErrorRender = () => {
        if (this.state.isError) {
            return (
                <span className="tag is-danger is-small is-light is-rounded mt-4">
                    Username is already taken!
                </span>
            );
        }
    };

    openInstructionsPopup = () => {
        this.setState({
            instructionsOpacity: 1,
            instructionsVisibility: "visible",
        });
    };

    closeInstructionsPopup = () => {
        this.setState({
            instructionsOpacity: 0,
            instructionsVisibility: "hidden",
        });
    };

    openLoginPopup = () => {
        this.setState({
            loginOpacity: 1,
            loginVisibility: "visible",
        });
    };

    closeLoginPopup = () => {
        this.setState({
            loginOpacity: 0,
            loginVisibility: "hidden",
        });
    };

    render() {
        return (
            <div className="App">
                <div
                    className="popup"
                    id="popup"
                    style={{
                        opacity: this.state.instructionsOpacity,
                        visibility: this.state.instructionsVisibility,
                    }}
                >
                    <div className="popup__notif py-6 px-6">
                        <h1 className="title pixelated">Instructions</h1>

                        <ul className="subtitle is-5 mt-2">
                            <li>
                                Word Relay is a game designed to improve QWERTY
                                typing rate and efficiency. Words appear one by
                                one in the stack as time progresses. There's a
                                limited 'Stack' that fills up after a certain
                                number of words have appeared. Once you type the
                                topmost word of the stack correctly, that word
                                is removed from the stack.
                            </li>
                            <li>
                                The score is calculated based on how fast you
                                are able to clear that word, and a multiplier.
                                The multiplier increases with every word the
                                player types correctly and resets on any
                                mistype. Every 500 points you score, you move on
                                to the next level which further decreases the
                                Stack limit by 5 and increments the level up
                                bonus!
                            </li>
                            <li>
                                If 'Stack' is full, it’s game over!
                                Additionally, The player can then submit their
                                score and compare with a leaderboard that
                                contains a list of top ten players.
                            </li>
                            <li>
                                Also, if you're lucky you might encounter
                                Trending Characters often! These include '%',
                                '@', '#', '$', '&', and '?'. They give you bonus
                                points irrespective of the level you're playing!
                            </li>
                        </ul>

                        <div className="buttons">
                            <button
                                className="button is-primary is-rounded is-medium pixelated"
                                onClick={this.closeInstructionsPopup}
                            >
                                Gotcha!
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className="popup pixelated"
                    id="popup"
                    style={{
                        opacity: this.state.loginOpacity,
                        visibility: this.state.loginVisibility,
                    }}
                >
                    <div className="popup__notif py-6 px-6">
                        <h1 className="title">Let's go!</h1>

                        <h5 className="subtitle is-5 mt-2">
                            Before we proceed, what do we call you?
                        </h5>

                        <h3 className="subtitle is-6">
                            Your username must be atleast 5 characters long.
                        </h3>

                        <form onSubmit={this.handleSubmit}>
                            <div className="field mb-6">
                                <div className="control">
                                    <input
                                        className="input is-large is-rounded is-primary pixelated"
                                        type="text"
                                        placeholder="Enter your username here"
                                        name="username"
                                        value={this.state.username}
                                        onChange={this.handleUsernameChange}
                                    />
                                </div>
                                {this.loginErrorRender()}
                            </div>

                            <div className="buttons">
                                {this.loadingButtonRender()}
                                <button
                                    className="button is-rounded is-danger is-medium pixelated"
                                    type="button"
                                    onClick={this.closeLoginPopup}
                                >
                                    Take me back!
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="welcome-container center-absolute">
                    <h1 className="title is-1 mb-6 has-text-white pixelated">
                        Welcome to Word Relay!
                    </h1>

                    <button
                        className="button is-primary is-large is-rounded mr-6 mt-6 pixelated"
                        onClick={this.openLoginPopup}
                    >
                        Play now!
                    </button>
                    <button
                        className="button is-primary is-light is-large is-rounded mt-6 mb-6 pixelated"
                        onClick={this.openInstructionsPopup}
                    >
                        Instructions
                    </button>

                    <div className="subtitle is-6 mt-6 has-text-white pixelated">
                        Built with{" "}
                        <i className="fas fa-heart has-text-primary"></i> by{" "}
                        <a
                            className="is-link has-text-primary"
                            href="https://caelestisz.now.sh/"
                        >
                            Niranjan
                        </a>
                        .
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
