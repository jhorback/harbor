import { html, css, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { styles } from "../../../styles";
import tinymce from "tinymce";
import { TextContentData } from "../textContentType";


/**
 */
@customElement('hb-text-content')
export class TextContent extends LitElement {
    static defaultState = new TextContentData();

    @property({type: Object})
    state:TextContentData = TextContent.defaultState;

    render() {
        return html`
            Text Content ${this.state.text}
        `;
    }

    static styles = [styles.types, styles.dialog, css`
        :host {
            display: block;
        }
  `]
}


declare global {
  interface HTMLElementTagNameMap {
    'hb-text-content': TextContent
  }
}
