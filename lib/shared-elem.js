"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const use_transition_1 = require("./use-transition");
exports.SharedElement = (_a) => {
    var { children } = _a, conf = __rest(_a, ["children"]);
    const [effectiveChildProps, callbacks, ref] = use_transition_1.useTransition(conf);
    if (typeof children === 'function' && children.length > 3) {
        /**
         * when children is a function with arity >= 4:
         * it's a render function that handles ref by itself
         */
        return children(effectiveChildProps.style, callbacks, effectiveChildProps.phase, ref);
    }
    if (typeof children === 'function') {
        /**
         * when children is a function with arity <= 3:
         * assume it returns a React (DOM) Element, and inject our ref
         */
        const origElem = children(effectiveChildProps.style, callbacks, effectiveChildProps.phase);
        return origElem && react_1.cloneElement(origElem, { ref });
    }
    if (children && typeof children.type === 'string') {
        return react_1.cloneElement(children, {
            ref,
            style: effectiveChildProps.style,
        });
    }
    return children;
};
//# sourceMappingURL=shared-elem.js.map