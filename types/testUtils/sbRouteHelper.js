import { Router } from "@domx/router";
/**
 * Replaces the location href with the initial href of the page
 * after document click event.
 *
 * Useful for storybook stories that use client side routing.
 * @param options RouteHelperOptions
 */
export const sbRouteHelper = (options) => {
    const initUrl = location.href;
    const resetUrl = () => window.history.replaceState(null, "", initUrl);
    if (options?.startPath) {
        Router.replaceUrl(options.startPath);
        // note, could make replaceUrl & triggerLocationChanged async
        // then wouldn't need a yield, instead: await Router.replaceUrl(startPath)
        setTimeout(resetUrl); // yield
    }
    document.addEventListener("click", resetUrl);
};
