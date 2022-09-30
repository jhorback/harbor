import { html, css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { styles } from "../styles";
import "../layout/hb-page-layout";
import "../common/hb-link-button";

/**
 * 
 */
 @customElement('hb-route-not-found-page')
 export class RouteNotFoundPage extends LitElement {
 
  render() {
      return html`      
          <hb-page-layout>
              <div class="container">
                  <h1 class="display-large">Page not found</h1>
                  <div class="help title-large">
                    The page you are looking for does not exist.
                    Try going back to the previous page or start over.
                  </div>
                  <div class="help">
                    <hb-link-button
                      href="/"
                      label="Start Over"
                      ></hb-link-button>
                  </div>
              </div>
          </hb-page-layout>
      `;
    }

    static styles = [styles.types, styles.colors, css`
        :host {
            display: block;
        }
        .container {
            text-align: center;    
        }
        h1.display-large {
          margin-top: 4rem;
        }
        .help {
          text-align: center;
          padding: 2rem;
          max-width: 40ch;
          margin: auto;
          opacity: 0.7;
        }
    `]
 }


 declare global {
    interface HTMLElementTagNameMap {
      'hb-route-not-found-page': RouteNotFoundPage
    }
  }