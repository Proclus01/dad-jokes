import React, { Component } from 'react';
import axios from 'axios';

class JokeList extends Component {
    static defaultProps = {
        numJokesToGet: 10
    }

    constructor(props) {
        super(props);
        this.state = {
            jokes: []
        }
    }

    async componentDidMount() {

        let jokes = [];

        while (jokes.length < this.props.numJokesToGet) {
            // Load Jokes
            let res = await axios.get("https://icanhazdadjoke.com/", {
                headers: { Accept: "application/json" }
            });

            jokes.push(res.data.joke);
        }

        this.setState({ jokes: jokes });
    }

    render() {
        const jokeList = this.state.jokes.map(
            j => (
                <div>{j}</div>
            )
        );
        
        return(
            <div className="JokeList">
                <h1>Dad Jokes</h1>
                <div className="JokeList-jokes">
                    {jokeList}
                </div>
            </div>
        )
    }
}

export default JokeList;