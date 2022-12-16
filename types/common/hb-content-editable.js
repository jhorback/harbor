var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, LitElement } from "lit";
import { live } from "lit-html/directives/live.js";
import { customElement, property, query } from "lit/decorators.js";
export class ContentEditableChangeEvent extends Event {
    static { this.eventType = "change"; }
    constructor(value) {
        super(ContentEditableChangeEvent.eventType, { bubbles: true, composed: true });
        this.value = value;
    }
}
/**
 * @class Switch
 * @fires hb-switch
 */
let ContentEditable = class ContentEditable extends LitElement {
    constructor() {
        super(...arguments);
        this.value = "";
        this.placeholder = "";
    }
    render() {
        return html `
            <div contenteditable="true"
                .innerText=${live(this.value || this.placeholder)}
                class=${this.getPlaceholderClass()}
                @focus=${this.onFocus}
                @keydown=${this.onKeydown}
                @keyup=${this.onKeyup}
                @blur=${this.onBlur}
           ></div>
        `;
    }
    onKeydown(event) {
        this.clearPlaceholder();
        if (event.key === "Enter") {
            event.preventDefault();
            this.$div.blur();
            this.dispatchChange(event);
        }
    }
    onKeyup() {
        this.setPlaceholderClassOnDiv();
    }
    getPlaceholderClass() {
        return this.getInnerText() === "" ? "placeholder" : "";
    }
    setPlaceholderClassOnDiv() {
        this.$div.className = this.getPlaceholderClass();
    }
    clearPlaceholder() {
        if (this.getInnerText() === this.placeholder) {
            this.$div.innerText = "";
        }
    }
    onFocus() {
        this.clearPlaceholder();
        var range = document.createRange();
        range.selectNodeContents(this.$div);
        var sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
    }
    onBlur(event) {
        this.dispatchChange(event);
        if (this.getInnerText() === "") {
            this.$div.innerText = this.placeholder;
        }
    }
    getInnerText() {
        return this.$div ? this.$div.innerText.trim() : this.value;
    }
    dispatchChange(event) {
        const value = this.getInnerText();
        this.value = this.value === this.placeholder ? "" : value;
        this.$div.innerText = this.value;
        this.dispatchEvent(new ContentEditableChangeEvent(value));
    }
    static { this.styles = [css `
        :host {
            display: block;
        }

        [contenteditable] {
            padding-bottom: 16px;
        }

        [contenteditable]:hover, [contenteditable]:focus {
            border: 0;
            border-radius: var(--md-sys-shape-corner-medium);
            outline: 1px solid var(--md-sys-color-outline);
            position: relative;
            top: -8px;
            left: -8px;
            right: -8px;
            bottom: -8px;
            padding: 8px;
        }

        .placeholder {
            opacity: 0.38;
        }  
    `]; }
};
__decorate([
    property({ type: String })
], ContentEditable.prototype, "value", void 0);
__decorate([
    property({ type: String })
], ContentEditable.prototype, "placeholder", void 0);
__decorate([
    query("div")
], ContentEditable.prototype, "$div", void 0);
ContentEditable = __decorate([
    customElement('hb-content-editable')
], ContentEditable);
export { ContentEditable };
