class NavManager {
    elements = {
        navBtns: document.querySelectorAll('.nav-btn'),
    }

    constructor(props) {
        this.hideNonApplicableLinks();
    }

    hideNonApplicableLinks() {
        const session = (() => {
            const all = document.cookie.split('; ');
            for (let cookie of all) {
                let key = cookie.split('=')[0];
                if (key === 'session') {
                    return cookie.split('=')[1];
                }
            }
        })();

        this.elements.navBtns.forEach(el => {
            const isForAuth = el.getAttribute('data-only-auth') === 'true';
            const isForNonAuth = el.getAttribute('data-only-non-auth') === 'true';

            if (isForAuth) {
                el.style.display = session ? 'inline-block' : 'none';
                return;
            }

            if (isForNonAuth) {
                el.style.display = session ? 'none' : 'inline-block';
            }
        });
    }
}

new NavManager();