import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { typeStyles } from "./styles/type-styles";
// import litLogo from "./assets/lit.svg"


/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('harbor-app')
export class HarborApp extends LitElement {
  /**
   * Copy for the read the docs hint.
   */
  @property()
  docsHint = 'Click on the Vite and Lit logos to learn more'

  /**
   * The number of times the button has been clicked.
   */
  @property({ type: Number })
  count = 0

  render() {
    return html`      
      <slot></slot>

      <h1>Heading 1</h1>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <h4>Heading 4</h4>
      <h5>Heading 5</h5>
      <h6>Heading 6</h6>
      <div class="display-large">Display Large</div>
      <div class="display-medium">Display Medium</div>
      <div class="display-small">Display Small</div>
      <div class="headline-large">Headline Large</div>
      <div class="headline-medium">Headline Medium</div>
      <div class="headline-small">Headline Small</div>
      <div class="title-large">Title Large</div>
      <div class="title-medium">Title Medium</div>
      <div class="title-small">Title Small</div>
      <div class="label-large">Label Large</div>
      <div class="label-medium">Label Medium</div>
      <div class="label-small">Label Small</div>
      <div class="body-large">Body Large</div>
      <div class="body-medium">Body Medium</div>
      <div class="body-small">Body Small</div>
  



      <div class="card">
        <button @click=${this._onClick} part="button">
          count is ${this.count}
        </button>
      </div>
      <p class="read-the-docs red">${this.docsHint}</p>
    `
  }

  private _onClick() {
    this.count++
  }

  static styles = [typeStyles, css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    .logo {
      height: 6em;
      padding: 1.5em;
      will-change: filter;
    }
    .logo:hover {
      filter: drop-shadow(0 0 2em #646cffaa);
    }
    .logo.lit:hover {
      filter: drop-shadow(0 0 2em #325cffaa);
    }

    .card {
      padding: 2em;
    }

    .read-the-docs {
      /*color: #888;*/
    }

    h1 {
      font-size: 3.2em;
      line-height: 1.1;
    }

    a {
      font-weight: 500;
      color: #646cff;
      text-decoration: inherit;
    }
    a:hover {
      color: #535bf2;
    }

    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #1a1a1a;
      cursor: pointer;
      transition: border-color 0.25s;
    }
    button:hover {
      border-color: #646cff;
    }
    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }

    @media (prefers-color-scheme: light) {
      a:hover {
        color: #747bff;
      }
      button {
        background-color: #f9f9f9;
      }
    }
  `]
}

declare global {
  interface HTMLElementTagNameMap {
    'harbor-app': HarborApp
  }
}
