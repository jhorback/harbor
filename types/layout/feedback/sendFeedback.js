import { SystemFeedbackEvent } from "./hb-feedback";
;
/**
 * Dispatches an event to show a feedback/toast message.
 * The options include the message and an option action link or action button.
 * @param options
 */
export const sendFeedback = (options) => window.dispatchEvent(new SystemFeedbackEvent(options));
