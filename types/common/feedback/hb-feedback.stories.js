import { html } from 'lit-html';
import "../feedback/hb-feedback";
import { sendFeedback } from "../feedback";
export default {
    title: 'Common/Feedback',
    component: "hb-feedback",
    argTypes: {},
    parameters: {
        options: { showPanel: true }
    }
};
const FeedbackTemplate = ({}) => html `
    <hb-feedback></hb-feedback>
    <button type="button" @click=${test1}>Simple Message</button>
    <button type="button" @click=${test2}>Message With Link</button>
    <button type="button" @click=${test3}>Message With Button</button>
    <button type="button" @click=${test4}>Long Message With Button</button>
`;
const test1 = () => {
    sendFeedback({
        message: "This is a simple message"
    });
};
const test2 = () => {
    sendFeedback({
        message: "This is a message with a link",
        actionText: "Google",
        actionHref: "http://www.google.com"
    });
};
const test3 = () => {
    sendFeedback({
        message: "This is a message with a button",
        actionText: "Alert",
        actionEvent: "test-feedback-alert",
        actionEventDetail: {
            isFeedback: true
        }
    });
};
const test4 = () => {
    sendFeedback({
        message: "This is a long message with a button that can wrap, but keep it short, otherwise it is hard to read in 4 seconds",
        actionText: "Alert",
        actionEvent: "test-feedback-alert",
        actionEventDetail: {
            isFeedback: true
        }
    });
};
window.addEventListener("test-feedback-alert", (event) => {
    alert("Test Feedback Alert\n\nDetail:\n" + JSON.stringify(event.detail));
});
// @ts-ignore 
const Template = (args) => FeedbackTemplate(args);
export const Feedback = Template.bind({});
Feedback.args = {};
