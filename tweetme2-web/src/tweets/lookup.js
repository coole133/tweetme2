import { backendlookup } from '../lookup'

export function apiTweetCreate(newTweet, callback) {
    backendlookup("POST", "/tweets/create/", callback, { content: newTweet })
}

export function apiTweetAction(tweetId, action, callback) {
    backendlookup("POST", "/tweets/action/", callback, {id: tweetId, action: action})
}

export function apiTweetDetail(tweetId, callback) {
    backendlookup("GET", `/tweets/${tweetId}/`, callback)
}

export function apiTweetList(username, callback) {
    let endpoint = "/tweets/"
    if (username) {
        endpoint = `/tweets/?username=${username}`
    }
    backendlookup("GET", endpoint, callback)
}
