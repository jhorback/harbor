var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "../styles";
export class SwitchChangeEvent extends Event {
    static { this.eventType = "hb-switch-change"; }
    get selected() { return this.targetEl.checked; }
    ;
    constructor(target) {
        super(SwitchChangeEvent.eventType, { bubbles: true, composed: true });
        this.targetEl = target;
    }
}
/**
 * @class Switch
 * @fires hb-switch
 */
let Switch = class Switch extends LitElement {
    constructor() {
        super(...arguments);
        this.selected = false;
        this.disabled = false;
    }
    render() {
        return html `
            <label class="switch">
                <input type="checkbox"
                    ?disabled=${this.disabled}
                    ?checked=${this.selected}
                    @click=${this.checkboxClicked}>
                <span class="track"></span>
            </label>
        `;
    }
    checkboxClicked(event) {
        const cb = event.target;
        this.selected = cb.checked;
        this.dispatchEvent(new SwitchChangeEvent(cb));
    }
    static { this.styles = [styles.icons, styles.types, css `
        :host {
            display: inline-block;
        }
        .switch {
            position: relative;
            display: inline-block;
            width: 53px;
            height: 32px;
        }
          
        .switch input { 
            opacity: 0;
            width: 0;
            height: 0;
        }
          
        .track {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: var(--md-sys-color-surface-variant);
            transition: 0.1s;
            border-radius: 32px;
            border: 2px solid  var(--md-sys-color-outline);
        }
        /* track selected */
        input:checked + .track {
            background-color: var(--md-sys-color-primary);
            border-color:  var(--md-sys-color-primary);
        }        
        /* track focused */
        input:focus + .track {
            border-color:  var(--md-sys-color-primary);
        }
        /* track disabled */
        input:disabled + .track {
            opacity: 0.12;
            background-color: var(--md-sys-color-surface-variant);
            border-color:  var(--md-sys-on-surface);
        }
        /* track selected disabled */
        input:checked:disabled + .track {
            background-color: var(--md-sys-color-on-surface);
        }
          

        /* thumb */
        .track:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 4px;
            top: 5px;
            background-color: var(--md-sys-color-outline);
            transition: 0.1s;
            border-radius: 50%;
        }
        /* thumb selected */
        input:checked + .track:before {
            background-color: var(--md-sys-color-on-primary);
            transform: translateX(20px);
            height: 24px;
            width: 24px;
            top: 2px;
        }
        input:active + .track:before {
            width: 28px;
            height: 28px;
            top: 0;
            left: 0;
        }
        /* thumb disabled */
        input:disabled + .track:before {
           opacity: 0.38;
           background-color: var(--md-sys-color-on-surface);
        }
        /* thumb selected disabled */
        input:checked:disabled + .track:before {
            opacity: 1;
            background-color: var(--md-sys-color-surface);
        }
        
    `]; }
};
__decorate([
    property({ type: Boolean, reflect: true })
], Switch.prototype, "selected", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], Switch.prototype, "disabled", void 0);
Switch = __decorate([
    customElement('hb-switch')
], Switch);
export { Switch };
