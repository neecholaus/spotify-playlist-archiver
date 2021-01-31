let redirectParams = new URLSearchParams(window.location.search);

if (redirectParams.has('error')) {
    document.write(buildHeader(redirectParams.get('error')));
} else {
    document.write(buildHeader('authenticated'));
    fetch("/store-user-token", {
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST",
        body:JSON.stringify({
            token:window.location.hash
        })
    });
}

function buildHeader(text) {
    return `<h1 style="text-align:center;font-weight:bolder;font-family:Ariel,sans-serif">${text}</h1>`;
};
