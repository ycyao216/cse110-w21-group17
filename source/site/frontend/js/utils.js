// Ref: https://developer.mozilla.org/zh-TW/docs/Web/API/Fetch_API/Using_Fetch

/**
 * post the data to local storage/cloud-sync json
 * @param {*} url - url to post to
 * @param {*} data - data to post
 * @function
 * @returns fetch Response object
 */
export function postData(url, data) {
    return fetch(url, {
        body: JSON.stringify(data),
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'user-agent': 'Mozilla/4.0 MDN Example',
            'content-type': 'application/json'
        },
        method: 'POST',
        mode: 'cors',
        redirect: 'follow',
        referrer: 'no-referrer',
    })
        .then(response => response.json())
}

/**
 * Generate random id
 * @param {*} length - length of id
 */
export function create_uid(length) {
    return Math.trunc(Math.random() * Math.pow(10, length));
}