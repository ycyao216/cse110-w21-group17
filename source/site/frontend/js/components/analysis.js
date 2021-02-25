function define_analysis(html) {
    class CAnalysis extends HTMLElement {
        constructor() {
            super();
            var shadow = this.attachShadow({
                mode: 'open'
            });
            shadow.innerHTML = html;

            let document = this.shadowRoot;

            function _class(name) {
                return document.querySelectorAll("." + name);
            }

            // Put you initialization code here
            // some code
        }
    }
    customElements.define('c-analysis', CAnalysis);
}