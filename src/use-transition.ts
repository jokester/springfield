import React, { useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { SpringfieldContext, TransitionConfig, TransitionPhase } from './delegate';
import { defaultSpringfieldDelegate } from './default-delegate';

interface ChildProps {
  phase: TransitionPhase;
  style?: React.CSSProperties;
}

export interface SharedElementCallback {
  takeSnapshot(): void;
  removeSnapshot(): void;
}

export function useTransition(conf: TransitionConfig) {
  const ref = useRef<HTMLElement>(null!);
  const delegate = useContext(SpringfieldContext) || defaultSpringfieldDelegate;

  const initialChildProps = useMemo<ChildProps>(
    () => ({
      phase: TransitionPhase.initialRender,
      style: conf.isTarget ? delegate.createStyle(TransitionPhase.initialRender, conf, undefined) : undefined,
    }),
    [conf.logicalId, conf.instanceId, conf.isTarget, delegate],
  );

  const [childProps, setChildProps] = useState<null | ChildProps>(null);

  const callbacks: SharedElementCallback = useMemo(
    () => ({
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
    }),
    [conf.logicalId, conf.instanceId, delegate],
  );

  useLayoutEffect(() => {
    let effecting = true;
    const elem = ref.current;
    callbacks.takeSnapshot();

    if (conf.isTarget && conf.logicalId && conf.instanceId && initialChildProps.style && elem instanceof HTMLElement) {
      const invertedTransform = delegate.createStyle(TransitionPhase.beforeTransition, conf, elem);

      setChildProps({ phase: TransitionPhase.beforeTransition, style: invertedTransform || undefined });
      // do not start transition if invertedTransform is falsy (and we just unset the style)
      if (!invertedTransform) return;

      /**
       * requestAnimationFrame does not really ensure `invertedTransform` style is set to DOM
       * If this becomes a problem, consider https://www.robinwieruch.de/react-usestate-callback
       */
      requestAnimationFrame(() => {
        if (!(effecting && ref.current === elem)) return /* due to out of control */;

        // force invertedTransform to be layouted
        elem.getBoundingClientRect();

        setChildProps({
          phase: TransitionPhase.duringTransition,
          style: delegate.createStyle(TransitionPhase.duringTransition, conf, elem),
        });

        const tidyUp = () => {
          elem.removeEventListener('transitionend', tidyUp);
          if (!(effecting && ref.current === elem)) return /* due to out of control */;

          setChildProps({
            phase: TransitionPhase.afterTransition,
            style: delegate.createStyle(TransitionPhase.afterTransition, conf, elem),
          });
        };

        elem.addEventListener('transitionend', tidyUp);
      });
    } else {
      setChildProps(null);
    }

    return () => {
      // TODO: should remove snapshot
      effecting = false;
    };
  }, [conf.logicalId, conf.instanceId, conf.isTarget, delegate /* NO callbacks / initialChildProps */]);

  return [
    childProps || initialChildProps, // as 'effective' child props
    callbacks,
    ref,
  ] as const;
}
