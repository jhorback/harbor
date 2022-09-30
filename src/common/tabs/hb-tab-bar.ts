import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LinkTab } from "./hb-link-tab";

/**
 * @class TabBar
 */
@customElement('hb-tab-bar')
export class TabBar extends LitElement {

    @property({type: String, attribute: "selected-tab", reflect: true}) selectedTab = "";

    render() {
        return html`
            <div class="tab-container">
                <slot></slot>
            </div>
        `;
    }

    updated(changedProperties:Map<string, object>) {
        const slotTabs = this.shadowRoot?.querySelector("slot")?.assignedElements({flatten: true});
        slotTabs?.forEach(tab => (tab as LinkTab).selected = tab.id === this.selectedTab);
    }

    static styles = [css`
        :host {
            display: block;
        }
        .tab-container {
            border-bottom: 1px solid var(--md-sys-color-outline);
            display: flex;
            gap: 40px;
            justify-content: left; /* could expose this as stylable for "center" */
            padding: 1rem 0;
        }
    `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-tab-bar': TabBar
  }
}
