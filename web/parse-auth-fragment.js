fetch("/store-user-token", {
    headers: {
        "Content-Type": "application/json"
    },
    method: "POST",
    body:JSON.stringify({
        token:window.location.hash
    })
});
