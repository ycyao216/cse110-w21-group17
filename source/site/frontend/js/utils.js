// Ref: https://developer.mozilla.org/zh-TW/docs/Web/API/Fetch_API/Using_Fetch

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

export function create_uid(length) {
    return Math.trunc(Math.random() * Math.pow(10, length));
}