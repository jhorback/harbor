import { html, css, LitElement } from "lit";
import { live } from "lit-html/directives/live.js";
import { customElement, property, query, state } from "lit/decorators.js";
import { styles } from "../styles";


export class ContentEditableChangeEvent extends Event {
    static eventType = "change";
    value;
    constructor(value:string) {
        super(ContentEditableChangeEvent.eventType, { bubbles:true, composed: true});
        this.value = value;
    }
}

/**
 * @class Switch
 * @fires hb-switch
 */
@customElement('hb-content-editable')
export class ContentEditable extends LitElement {

    @property({type: String})
    value = "";

    @property({type: String})
    placeholder = "";

    @query("div")
    $div!:HTMLDivElement;

    render() {
        return html`
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

    onKeydown(event:KeyboardEvent) {
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

    onBlur(event:InputEvent) {
        this.dispatchChange(event);
        if (this.getInnerText() === "") {
            this.$div.innerText = this.placeholder;
        }
    }

    getInnerText():string {
        return this.$div ? this.$div.innerText.trim() : this.value;
    }

    private dispatchChange(event:InputEvent|KeyboardEvent) {
        const value = this.getInnerText();
        this.value = this.value === this.placeholder ? "" : value;
        this.$div.innerText = this.value;
        this.dispatchEvent(new ContentEditableChangeEvent(value));
    }
   
    static styles = [css`
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
    `]
}

declare global {
    interface HTMLElementTagNameMap {
        'hb-content-editable': ContentEditable
    }
}
