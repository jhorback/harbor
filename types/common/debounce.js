/**
 * @param fn the function to debounce
 * @param ms the number of milliseconds to wait; default is 300
 */
export const debounce = (fn, ms = 300) => {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
};
