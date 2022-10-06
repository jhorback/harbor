import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "../styles";


export class SwitchChangeEvent extends Event {
    static eventType = "hb-switch-change";
    get selected() { return this.targetEl.checked };
    private targetEl:HTMLInputElement;
    constructor(target:HTMLInputElement) {
        super(SwitchChangeEvent.eventType, { bubbles:true, composed: true});
        this.targetEl = target;
    }
}

/**
 * @class Switch
 * @fires hb-switch
 */
@customElement('hb-switch')
export class Switch extends LitElement {

    @property({type: Boolean, reflect:true})
    selected = false;

    @property({type: Boolean, reflect: true})
    disabled = false;

    render() {
        return html`
            <label class="switch">
                <input type="checkbox"
                    ?disabled=${this.disabled}
                    ?checked=${this.selected}
                    @click=${this.checkboxClicked}>
                <span class="track"></span>
            </label>
        `;
    }

    checkboxClicked(event:InputEvent) {
        const cb = event.target as HTMLInputElement;
        this.selected = cb.checked;
        this.dispatchEvent(new SwitchChangeEvent(cb));
    }
   
    static styles = [styles.icons, styles.types, css`
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
        
    `]
}

declare global {
    interface HTMLElementTagNameMap {
        'hb-switch': Switch
    }
}
