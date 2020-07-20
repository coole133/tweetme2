import { backendlookup } from '../lookup'

export function apiTweetCreate(newTweet, callback) {
    backendlookup("POST", "/tweets/create/", callback, { content: newTweet })
}

export function apiTweetAction(tweetId, action, callback) {
    backendlookup("POST", "/tweets/action/", callback, {id: tweetId, action: action})
}

export function apiTweetList(callback) {
    backendlookup("GET", "/tweets/", callback)
}
