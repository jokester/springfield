import React, { useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { SpringfieldContext, TransitionPhase } from './delegate';
import { defaultSpringfieldDelegate } from './default-delegate';

interface TransitionConfig {
  isTarget?: boolean;
  transition?: string;
  initialOpacity?: number;
}

interface ChildProps {
  phase: TransitionPhase;
  styles?: React.CSSProperties;
}

export interface SharedElementCallback {
  takeSnapshot: () => void;
  removeSnapshot: () => void;
}

export function useTransition(logicalId: string, instanceId: string, conf: TransitionConfig) {
  const ref = useRef<HTMLElement>(null!);
  const { isTarget, transition, initialOpacity } = conf;
  const delegate = useContext(SpringfieldContext) || defaultSpringfieldDelegate;
  const initialChildProps = useMemo<ChildProps>(
    () => ({
      phase: TransitionPhase.initialRender,
      styles: isTarget
        ? delegate.createStyle(TransitionPhase.initialRender, logicalId, instanceId, undefined, transition)
        : undefined,
    }),
    [logicalId, instanceId, isTarget, delegate, transition],
  );

  const [childProps, setChildProps] = useState<null | ChildProps>(null);

  const callbacks: SharedElementCallback = useMemo(
    () => ({
      takeSnapshot() {
        if (ref.current instanceof HTMLElement && logicalId && instanceId)
          delegate.takeSnapshot(logicalId, instanceId, ref.current);
      },
      removeSnapshot() {
        if (logicalId && instanceId) delegate.removeSnapshot(logicalId, instanceId);
      },
    }),
    [logicalId, instanceId, delegate],
  );

  useLayoutEffect(() => {
    let effecting = true;
    const elem = ref.current;
    callbacks.takeSnapshot();

    if (isTarget && logicalId && instanceId && initialChildProps.styles && elem instanceof HTMLElement) {
      const invertedTransform = delegate.createStyle(
        TransitionPhase.beforeTransition,
        logicalId,
        instanceId,
        elem,
        transition,
      );

      setChildProps({ phase: TransitionPhase.beforeTransition, styles: invertedTransform || undefined });
      // do not start transition if invertedTransform is falsy (and we just unset the styles)
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
          styles: delegate.createStyle(TransitionPhase.duringTransition, logicalId, instanceId, elem, transition),
        });

        const tidyUp = () => {
          elem.removeEventListener('transitionend', tidyUp);
          if (!(effecting && ref.current === elem)) return /* due to out of control */;

          setChildProps({
            phase: TransitionPhase.afterTransition,
            styles: delegate.createStyle(TransitionPhase.afterTransition, logicalId, instanceId, elem, transition),
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
  }, [logicalId, instanceId, isTarget, transition, delegate /* NO callbacks / initialChildProps */]);

  return [/* effective child props */ childProps || initialChildProps, callbacks, ref] as const;
}
