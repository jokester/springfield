"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const use_transition_1 = require("./use-transition");
exports.SharedElement = ({ children, instanceId, isTarget, logicalId, transition }) => {
    const [effectiveChildProps, callbacks, ref] = use_transition_1.useTransition(logicalId, instanceId, { isTarget, transition });
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