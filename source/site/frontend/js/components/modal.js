/**
 * Enacts the constructor for the modal element
 * @param {*} html - The html component of the modal
 * @function
 */
export function define_modal(html) {
    /**
     * Attaches the modal's html to the shadow dom and initializes it and its functions
     * @class
     */
    class CModal extends HTMLElement {
        constructor() {
            super();
            var shadow = this.attachShadow({
                mode: 'open'
            });
            shadow.innerHTML = html;

            // The modal elements
            this.modal = this.shadowRoot.getElementById("modal-popup");
            this.modal_text = this.shadowRoot.getElementById("modal-text");
            this.modal_close_btn = this.shadowRoot.getElementById("close");
            this.confirm_button = this.shadowRoot.getElementById("confirm-button");
            this.cancel_button = this.shadowRoot.getElementById("cancel-button");

            // The modal data
            this.func_close_btn = null;
            this.func_confirm_button = null;
            this.func_cancel_button = null;

            // Bind EventListeners
            this.modal_close_btn.addEventListener('click', this.onclick_modal_close_btn);
            this.confirm_button.addEventListener('click', this.onclick_confirm_button);
            this.cancel_button.addEventListener('click', this.onclick_cancel_button);
        }

        /**
         * What the modal does when close button is clicked
         * @function
         */
        onclick_modal_close_btn = () => {
            this.modal.style.display = "none";
            this.modal_close_btn.style.display = "none";
            this.confirm_button.style.display = "none";
            this.cancel_button.style.display = "none";
        }

        /**
         * What the modal does when confirm button is clicked
         * @function
         */
        onclick_confirm_button = () => {
            this.modal.style.display = "none";
            this.modal_close_btn.style.display = "none";
            this.confirm_button.style.display = "none";
            this.cancel_button.style.display = "none";

            this.func_confirm_button.call(this);
        }

        /**
         * What the modal does when the cancel button is clicked
         * @function
         */
        onclick_cancel_button = () => {
            this.modal.style.display = "none";
            this.modal_close_btn.style.display = "none";
            this.confirm_button.style.display = "none";
            this.cancel_button.style.display = "none";

            this.func_cancel_button.call(this);
        }

        /**
         * Enacts the modal to display pop up with passed text
         * @param {*} text_to_show - text to display in modal
         */
        display_alert = (text_to_show) => {
            this.modal.style.display = "block";
            this.modal_close_btn.style.display = "block";
            this.confirm_button.style.display = "none";
            this.cancel_button.style.display = "none";
            this.modal_text.innerText = text_to_show
        }

        /**
         * Enacts the modal to display confirm/cancel pop up with passed text
         * @param {*} text_to_show - text to display in modal
         * @param {*} func_yes - function called on confirm
         * @param {*} func_no - function called on cancel
         */
        display_confirm = (text_to_show, func_yes, func_no) => {
            this.modal.style.display = "block";
            this.modal_close_btn.style.display = "none";
            this.confirm_button.style.display = "block";
            this.cancel_button.style.display = "block";
            this.modal_text.innerText = text_to_show

            this.func_confirm_button = func_yes;
            this.func_cancel_button = func_no;
        }


    }
    customElements.define('c-modal', CModal);
    return CModal;
}