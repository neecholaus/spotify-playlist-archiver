/**
 * Utility for indicating that something is loading.
 * 3 dots appear, one at a time, then disappear.
 * That keeps repeating.
 */
class LoadingDots {
    element = undefined;
    constructor(selector) {
        this.element = document.querySelector(selector);
        this.loop();
    }

    async loop() {
        let dotCount = 0;
        while (true) {
            dotCount = this.element.textContent.length; // see current amount
            dotCount = dotCount >= 3 ? 0 : dotCount+1; // increment or reset
            await new Promise((res) => {
                setTimeout(res, 600);
            });
            let insert = '';
            for (let i = 0; i < dotCount; i++) {
                insert += '.';
            }
            this.element.textContent = insert;
        }
    }
}
