var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
/**
 * @class TabBar
 */
let TabBar = class TabBar extends LitElement {
    constructor() {
        super(...arguments);
        this.selectedTab = "";
    }
    render() {
        return html `
            <div class="tab-container">
                <slot></slot>
            </div>
        `;
    }
    updated(changedProperties) {
        const slotTabs = this.shadowRoot?.querySelector("slot")?.assignedElements({ flatten: true });
        slotTabs?.forEach(tab => tab.selected = tab.id === this.selectedTab);
    }
    static { this.styles = [css `
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
    `]; }
};
__decorate([
    property({ type: String, attribute: "selected-tab", reflect: true })
], TabBar.prototype, "selectedTab", void 0);
TabBar = __decorate([
    customElement('hb-tab-bar')
], TabBar);
export { TabBar };
