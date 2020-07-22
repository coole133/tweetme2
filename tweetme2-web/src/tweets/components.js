import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from "react-redux"

import { apiTweetCreate, apiTweetList, apiTweetAction } from './lookup'

export function TweetsComponent(props) {
  const user = useSelector((state) => state.user.currentUser)
  const textAreaRef = useRef()
  const [newTweets, setNewTweets] = useState([])


  const handleBackendUpdate = (response, status) => {
    // backend api response
    let tempNewTweets = [...newTweets]
    if (status === 201) {
      tempNewTweets.unshift(response)
      setNewTweets(tempNewTweets)
    } else {
      console.log(response)
      alert("An error occured please try again")
    }
  }

  const handleSubmit = (event) => {
    // backend api reequest
    event.preventDefault()
    const newVal = textAreaRef.current.value
    apiTweetCreate(newVal, handleBackendUpdate)
    textAreaRef.current.value = ''
  }


  return <div>
    {user.canTweet === true && <div className='col-12 mb-3 m-6'>
      <form onSubmit={handleSubmit}>
        <div className='mt-5'>
          <textarea ref={textAreaRef} required={true} className='form-control' name='tweet'>

          </textarea>
        </div>
        <button type='submit' className='btn btn-primary my-3'>Tweet</button>
      </form>
    </div>
    }
    <TweetsList newTweets={newTweets} />
  </div>
}

export function TweetsList({ newTweets }) {
  const user = useSelector((state) => state.user.currentUser)
  const [tweetsInit, setTweetsInit] = useState([])
  const [tweets, setTweets] = useState([])
  const [tweetsDidSet, setTweetsDidSet] = useState(false)
  useEffect(() => {
    const final = [...newTweets].concat(tweetsInit)
    if (final.length !== tweets.length) {
      setTweets(final)
    }
  }, [newTweets, tweets, tweetsInit])

  useEffect(() => {
    if (tweetsDidSet === false) {
      const handleTweetListLookup = (response, status) => {
        if (status === 200) {
          setTweetsInit(response)
          setTweetsDidSet(true)
        } else {
          alert("There was an error")
        }
      }
      apiTweetList(user.user, handleTweetListLookup)
    }
  }, [tweetsInit, tweetsDidSet, setTweetsDidSet])

  const handleDidRetweet = (newTweet) => {
    const updatedTweetInit = [...tweetsInit]
    updatedTweetInit.unshift(newTweet)
    setTweetsInit(updatedTweetInit)
    const updateFinalTweets = [...tweets]
    updateFinalTweets.unshift(newTweet)
    setTweets(updateFinalTweets)
  }

  return tweets.map((item, index) => {
    return <Tweet
      tweet={item}
      didRetweet={handleDidRetweet}
      className='my-5 py-5 border bg-white text-dark'
      key={`${index}-{item.id}`} />
  })
}


export function ActionBtn({ tweet, action, didPerformAction }) {
  const likes = tweet.likes ? tweet.likes : 0
  const className = 'btn btn-primary btn-sm'
  const actionDisplay = action.display ? action.display : 'Action'

  const handleActionBackendEvent = (response, status) => {
    if ((status === 200 || status === 201) && didPerformAction) {
      console.log(response)
      didPerformAction(response, status)
    }
  }

  const handleClick = (event) => {
    event.preventDefault()
    apiTweetAction(tweet.id, action.type, handleActionBackendEvent)

  }
  const display = action.type === 'like' ? `${likes} ${actionDisplay}` : actionDisplay
  return <button className={className} onClick={handleClick}>{display}</button>
}

export function ParentTweet({ tweet }) {
  return (
    <div className='row'>
      <div className='col-11 mx-auto p-3 border rounded'>
        <p className='mb-0 text-muted small'>Retweet</p>
        <Tweet hideActions tweet={tweet.parent} />
      </div>
    </div>
  )
}

export function Tweet({ tweet, didRetweet, hideActions }) {
  const [actionTweet, setActionTweet] = useState(tweet ? tweet : null)
  const className = 'col-10 mx-auto col-md-6'
  
  const handlePerformAction = (newActionTweet, status) =>  {
    if (status === 200) {
      setActionTweet(newActionTweet)
    } else if (status === 201) {
      if (didRetweet) {
        didRetweet(newActionTweet)
      }
    }
  }

  return <div className={className}>
    <div>
      <p>{tweet.id} - {tweet.content}</p>
      {tweet.parent && <ParentTweet tweet={tweet} />}
    </div>
    {(actionTweet && hideActions !== true) && <div className='btn btn-group'>
      <ActionBtn tweet={actionTweet} didPerformAction={handlePerformAction} action={{ type: "like", display: "Likes" }} />
      <ActionBtn tweet={actionTweet} didPerformAction={handlePerformAction} action={{ type: "unlike", display: "Unlike" }} />
      <ActionBtn tweet={actionTweet} didPerformAction={handlePerformAction} action={{ type: "retweet", display: "Retweet" }} />
    </div>}
  </div>
}
