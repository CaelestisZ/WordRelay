import React from "react";
import "./Popups.scss";
import axios from "axios";
import { Link } from "react-router-dom";

class Leaderboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: localStorage.getItem("WordRelayPlayer"),
            topTenScores: [],
            scores: [],
        };
    }

    async componentDidMount() {
        if (!localStorage.getItem("WordRelayPlayer")) {
            this.props.history.push("/");
        }
        await this.fetchLeaderboard();
        await this.fetchPlayerStatistics();
    }

    fetchLeaderboard = () => {
        axios
            .get(
                window.location.protocol +
                    "//" +
                    window.location.host +
                    "/api/v1/scores"
            )
            .then((res) => {
                this.setState({
                    topTenScores: res.data.data.scores,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    fetchPlayerStatistics = () => {
        axios
            .get(
                window.location.protocol +
                    "//" +
                    window.location.host +
                    "/api/v1/scores/" +
                    this.state.username
            )
            .then((res) => {
                console.log(res.data.data.newPlayer.scores);
                this.setState({
                    scores: res.data.data.newPlayer.scores,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    displayLeaderboard = () => {
        let count = 0;
        const items = this.state.topTenScores.map((item) => (
            <tr key={count}>
                <td>{++count}</td>
                <td>{item.username.toString()}</td>
                <td>{this.maxElement(item.scores)}</td>
                <td>{this.computeLevel(this.maxElement(item.scores))}</td>
            </tr>
        ));
        return items;
    };

    maxElement = (arr) => {
        let max = arr[0];
        for (var i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                max = arr[i];
            }
        }
        if (arr.length === 0) {
            return 0;
        }
        return max;
    };

    computeLevel = (score) => {
        return 1 + Math.floor(score / 500);
    };

    noOfGamesPlayed = (scores) => {
        return scores.length;
    };

    averageScore = (scores) => {
        var avg = 0;

        for (var i = 0; i < scores.length; i++) {
            avg += scores[i];
        }
        avg = avg / scores.length;
        if (scores.length === 0) {
            return 0;
        }
        return Math.round(avg);
    };

    render() {
        return (
            <div>
                <div className="columns">
                    <div className="column is-one-quarter">
                        <h1 className="title px-5 py-5 has-text-white pixelated">
                            Word Relay
                        </h1>
                    </div>
                </div>

                <div className="columns has-text-centered">
                    <div className="column is-one-third">
                        <div className="card ml-5">
                            <header className="card-header">
                                <p className="card-header-title pixelated">
                                    Leaderboard
                                </p>
                            </header>
                            <div className="card-content">
                                <div className="content">
                                    <table className="table is-narrow is-bordered is-fullwidth is-hoverable is-striped">
                                        <thead>
                                            <tr>
                                                <th>Rank</th>
                                                <th>Name</th>
                                                <th>Score</th>
                                                <th>Level</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.displayLeaderboard()}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="column has-text-centered">
                        <nav className="level">
                            <div className="level-item has-text-centered"></div>
                            <div className="level-item has-text-centered"></div>
                            <div className="level-item has-text-centered"></div>
                            <div className="level-item has-text-centered">
                                <div>
                                    <Link to="/game">
                                        <button className="button is-primary is-medium pixelated">
                                            <i className="fas fa-arrow-left"></i>
                                            &nbsp; Back
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </nav>

                        <div className="card mr-5">
                            <header className="card-header">
                                <p className="card-header-title pixelated">
                                    {this.state.username}'s Player Statistics
                                </p>
                            </header>
                            <div className="card-content">
                                <div className="content">
                                    <nav className="level">
                                        <div className="level-item has-text-centered">
                                            <div>
                                                <p className="heading pixelated">
                                                    Number of games played
                                                </p>
                                                <p className="title">
                                                    {this.noOfGamesPlayed(
                                                        this.state.scores
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="level-item has-text-centered">
                                            <div>
                                                <p className="heading pixelated">
                                                    Average score
                                                </p>
                                                <p className="title">
                                                    {this.averageScore(
                                                        this.state.scores
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="level-item has-text-centered">
                                            <div>
                                                <p className="heading pixelated">
                                                    High score
                                                </p>
                                                <p className="title">
                                                    {this.maxElement(
                                                        this.state.scores
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="level-item has-text-centered">
                                            <div>
                                                <p className="heading pixelated">
                                                    Maximum level reached
                                                </p>
                                                <p className="title">
                                                    {this.computeLevel(
                                                        this.maxElement(
                                                            this.state.scores
                                                        )
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Leaderboard;
