var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "../styles";
/**
 * @class ListItem
 * @fires hb-list-item-click
 */
let ListItem = class ListItem extends LitElement {
    constructor() {
        super(...arguments);
        this.icon = "";
        this.text = "";
        this.description = "";
        this.selected = false;
    }
    render() {
        return html `
            <div class="list-item" ?selected=${this.selected} @click=${this.handleClick}>
                <div>
                    <div class="icon icon-small">${this.icon}</div>
                </div>
                <div class="text">
                    <div class="body-large readable">${this.text}</div>
                    <div class="label-small readable">${this.description}</div>
                </div>
                <div class="select-icon">
                    <div class="icon icon-small">
                        ${this.selected ? html `radio_button_checked` : html `radio_button_unchecked`}
                    </div>
                </div>
            </div>
        `;
    }
    handleClick(event) {
        this.dispatchEvent(new Event("hb-list-item-click", { bubbles: true, composed: false }));
    }
};
ListItem.styles = [styles.icons, styles.types, css `
        :host {
            display: block;
        }
        .list-item {
            display: flex;
            user-select: none;
            border: 1px solid transparent;
            border-radius:  var(--md-sys-shape-corner-small);
            padding: 5px 0 5px 0;
            align-items: center;
            cursor: default;
            gap: 5px;

        }
        .list-item:hover {
            border: 1px solid;
        }
        .list-item[selected] {
            border: 1px solid var(--md-sys-color-on-background);
            background-color: var(--md-sys-color-background);
        }
        .select-icon {
            align-self: flex-start;
        }
        .text {
            flex-grow: 1;
        }
        .readable {
            max-width: 35ch;
        }
        .icon-small {
            padding-right: 5px;
        }
        .select-icon .icon-small {
            padding: 0px 4px;
        }
    `];
__decorate([
    property({ type: String })
], ListItem.prototype, "icon", void 0);
__decorate([
    property({ type: String })
], ListItem.prototype, "text", void 0);
__decorate([
    property({ type: String })
], ListItem.prototype, "description", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], ListItem.prototype, "selected", void 0);
ListItem = __decorate([
    customElement('hb-list-item')
], ListItem);
export { ListItem };
