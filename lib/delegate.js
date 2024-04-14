"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file delegate.ts
 * extension point of this library
 * - what elements to apply transition
 * - what transition / transform to apply
 */
const react_1 = require("react");
/**
 * @see https://aerotwist.com/blog/flip-your-animations/ for explanations of "first" "last" "inverted"
 */
var TransitionPhase;
(function (TransitionPhase) {
    /**
     * the phase to render a DOM element and measure its "stable" position
     * e.g. {@code { opacity: 0 }}
     * @note returning style of `undefined` for this phase would apply no transition.
     * @note implementations *should* return undefined in SSR
     */
    TransitionPhase["initialRender"] = "initialRender";
    /**
     * the phase to apply transform-like style before transition starts
     * e.g. "inverted" transform style that transforms the position measured at `initialRender` to
     * the last snapshot of the logical element ("first")
     * @note returning `undefined` would apply no transition
     */
    TransitionPhase["beforeTransition"] = "beforeTransition";
    /**
     * the phase to apply in-transition style to progress
     * e.g. no transform (to undo transform done by `beforeTransition`) and CSS `transition` property.
     */
    TransitionPhase["duringTransition"] = "duringTransition";
    /**
     * the phase after transition ends
     * e.g. empty (so that the element gets rendered normally)
     */
    TransitionPhase["afterTransition"] = "afterTransition";
})(TransitionPhase = exports.TransitionPhase || (exports.TransitionPhase = {}));
exports.SpringfieldContext = react_1.createContext(null);
//# sourceMappingURL=delegate.js.map