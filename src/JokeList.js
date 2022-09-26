import React, { Component } from 'react';
import Joke from './Joke.js';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import './JokeList.css';

class JokeList extends Component {
    static defaultProps = {
        numJokesToGet: 10
    }

    constructor(props) {
        super(props);
        this.state = {
            jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]"),
            loading: false
        }
        // This set contains joke text and is used to prevent duplication in render
        this.seenJokes = new Set(this.state.jokes.map(j => j.text));
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        if (this.state.jokes.length === 0) {
            this.getJokes();
        }
    }

    async getJokes() {
        try {
            let jokes = [];

            while (jokes.length < this.props.numJokesToGet) {
                // Load Jokes
                let res = await axios.get("https://icanhazdadjoke.com/", {
                    headers: { Accept: "application/json" }
                });

                // Don't push duplicate jokes into the array
                let newJoke = res.data.joke;
                if (!this.seenJokes.has(newJoke)) {
                    jokes.push({id: uuidv4(), text: res.data.joke, votes: 0 });
                } else {
                    console.log("Found a duplicate!");
                    console.log(newJoke);
                }
                
            }

            this.setState(
                st => ({
                    loading: false,
                    jokes: [...st.jokes, ...jokes]
                }),
                // Wait until state is updated and save the entire state to local storage
                () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
            );

            // Store jokes in our local storage
            window.localStorage.setItem(
                "jokes",
                JSON.stringify(jokes)
            );
            } catch(e) {
                alert(e);
                this.setState({loading: false});
        }
    }

    handleVote(id, delta) {
        this.setState(
            st => ({                
                // Check each joke if the id is the one we're looking for, 
                // if it is, make a new object with joke info and update votes
                // else just add the existing joke into the array
                jokes: st.jokes.map(j => 
                    j.id === id ? {...j, votes: j.votes + delta} : j
                )
            }),
            () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
        )
    }

    handleClick() {
        this.setState({loading: true}, this.getJokes);
    }

    render() {

        if (this.state.loading) {
            return (
                <div className="JokeList-spinner">
                    <i className="far fa-8x fa-laugh fa-spin" />
                    <h1 className="JokeList-title">Loading...</h1>
                </div>
            )
        }

        const jokeList = this.state.jokes.map(
            j => (
                <Joke 
                    key={j.id} 
                    votes={j.votes} 
                    text={j.text}
                    upvote={
                        () => this.handleVote(j.id, 1)
                    }
                    downvote={
                        () => this.handleVote(j.id, -1)
                    }
                />
            )
        );
        
        return(
            <div className="JokeList">
                <div className="JokeList-sidebar">
                    <h1 className="JokeList-title">
                        <span>Dad</span> Jokes
                    </h1>
                    <img 
                        src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg'
                        alt="emoji"
                    />
                    <button className="JokeList-getmore" onClick={this.handleClick}>New Jokes</button>
                </div>
                
                <div className="JokeList-jokes">
                    {jokeList}
                </div>
            </div>
        )
    }
}

export default JokeList;