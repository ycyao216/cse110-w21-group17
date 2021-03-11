// TODO Ready For Testing
export function define_control_button(html) {
    class CControlButton extends HTMLElement {
        constructor() {
            super();
            var shadow = this.attachShadow({
                mode: 'open'
            });
            shadow.innerHTML = html;

            // Use value in the custom tag to be the display text in the button
            this.shadowRoot.getElementById('button').innerText = this.textContent

            //**  testing stuff, delete or comment if it breaks stuff
            let document = this.shadowRoot;
            this.shadow = shadow;
            this.document = document;
            //*/
        }
        //**  testing stuff, delete or comment if it breaks stuff
        get_shadow() {
            return this.shadow;
        }
        get_document() {
            return this.document;
        }
        //*/
    }
    
    customElements.define('c-control-button', CControlButton);
    return CControlButton;
}
//**  testing stuff, delete or comment if it breaks stuff
module.exports = {
    define_control_button,
};
//*/