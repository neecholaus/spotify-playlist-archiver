/**
 * Utility for indicating that something is loading.
 * 3 dots appear, one at a time, then disappear.
 * That keeps repeating.
 */
class LoadingDots {
    element = undefined;
    constructor(selector, speed=600) {
        if (typeof(selector) !== 'string') {
            this.element = selector;
            this.loop(speed);
            return;
        }

        this.element = document.querySelector(selector);
        this.loop(speed);
    }

    async loop(speed) {
        let dotCount = 0;
        while (true) {
            dotCount = this.element.textContent.length; // see current amount
            dotCount = dotCount >= 3 ? 0 : dotCount+1; // increment or reset
            await new Promise((res) => {
                setTimeout(res, speed);
            });
            let insert = '';
            for (let i = 0; i < dotCount; i++) {
                insert += '.';
            }
            this.element.textContent = insert;
        }
    }
}
