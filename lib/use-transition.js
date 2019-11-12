"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const delegate_1 = require("./delegate");
const default_delegate_1 = require("./default-delegate");
function useTransition(logicalId, instanceId, conf) {
    const ref = react_1.useRef(null);
    const { isTarget, transition, initialOpacity } = conf;
    const delegate = react_1.useContext(delegate_1.SpringfieldContext) || default_delegate_1.defaultSpringfieldDelegate;
    const initialChildProps = react_1.useMemo(() => ({
        phase: delegate_1.TransitionPhase.initialRender,
        style: isTarget
            ? delegate.createStyle(delegate_1.TransitionPhase.initialRender, logicalId, instanceId, undefined, transition)
            : undefined,
    }), [logicalId, instanceId, isTarget, delegate, transition]);
    const [childProps, setChildProps] = react_1.useState(null);
    const callbacks = react_1.useMemo(() => ({
        takeSnapshot() {
            if (ref.current instanceof HTMLElement && logicalId && instanceId)
                delegate.takeSnapshot(logicalId, instanceId, ref.current);
        },
        removeSnapshot() {
            if (logicalId && instanceId)
                delegate.removeSnapshot(logicalId, instanceId);
        },
    }), [logicalId, instanceId, delegate]);
    react_1.useLayoutEffect(() => {
        let effecting = true;
        const elem = ref.current;
        callbacks.takeSnapshot();
        if (isTarget && logicalId && instanceId && initialChildProps.style && elem instanceof HTMLElement) {
            const invertedTransform = delegate.createStyle(delegate_1.TransitionPhase.beforeTransition, logicalId, instanceId, elem, transition);
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
                    style: delegate.createStyle(delegate_1.TransitionPhase.duringTransition, logicalId, instanceId, elem, transition),
                });
                const tidyUp = () => {
                    elem.removeEventListener('transitionend', tidyUp);
                    if (!(effecting && ref.current === elem))
                        return /* due to out of control */;
                    setChildProps({
                        phase: delegate_1.TransitionPhase.afterTransition,
                        style: delegate.createStyle(delegate_1.TransitionPhase.afterTransition, logicalId, instanceId, elem, transition),
                    });
                };
                elem.addEventListener('transitionend', tidyUp);
            });
        }
        else {
            setChildProps(null);
        }
        return () => {
            // TODO: should remove snapshot
            effecting = false;
        };
    }, [logicalId, instanceId, isTarget, transition, delegate /* NO callbacks / initialChildProps */]);
    return [/* effective child props */ childProps || initialChildProps, callbacks, ref];
}
exports.useTransition = useTransition;
//# sourceMappingURL=use-transition.js.map