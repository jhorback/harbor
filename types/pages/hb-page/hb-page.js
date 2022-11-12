var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "../../styles";
import "../../layout/hb-page-layout";
import { NotFoundError } from "../../domain/Errors";
let HbPage = class HbPage extends LitElement {
    render() {
        return html `
            <hb-page-layout>
                This is the HB Page ${this.pathname}<br>
                <a href="/testpage/page-2">Test Page 2</a><br>
                <a href="/testpage/page-3">Test Page 3</a><br>
                <a href="/foobar">/foobar</a><br>
                <a href="/not-found">Navigate to /not-found</a><br>
               
                <a href="/app/about">About</a><br>
                <a href="/">Home</a><br>
                <a href="/docs/john-g-home">John G Home</a>
                <button @click=${this.throwError}>Throw Error</button>
            </hb-page-layout>
        `;
    }
    throwError() {
        //if (this.pathname === "/foobar/another") {
        throw new NotFoundError("TESTING NOT FOUND");
        //}
    }
};
HbPage.styles = [styles.types, styles.icons, css `
        :host {
            display: block;
        }
    `];
__decorate([
    property({ type: String })
], HbPage.prototype, "pathname", void 0);
HbPage = __decorate([
    customElement("hb-page")
], HbPage);
export { HbPage };
