"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file delegate.ts
 * extension point of this library
 * - what elements to apply transition
 * - what transition / transform to apply
 */
const React = __importStar(require("react"));
/**
 * @see https://aerotwist.com/blog/flip-your-animations/ for explanations of "first" "last" "inverted"
 */
var TransitionPhase;
(function (TransitionPhase) {
    /**
     * the styles to render a DOM element and measure its "stable" state
     * e.g. {@code { opacity: 0 }}
     * @note returning `undefined` would apply no transition.
     * @note implementations should return undefined in SSR
     */
    TransitionPhase["initialRender"] = "initialRender";
    /**
     * the styles to apply before transition starts
     * e.g. "inverted" transform styles that transforms the position measured at `initialRender` to
     * the last snapshot of the logical element ("first")
     * @note returning `undefined` would apply no transition
     */
    TransitionPhase["beforeTransition"] = "beforeTransition";
    /**
     * the styles that starts (and exists during) transition
     * e.g. no transform (to undo transform done by `beforeTransition`) and CSS `transition` property.
     */
    TransitionPhase["duringTransition"] = "duringTransition";
    /**
     * the styles to apply after transition ends
     * e.g. empty (so that the element gets rendered normally)
     */
    TransitionPhase["afterTransition"] = "afterTransition";
})(TransitionPhase = exports.TransitionPhase || (exports.TransitionPhase = {}));
exports.SpringfieldContext = React.createContext(null);
//# sourceMappingURL=delegate.js.map