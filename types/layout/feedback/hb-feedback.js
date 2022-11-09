var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "../../styles";
export class SystemFeedbackEvent extends Event {
    constructor(feedbackOptions) {
        super(SystemFeedbackEvent.eventType);
        this.feedbackOptions = feedbackOptions;
    }
    static { this.eventType = "system-feedback"; }
}
/**
 * @class Feedback
 */
let Feedback = class Feedback extends LitElement {
    constructor() {
        super();
        this.open = false;
        this.messageDuration = 4 * 1000;
        this.queue = [];
        this.openTimeoutId = null;
        this.onSystemFeedback = this.onSystemFeedback.bind(this);
    }
    connectedCallback() {
        super.connectedCallback();
        window.addEventListener(SystemFeedbackEvent.eventType, this.onSystemFeedback);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener(SystemFeedbackEvent.eventType, this.onSystemFeedback);
    }
    onSystemFeedback(event) {
        this.queue.push(event.feedbackOptions);
        this.tryNext();
    }
    tryNext() {
        if (this.open) {
            this.open = false;
            setTimeout(() => this.showNext(), 400);
        }
        else {
            this.showNext();
        }
    }
    showNext() {
        if (this.queue.length === 0) {
            return;
        }
        clearTimeout(this.openTimeoutId);
        const next = this.queue.shift();
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
        return html `
            <div class="feedback-container">
                <div class="text body-large">${this.state.message}</div>
                <div class="action">
                    ${this.state.showLinkButton ? html `
                        <a @click=${this.linkClicked} href=${this.state.href}>${this.state.actionText}</a>
                    ` : html ``}
                    ${this.state.showButton ? html `
                        <button @click=${this.buttonClicked} class="body-large">${this.state.actionText}</button>
                    ` : html ``}
                </div>
            </div>
        `;
    }
    buttonClicked(event) {
        if (!this.state.event) {
            return;
        }
        window.dispatchEvent(new CustomEvent(this.state.event, { detail: this.state.eventDetail }));
        this.open = false;
    }
    linkClicked() {
        this.open = false;
    }
    static { this.styles = [styles.types, styles.colors, css `
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
            z-index: 10000;
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
    `]; }
};
__decorate([
    property({ type: Boolean, reflect: true })
], Feedback.prototype, "open", void 0);
__decorate([
    property({ type: Object })
], Feedback.prototype, "state", void 0);
Feedback = __decorate([
    customElement('hb-feedback')
], Feedback);
export { Feedback };
