import { html, css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { styles } from "../styles";
import "../layout/hb-page-layout";
import "../common/hb-link-button";

/**
 * @class ProfilePage
 */
@customElement('hb-about-page')
export class AboutPage extends LitElement {

    render() {
        return html`
<hb-page-layout>
    <div class="page-container-small">        
        <div class="headline-large">About Harbor v0.1.0</div>
        <!-- <hr> -->
        <div class="body-large text-content">
            <p>
                Habor is a web application that can be used to configure and display
                simple content based websites.
            </p>
            <p>
                The version of this application is <span class="primary-text">v0.1.0</span>. The Changelog
                shows changes over previous versions including unreleased
                changes.
            </p>
            <p>
                To see features planned for the future, see the Habor project board.
            </p>
            <p>
                Feature requests and bugs can be added through Github issues.
            </p>
        </div>
        <hr>
        <div class="button-container">
            <hb-link-button
                label="Changelog"
                href="https://github.com/jhorback/harbor/blob/develop/CHANGELOG.md"
                target="changelog">
            </hb-link-button>
            <hb-link-button
                label="Project board"
                href="https://github.com/users/jhorback/projects/1"
                target="project">
            </hb-link-button>
            <hb-link-button
                label="Issues"
                href="https://github.com/jhorback/harbor/issues"
                target="issues">
            </hb-link-button>
        </div>
    </div>
</hb-page-layout>
        `;
    }

    static styles = [styles.types, styles.colors, styles.page, css`
        :host {
            display: block;
        }
        .page-container-small {            
            padding-top: 2rem;
        }
        hr {
            border-color: var(--md-sys-color-outline);
        }
        .text-content {
            padding: 2rem 0;
        }
        p {
            padding: 0.5rem 0;
            max-width: 60ch;
        }
        .button-container {
            display: flex;
            gap: 25px;
            justify-content: left;
            padding: 1rem 0;
        }
    `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-about-page': AboutPage
  }
}
