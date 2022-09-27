var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { styles } from "../styles";
import "../layout/hb-page-layout";
import "../common/hb-link-button";
/**
 *
 */
let RouteNotFoundPage = class RouteNotFoundPage extends LitElement {
    render() {
        return html `      
          <hb-page-layout>
              <div class="page-container">
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
};
RouteNotFoundPage.styles = [styles.page, styles.types, styles.colors, css `
        :host {
            display: block;
        }
        .page-container {
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
    `];
RouteNotFoundPage = __decorate([
    customElement('hb-route-not-found-page')
], RouteNotFoundPage);
export { RouteNotFoundPage };
