
import { Feedback } from "./hb-feedback";


export interface IFeedbackOptions {
    /** The message to show */
    message: string;
    /** The text to show on the link or button */
    actionText?: string;
    /** The href of the action link */
    actionHref?: string;
    /** The event name to fire on the window when clicking the action button */
    actionEvent?: string;
    /** The event detail to accompany the event fired when clicking the action button */
    actionEventDetail?:any;
};


/**
 * Dispatches an event to show a feedback/toast message.
 * The options include the message and an option action link or action button.
 * @param options 
 */
export const sendFeedback = (options:IFeedbackOptions) =>
    window.dispatchEvent(Feedback.feedbackEvent(options));

