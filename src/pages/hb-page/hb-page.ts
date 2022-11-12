import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "../../styles";
import "../../layout/hb-page-layout";
import { NotFoundError } from "../../domain/Errors";


@customElement("hb-page")
export class HbPage extends LitElement {

    @property({type: String})
    pathname!:string;

    render() {
        return html`
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

    static styles = [styles.types, styles.icons, css`
        :host {
            display: block;
        }
    `];
}


declare global {
    interface HTMLElementTagNameMap {
      "hb-page": HbPage
    }
  }