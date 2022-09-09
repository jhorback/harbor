

import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "../../styles";
import { IFeedbackOptions } from "./sendFeedback";


type FeedbackState = {
    message: string;  
    showLinkButton: boolean;
    showButton: boolean;
    actionText: string|undefined;
    href: string|undefined;
    event: string|undefined;
    eventDetail: object|undefined;
}

/**
 * @class Feedback
 */
@customElement('hb-feedback')
export class Feedback extends LitElement {

    static feedbackEvent = (detail:IFeedbackOptions) =>
        new CustomEvent("system-feedback", { detail });


    @property({type: Boolean, reflect: true})
    open = false;

    
    messageDuration = 4*1000;


    @property({type: Object})
    state!:FeedbackState;

    private queue:Array<IFeedbackOptions> = [];

    constructor() {
        super();
        this.onSystemFeedback = this.onSystemFeedback.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener("system-feedback", this.onSystemFeedback);
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        window.removeEventListener("system-feedback", this.onSystemFeedback);
    }

    onSystemFeedback(event:any) {
        const options = event.detail as IFeedbackOptions;
        this.queue.push(options);
        this.tryNext();
    }

    private tryNext() {
        if (this.open) {
            this.open = false;
            setTimeout(() => this.showNext(), 400);
        }
        else {
            this.showNext();
        }
    }

    private openTimeoutId:NodeJS.Timeout|null = null;

    private showNext() {
        if (this.queue.length === 0) {
            return;
        }

        clearTimeout(this.openTimeoutId!);
        const next = this.queue.shift()!;
        this.state = {
            message: next.message,
            actionText: next.actionText,
            showButton: next.actionEvent ? true : false,
            showLinkButton: next.actionHref ? true : false,
            href: next.actionHref,
            event: next.actionEvent,
            eventDetail: next.actionEventDetail
        };
        this.open = true;
        this.openTimeoutId = setTimeout(() => this.open = false, this.messageDuration);
    }

    render() {
        if (!this.state) {
            return;
        }

        return html`
            <div class="feedback-container">
                <div class="text body-large">${this.state.message}</div>
                <div class="action">
                    ${this.state.showLinkButton ? html`
                        <a href=${this.state.href}>${this.state.actionText}</a>
                    ` : html``}
                    ${this.state.showButton ? html`
                        <button @click=${this.buttonClicked} class="body-large">${this.state.actionText}</button>
                    ` : html``}
                </div>
            </div>
        `;
    }
    
    private buttonClicked(event:Event) {
        if (!this.state.event) {
            return;
        }
        window.dispatchEvent(new CustomEvent(this.state.event, {detail:this.state.eventDetail}));
    }

    static styles = [styles.types, styles.colors, css`
        :host {
            background-color: var(--md-sys-color-inverse-surface);
            color: var(--md-sys-color-inverse-on-surface);
            padding: 0.8rem;
            border-radius: var(--md-sys-shape-corner-extra-small);
            user-select: none;
            min-width: 288px;
            max-width: 568px;

            position: fixed;
            display: inline-block;
            left: 1rem;

            transition: bottom 350ms;
            bottom: -5.5rem;
        }
        :host([open]) {
            bottom: 1rem;
        }

        .feedback-container {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .text {
            flex-grow: 1;            
        }
        .action {
           padding: 0 4px;
        }
        button { 
            color: var(--md-sys-color-inverse-primary);
            background-color: transparent;
            border: 0;
            padding: 0;
        }
        .action a {
            text-decoration: none;
            color: var(--md-sys-color-inverse-primary);
            padding: 0;
            white-space: nowrap;
        }
        a:hover, button:hover, a:focus, button:focus {
            color: var(--md-sys-color-inverse-on-surface);
        }
        a:focus, button:focus {
            outline: none;
        }
    `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-feedback': Feedback
  }
}
