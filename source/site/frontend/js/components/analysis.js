export function define_analysis(html) {
    class CAnalysis extends HTMLElement {
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

            // Put you initialization code here
            // some code
        }
        
        get_shadow() {
            return this.shadow;
        }
        
        get_document() {
            return this.document;
        }
    }
    customElements.define('c-analysis', CAnalysis);
    return CAnalysis;
}
