var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import "../docTypes/hb-doc-page";
/**
 * The job of this element is to look the home page
 * document up in the database and append the correct element to the dom
 */
let HbHome = class HbHome extends LitElement {
    // the job of this element i
    render() {
        return html `      
            <hb-doc-page uid="doc:home"></hb-doc-page>
        `;
    }
    static { this.styles = [css `
        :host {
            display: block;
        }
    `]; }
};
HbHome = __decorate([
    customElement('hb-home')
], HbHome);
export { HbHome };
