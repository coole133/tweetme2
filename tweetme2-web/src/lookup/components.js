export const loadTweets = (cb) => {
    const xhr = new XMLHttpRequest()
    const method = 'GET'
    const url = "http://localhost:8000/api/tweets/"
    const responseType = "json"

    xhr.responseType = responseType
    xhr.open(method, url)
    xhr.onload = function () {
        cb(xhr.response, xhr.status)
    }
    xhr.onerror = function (e) {
        console.error(e)
        cb({ "message": "Error" }, 400)
    }
    xhr.send()
}
