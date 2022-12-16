import { html } from 'lit-html';
import { styles } from "./index";
import "../common/hb-button";
export default {
    title: 'Layout/Dialog',
    parameters: { options: { showPanel: false } }
};
const DialogTemplate = () => html `
    <div class="doc-container">
        <h2>Dialog</h2>
        <p>
            See:<br>
            <a href="https://m3.material.io/components/dialogs/overview" target="md">Material Design Dialogs</a>
        </p>
        <ul>
            <li>The dialog styles provide styling for the HTML <b class="primary-text">dialog</b> element.</li>
            <li>Use an <b class="primary-text">h1.headline-small</b> type style for the dialog heading.</li>
            <li>Use the <b class="primary-text">.dialog-buttons</b> class for buttons at the bottom of the dialog.</li>
            <li>The <b class="primary-text">hr</b> tag is also styled appropriately.</li>
        </ul>
        <hb-button
            label="Open Dialog"
            @click=${openDialog}
        ></hb-button>
        <dialog>
            <h1 class="headline-small">Dialog Title</h1>
            <div class="content">
                Here is some dialog content text. How long does this wrap?
                Here is some dialog content text. How long does this wrap?
                Here is some dialog content text. How long does this wrap?
                Here is some dialog content text. How long does this wrap?
                Here is some dialog content text. How long does this wrap?
            </div>
            <hr>
            <div class="dialog-buttons">
                <hb-button
                    text-button
                    label="Cancel"
                    @click=${closeDialog}
                ></hb-button>
                <hb-button
                    text-button
                    label="OK"
                    @click=${closeDialog}
                ></hb-button>
            </div>
        </dialog>
    </div>
    <style>
        .content {
            max-width: 45ch;
        }    
        ${styles.types}
        ${styles.dialog}
        ${styles.colors}
    </style>
`;
const openDialog = () => {
    const dlg = document.querySelector("dialog");
    dlg?.showModal();
};
const closeDialog = () => {
    const dlg = document.querySelector("dialog");
    dlg?.close();
};
// const Template: Story = ColorTemplate;
export const Dialog = DialogTemplate;
