import React, { useEffect, useState, useRef } from 'react'
import { loadTweets } from '../lookup'


export const TweetsComponent = () => {
    const textAreaRef = useRef()
    const [newTweets, setNewTweets] = useState([])
    const handleSubmit = (e) => {
        e.preventDefault()
        const newVal = textAreaRef.current.value
        let tempNewTweets = [...newTweets]
        // change this to server side call
        tempNewTweets.unshift({
            content: newVal,
            likes: 0,
            id: Math.floor(Math.random() * Math.floor(200))
        })
        setNewTweets(tempNewTweets)
        textAreaRef.current.value = ''
    }
    return (
        <div>
            <div className='col-12 mb-3 mt-5'>
                <form onSubmit={handleSubmit}>
                    <textarea ref={textAreaRef} required={true} className='form-control' name='tweet'>
                    </textarea>
                    <button type='submit' className='btn btn-primary my-3'>Tweet</button>
                </form>
            </div>
            <TweetsList newTweets={newTweets} />
        </div>
    )
}

export const TweetsList = ({ newTweets }) => {
    const [tweetsInit, setTweetsInit] = useState([])
    const [tweets, setTweets] = useState([])

    useEffect(() => {
        const final = [...newTweets.concat(tweetsInit)]
        if (final.length !== tweets.length) {
            setTweets(final)
        }
    }, [newTweets, tweets, tweetsInit])

    useEffect(() => {
        const cb = (response, status) => {
            if (status === 200) {
                setTweetsInit(response)
            }
        }
        loadTweets(cb)
    }, [])

    return (
        <div className="App">
            {tweets.map((item) => {
                return <Tweet key={item.id} tweet={item} />
            })}
        </div>
    )
}


export const ActionBtn = ({ tweet, action }) => {
    const [likes, setLikes] = useState(tweet.likes ? tweet.likes : 0)
    const [userLike, setUserLike] = useState(false)
    const actionDisplay = action.display ? action.display : 'Action'
    const handleClick = (e) => {
        e.preventDefault()
        if (action.type === 'like') {
            if (userLike) {
                setUserLike(false)
                setLikes(likes - 1)
            }
            else {
                setUserLike(true)
                setLikes(likes + 1)
            }
        }
    }
    const display = action.type === 'like' ? `${likes} ${actionDisplay}` : actionDisplay
    return <button className='btn btn-primary btn-small' onClick={handleClick} >{display}</button>
}

export const Tweet = ({ tweet }) => {
    return (
        <div className='col-10 mx auto col-md'>
            <p>{tweet.id} - {tweet.content}</p>
            <div className='btn btn-group'>
                <ActionBtn tweet={tweet} action={{ type: "like", display: "Like" }} />
                <ActionBtn tweet={tweet} action={{ type: "unlike", display: "Unlike" }} />
                <ActionBtn tweet={tweet} action={{ type: "retweet", display: "Retweet" }} />

            </div>
        </div>
    )
}
