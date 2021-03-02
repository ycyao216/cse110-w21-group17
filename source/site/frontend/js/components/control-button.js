// TODO Ready For Testing
function define_control_button(html) {
    class CControlButton extends HTMLElement {
        constructor() {
            super();
            var shadow = this.attachShadow({
                mode: 'open'
            });
            shadow.innerHTML = html;

            let document = this.shadowRoot;
            this.shadow = shadow;
            this.document = document;
            function _class(name) {
                return document.querySelectorAll("." + name);
            }

            // Use value in the custom tag to be the display text in the button
            document.getElementById('button').innerText = this.textContent
        }
        get_shadow() {
            return this.shadow;
        }
        get_document() {
            return this.document;
        }
    }
    customElements.define('c-control-button', CControlButton);
    return CControlButton;
}

// for testing
module.exports = {
    define_control_button,
};
