import React from "react";
import "./Popups.scss";
import "./Game.scss";
import { Link } from "react-router-dom";
import { WordList } from "./WordList";
import axios from "axios";
import aGameOver from "./../sounds/game-over.wav";
import aMultiplierUp from "./../sounds/multiplier-up.wav";
import aMultiplierDown from "./../sounds/multiplier-down.wav";
import aLevelUp from "./../sounds/next-level.wav";
import bgMusic from "./../sounds/bg-music.mp3";

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: localStorage.getItem("WordRelayPlayer"),
            stackOfWords: [],
            stackCount: 0,
            stackLimit: 100,
            stackLimitBonus: 10,
            score: 0,
            multiplier: 1,
            level: 1,
            rate: 1000,
            showStack: true,
            show3: false,
            show2: false,
            show1: false,
            showFinal: false,
            trendingBonus: 25,
            timeLeft: 10,
            opacity: 0,
            visibility: "hidden",
            trigger: [
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
            ],
        };
        this.timerID = null;
        this.timer = null;
        this.audioGameOver = new Audio(aGameOver);
        this.audioMultiplierUp = new Audio(aMultiplierUp);
        this.audioMultiplierDown = new Audio(aMultiplierDown);
        this.audioLevelUp = new Audio(aLevelUp);
        this.audioBG = new Audio(bgMusic);
    }

    componentDidMount() {
        if (!localStorage.getItem("WordRelayPlayer")) {
            this.props.history.push("/");
        }
        this.stackBuilder(this.state.rate);
        this.audioBG.loop = true;
        this.audioBG.play();
    }

    componentWillUnmount() {
        this.audioBG.pause();
        this.audioGameOver.pause();
        this.audioLevelUp.pause();
        this.audioMultiplierDown.pause();
        this.audioMultiplierUp.pause();
        this.audioBG.currentTime = 0;
        this.audioGameOver.currentTime = 0;
        this.audioLevelUp.currentTime = 0;
        this.audioMultiplierDown.currentTime = 0;
        this.audioMultiplierUp.currentTime = 0;
    }

    stackBuilder = (rate) => {
        this.setState({
            showStack: false,
        });

        setTimeout(() => {
            this.setState({
                show3: true,
                show2: false,
                show1: false,
                showFinal: false,
            });
        }, 1000);

        setTimeout(() => {
            this.setState({
                show3: false,
                show2: true,
                show1: false,
                showFinal: false,
            });
        }, 2000);

        setTimeout(() => {
            this.setState({
                show3: false,
                show2: false,
                show1: true,
                showFinal: false,
            });
        }, 3000);

        setTimeout(() => {
            this.setState({
                show3: false,
                show2: false,
                show1: false,
                showFinal: true,
            });
        }, 4000);

        setTimeout(() => {
            this.setState({
                show3: false,
                show2: false,
                show1: false,
                showFinal: false,
                stackCount: 0,
                stackOfWords: [],
                showStack: true,
            });
        }, 5000);

        this.timerID = setInterval(() => {
            var word = WordList[Math.floor(Math.random() * WordList.length)];
            this.startTimer();
            this.state.stackOfWords.push(word);
            var count = this.state.stackCount + 1;
            this.setState(() => ({
                stackCount: count,
            }));

            if (this.state.stackCount >= this.state.stackLimit) {
                this.audioGameOver.currentTime = 0;
                this.audioGameOver.play();
                this.gameOver();
                this.stopTimer();
            }
        }, rate);
    };

    startTimer = () => {
        this.timer = setInterval(() => {
            if (this.state.timeLeft > 1) {
                var newTimeLeft = this.state.timeLeft - 1;
                this.setState({
                    timeLeft: newTimeLeft,
                });
            }
        }, 1000);
    };

    pauseTimer = () => {
        clearInterval(this.timer);
    };

    onTextInputChange = (event) => {
        this.resetTriggers();
        if (this.state.stackOfWords[0] !== undefined) {
            if (
                this.state.stackOfWords[0].length <
                    event.target.value.trim().length ||
                event.key === "Backspace" ||
                event.key === "Delete" ||
                event.key === "ArrowLeft" ||
                event.key === "ArrowRight" ||
                event.key === "Control"
            ) {
                this.audioMultiplierDown.currentTime = 0;
                this.audioMultiplierDown.play();
                this.setState({
                    multiplier: 1,
                });
            }

            if (event.target.value.trim() === this.state.stackOfWords[0]) {
                if (
                    event.target.value.trim().includes("%") ||
                    event.target.value.trim().includes("#") ||
                    event.target.value.trim().includes("!") ||
                    event.target.value.trim().includes("@") ||
                    event.target.value.trim().includes("$") ||
                    event.target.value.trim().includes("&") ||
                    event.target.value.trim().includes("?")
                ) {
                    this.setState((state) => ({
                        score: state.score + state.trendingBonus,
                    }));
                }

                this.audioMultiplierUp.currentTime = 0;
                this.audioMultiplierUp.play();

                event.target.value = "";
                this.state.stackOfWords.shift();

                this.pauseTimer();
                var count = this.state.stackCount - 1;
                this.setState((state) => ({
                    stackCount: count,
                    score: state.score + state.multiplier * state.timeLeft,
                    timeLeft: this.state.stackLimitBonus,
                }));

                if (this.state.multiplier <= 8) {
                    var newMultiplier = 2 * this.state.multiplier;
                    this.setState({
                        multiplier: newMultiplier,
                    });
                }
            }
        }
        this.updateLevel();
    };

    updateLevel = () => {
        if (
            this.state.score > this.state.level * 500 &&
            this.state.stackLimit > 5
        ) {
            this.audioLevelUp.currentTime = 0;
            this.audioLevelUp.play();
            var newStackLimit = this.state.stackLimit - 5;
            var newStackLimitBonus = this.state.stackLimitBonus + 2;
            this.setState((state) => ({
                level: state.level + 1,
                multiplier: 1,
                stackLimit: newStackLimit,
                stackLimitBonus: newStackLimitBonus,
            }));
            clearInterval(this.timerID);
            this.stackBuilder(this.state.rate);
        }
    };

    onTextInputBlur = (event) => {
        event.target.focus();
        event.target.value = "";
    };

    gameOver = () => {
        this.setState({
            opacity: 1,
            visibility: "visible",
        });
    };

    restart = () => {
        this.stopTimer();
        this.stackBuilder(this.state.rate);
    };

    saveScore = async () => {
        const body = {
            username: this.state.username,
            score: this.state.score,
        };
        await axios
            .post(
                window.location.protocol +
                    "//" +
                    window.location.host +
                    "/api/v1/scores/updateUser",
                body
            )
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    saveAndRestart = () => {
        this.saveScore();
        this.restart();
    };

    closeGameOver = () => {
        this.setState({
            opacity: 0,
            visibility: "hidden",
            score: 0,
            multiplier: 1,
            level: 1,
        });
        this.stopTimer();

        this.stackBuilder(this.state.rate);
    };

    saveAndCloseGameOver = () => {
        this.saveScore();
        this.closeGameOver();
    };

    stopTimer = () => {
        this.setState({
            stackOfWords: [],
            stackCount: 0,
            stackLimit: 100,
            stackLimitBonus: 10,
            rate: 1000,
            timeLeft: 10,
        });
        clearInterval(this.timerID);
    };

    renderStackOfWords = () => {
        let count = 0;
        if (this.state.showStack) {
            const words = this.state.stackOfWords.map((word) => (
                <div className="word" key={++count}>
                    <span className="tag is-primary is-large is-rounded mb-1 mx-1">
                        {word}
                    </span>
                </div>
            ));
            return words;
        }
    };

    renderStackFill = () => {
        if (this.state.showStack) {
            return (
                <p className="mx-3 mt-3 pixelated">
                    {this.state.stackCount}/{this.state.stackLimit}
                </p>
            );
        }
    };

    renderTimer = () => {
        if (this.state.show3) {
            return <h2 className="subtitle pixelated">3</h2>;
        }
        if (this.state.show2) {
            return <h2 className="subtitle pixelated">2</h2>;
        }
        if (this.state.show1) {
            return <h2 className="subtitle pixelated">1</h2>;
        }
        if (this.state.showFinal) {
            return <h2 className="subtitle pixelated">Let's go!</h2>;
        }
    };

    updateKeyTrigger = (event) => {
        if (event.key === "q" || event.key === "Q") {
            this.setState({
                trigger: [
                    true,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                ],
            });
        } else if (event.key === "w" || event.key === "W") {
            this.setState({
                trigger: [
                    false,
                    true,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                ],
            });
        } else if (event.key === "e" || event.key === "E") {
            this.setState({
                trigger: [
                    false,
                    false,
                    true,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                ],
            });
        } else if (event.key === "r" || event.key === "R") {
            this.setState({
                trigger: [
                    false,
                    false,
                    false,
                    true,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                ],
            });
        } else if (event.key === "t" || event.key === "T") {
            this.setState({
                trigger: [
                    false,
                    false,
                    false,
                    false,
                    true,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                ],
            });
        } else if (event.key === "y" || event.key === "Y") {
            this.setState({
                trigger: [
                    false,
                    false,
                    false,
                    false,
                    false,
                    true,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                ],
            });
        } else if (event.key === "u" || event.key === "U") {
            this.setState({
                trigger: [
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    true,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                ],
            });
        } else if (event.key === "i" || event.key === "I") {
            this.setState({
                trigger: [
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    true,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                ],
            });
        } else if (event.key === "o" || event.key === "O") {
            this.setState({
                trigger: [
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    true,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                ],
            });
        } else if (event.key === "p" || event.key === "P") {
            this.setState({
                trigger: [
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    true,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                ],
            });
        } else if (event.key === "a" || event.key === "A") {
            this.setState({
                trigger: [
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    true,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                ],
            });
        } else if (event.key === "s" || event.key === "S") {
            this.setState({
                trigger: [
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    true,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                ],
            });
        } else if (event.key === "d" || event.key === "D") {
            this.setState({
                trigger: [
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    true,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                ],
            });
        } else if (event.key === "f" || event.key === "F") {
            this.setState({
                trigger: [
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    true,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                ],
            });
        } else if (event.key === "g" || event.key === "G") {
            this.setState({
                trigger: [
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    true,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                ],
            });
        } else if (event.key === "h" || event.key === "H") {
            this.setState({
                trigger: [
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    true,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                ],
            });
        } else if (event.key === "j" || event.key === "J") {
            this.setState({
                trigger: [
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    true,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                ],
            });
        } else if (event.key === "k" || event.key === "K") {
            this.setState({
                trigger: [
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    true,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                ],
            });
        } else if (event.key === "l" || event.key === "L") {
            this.setState({
                trigger: [
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    true,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                ],
            });
        } else if (event.key === "z" || event.key === "Z") {
            this.setState({
                trigger: [
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    true,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                ],
            });
        } else if (event.key === "x" || event.key === "X") {
            this.setState({
                trigger: [
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    true,
                    false,
                    false,
                    false,
                    false,
                    false,
                ],
            });
        } else if (event.key === "c" || event.key === "C") {
            this.setState({
                trigger: [
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    true,
                    false,
                    false,
                    false,
                    false,
                ],
            });
        } else if (event.key === "v" || event.key === "V") {
            this.setState({
                trigger: [
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    true,
                    false,
                    false,
                    false,
                ],
            });
        } else if (event.key === "b" || event.key === "B") {
            this.setState({
                trigger: [
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    true,
                    false,
                    false,
                ],
            });
        } else if (event.key === "n" || event.key === "N") {
            this.setState({
                trigger: [
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    true,
                    false,
                ],
            });
        } else if (event.key === "m" || event.key === "M") {
            this.setState({
                trigger: [
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    true,
                ],
            });
        }
        console.log(this.state.trigger);
    };

    renderKey = (element, key) => {
        if (this.state.trigger[key]) {
            return (
                <a className="button mx-3 my-2 is-large is-primary">
                    {element}
                </a>
            );
        } else {
            return (
                <a className="button mx-3 my-2 is-large is-light">{element}</a>
            );
        }
    };

    renderKeyboard = () => {
        return (
            <div class="keyboard disable-pointer pixelated">
                <div class="row">
                    {this.renderKey("Q", 0)}
                    {this.renderKey("W", 1)}
                    {this.renderKey("E", 2)}
                    {this.renderKey("R", 3)}
                    {this.renderKey("T", 4)}
                    {this.renderKey("Y", 5)}
                    {this.renderKey("U", 6)}
                    {this.renderKey("I", 7)}
                    {this.renderKey("O", 8)}
                    {this.renderKey("P", 9)}
                </div>

                <div class="row">
                    {this.renderKey("A", 10)}
                    {this.renderKey("S", 11)}
                    {this.renderKey("D", 12)}
                    {this.renderKey("F", 13)}
                    {this.renderKey("G", 14)}
                    {this.renderKey("H", 15)}
                    {this.renderKey("J", 16)}
                    {this.renderKey("K", 17)}
                    {this.renderKey("L", 18)}
                </div>

                <div class="row">
                    {this.renderKey("Z", 19)}
                    {this.renderKey("X", 20)}
                    {this.renderKey("C", 21)}
                    {this.renderKey("V", 22)}
                    {this.renderKey("B", 23)}
                    {this.renderKey("N", 24)}
                    {this.renderKey("M", 25)}
                </div>
            </div>
        );
    };

    resetTriggers = () => {
        this.setState({
            trigger: [
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
            ],
        });
    };

    render() {
        return (
            <div>
                <div
                    className="popup"
                    id="popup"
                    style={{
                        opacity: this.state.opacity,
                        visibility: this.state.visibility,
                    }}
                >
                    <div className="popup__notif py-6 px-6">
                        <h1 className="title pixelated">Game Over!</h1>
                        <h2 className="subtitle is-3 pixelated">
                            You scored {this.state.score} and{" "}
                            {this.state.level > 1
                                ? "reached"
                                : "didn't go past "}
                            level&nbsp;{this.state.level}.
                        </h2>
                        <h2 className="subtitle pixelated">
                            Do you want to save your score?
                        </h2>

                        <div className="buttons">
                            <button
                                className="button is-primary is-rounded is-medium pixelated"
                                onClick={this.saveAndCloseGameOver}
                            >
                                Yes please!
                            </button>
                            <button
                                className="button is-danger is-rounded is-medium pixelated"
                                onClick={this.closeGameOver}
                            >
                                Nah, Let me try again!
                            </button>
                        </div>
                    </div>
                </div>

                <div className="columns is-centered">
                    <div className="column is-one-quarter">
                        <h1 className="title px-5 py-5 has-text-white pixelated">
                            Word Relay
                        </h1>

                        <div className="card mx-5">
                            <header className="card-header ">
                                <p className="card-header-title title is-4 has-text-centered">
                                    Stack
                                </p>
                                {this.renderStackFill()}
                            </header>
                            <div className="card-content custom-card has-text-centered">
                                <div>{this.renderStackOfWords()}</div>

                                {this.renderTimer()}
                            </div>
                        </div>
                        <div className="has-text-centered">
                            <Link to="/leaderboard">
                                <button className="button mx-5 mt-5 is-large is-primary">
                                    <i className="fas fa-medal"></i> &nbsp;
                                    Leaderboard
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="column has-text-centered">
                        <nav className="level my-6 mx-6 pixelated">
                            <div className="level-item has-text-centered">
                                <div>
                                    <p className="heading has-text-white">
                                        Level
                                    </p>
                                    <p className="title has-text-white">
                                        {this.state.level}
                                    </p>
                                </div>
                            </div>
                            <div className="level-item has-text-centered">
                                <div>
                                    <p className="heading has-text-white">
                                        Score
                                    </p>
                                    <p className="title has-text-white">
                                        {this.state.score}
                                    </p>
                                </div>
                            </div>
                            <div className="level-item has-text-centered">
                                <div>
                                    <p className="heading has-text-white">
                                        Multiplier
                                    </p>
                                    <p className="title has-text-white">
                                        {this.state.multiplier}x
                                    </p>
                                </div>
                            </div>
                            <div className="level-item has-text-centered">
                                <div>
                                    <button
                                        className="button is-info pixelated"
                                        onClick={this.saveAndRestart}
                                    >
                                        Save & Restart
                                    </button>
                                </div>
                            </div>
                            <div className="level-item has-text-centered">
                                <div>
                                    <button
                                        className="button pixelated is-warning"
                                        onClick={this.restart}
                                    >
                                        Restart
                                    </button>
                                </div>
                            </div>
                            <div className="level-item has-text-centered">
                                <div>
                                    <Link to="/">
                                        <button className="button is-danger pixelated">
                                            Quit
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </nav>

                        <div className="input-container my-6 mx-6">
                            <input
                                className="input disappear is-large is-focused is-dark is-rounded pixelated"
                                type="text"
                                placeholder="Let's get going!"
                                autoFocus="autofocus"
                                onKeyPress={this.updateKeyTrigger}
                                onBlur={this.onTextInputBlur}
                                onKeyUp={this.onTextInputChange}
                            />
                        </div>

                        {this.renderKeyboard()}
                    </div>
                </div>
            </div>
        );
    }
}

export default Game;
