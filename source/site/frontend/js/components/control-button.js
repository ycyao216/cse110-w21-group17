/**
 * Enacts the control button element's constructor
 * @param {*} html - The html component of a control button
 * @function
 */
export function define_control_button(html) {
    /**
     * attaches the shadow dom to the control button's html and initializes it
     * @class
     */
    class CControlButton extends HTMLElement {
        constructor() {
            super();
            var shadow = this.attachShadow({
                mode: 'open'
            });
            shadow.innerHTML = html;

            // Use value in the custom tag to be the display text in the button
            this.shadowRoot.getElementById('button').innerText = this.textContent
        }
    }
    customElements.define('c-control-button', CControlButton);
    return CControlButton;
}