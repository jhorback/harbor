import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "../styles";



/**
 * @class ListItem
 * @fires hb-list-item-click
 */
@customElement('hb-list-item')
export class ListItem extends LitElement {

    @property({type: String})
    icon = "";

    @property({type: String})
    text = "";

    @property({type: String})
    description = "";

    @property({type: Boolean, reflect: true})
    selected = false;


    render() {
        return html`
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
                        ${this.selected ? html`radio_button_checked` : html`radio_button_unchecked`}
                    </div>
                </div>
            </div>
        `;
    }

    handleClick(event:Event) {
        this.dispatchEvent(new Event("hb-list-item-click", {bubbles: true, composed: false}));
    }

    static styles = [styles.icons, styles.types, css`
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
    `]
}

declare global {
    interface HTMLElementTagNameMap {
        'hb-list-item': ListItem
    }
}
