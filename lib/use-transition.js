"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const delegate_1 = require("./delegate");
const default_delegate_1 = require("./default-delegate");
function useTransition(conf) {
    const ref = react_1.useRef(null);
    const delegate = react_1.useContext(delegate_1.SpringfieldContext) || default_delegate_1.defaultSpringfieldDelegate;
    const initialChildProps = react_1.useMemo(() => ({
        phase: delegate_1.TransitionPhase.initialRender,
        style: conf.isTarget ? delegate.createStyle(delegate_1.TransitionPhase.initialRender, conf, undefined) : undefined,
    }), [conf.logicalId, conf.instanceId, conf.isTarget, delegate]);
    const [childProps, setChildProps] = react_1.useState(null);
    const callbacks = react_1.useMemo(() => ({
        takeSnapshot() {
            if (ref.current instanceof HTMLElement && conf.logicalId && conf.instanceId) {
                delegate.takeSnapshot(conf, ref.current);
            }
        },
        removeSnapshot() {
            if (conf.logicalId && conf.instanceId) {
                delegate.removeSnapshot(conf);
            }
        },
    }), [conf.logicalId, conf.instanceId, delegate]);
    if (typeof window !== 'undefined') {
        /**
         * only useLayoutEffect() in SSR, to get rid of warning
         */
        react_1.useLayoutEffect(() => {
            let effecting = true;
            const elem = ref.current;
            callbacks.takeSnapshot();
            if (conf.isTarget &&
                conf.logicalId &&
                conf.instanceId &&
                initialChildProps.style &&
                elem instanceof HTMLElement) {
                const invertedTransform = delegate.createStyle(delegate_1.TransitionPhase.beforeTransition, conf, elem);
                setChildProps({ phase: delegate_1.TransitionPhase.beforeTransition, style: invertedTransform || undefined });
                // do not start transition if invertedTransform is falsy (and we just unset the style)
                if (!invertedTransform)
                    return;
                /**
                 * requestAnimationFrame does not really ensure `invertedTransform` style is set to DOM
                 * If this becomes a problem, consider https://www.robinwieruch.de/react-usestate-callback
                 */
                requestAnimationFrame(() => {
                    if (!(effecting && ref.current === elem))
                        return /* due to out of control */;
                    // force invertedTransform to be layouted
                    elem.getBoundingClientRect();
                    setChildProps({
                        phase: delegate_1.TransitionPhase.duringTransition,
                        style: delegate.createStyle(delegate_1.TransitionPhase.duringTransition, conf, elem),
                    });
                    const tidyUp = () => {
                        elem.removeEventListener('transitionend', tidyUp);
                        if (!(effecting && ref.current === elem))
                            return /* due to out of control */;
                        setChildProps({
                            phase: delegate_1.TransitionPhase.afterTransition,
                            style: delegate.createStyle(delegate_1.TransitionPhase.afterTransition, conf, elem),
                        });
                    };
                    elem.addEventListener('transitionend', tidyUp);
                });
            }
            else {
                setChildProps(null);
            }
            return () => {
                effecting = false;
            };
        }, [conf.logicalId, conf.instanceId, conf.isTarget, delegate /* NO callbacks / initialChildProps */]);
    }
    return [
        childProps || initialChildProps,
        callbacks,
        ref,
    ];
}
exports.useTransition = useTransition;
//# sourceMappingURL=use-transition.js.map