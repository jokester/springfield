import React, { cloneElement, createElement, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { SpringfieldContext, TransitionPhase } from './delegate';
import { defaultSpringfieldDelegate } from './default-delegate';

interface SharedElemProps {
  /**
   * @param extraStyle
   * inline styles to render a DOM element with. Typically contains visibility / transform / transition
   * @param takeSnapshot
   * a a callback to take snapshot manually. e.g. in scroll/click event handler
   * @param removeSnapshot
   * a a callback to remove snapshot manually.
   * @param ref If the desired shared element is not return value of children, manually pass to desired element.
   */
  children(
    extraStyle: undefined | React.CSSProperties,
    takeSnapshot: () => void,
    removeSnapshot: () => void,
    ref: React.MutableRefObject<any>,
  ): React.ReactElement;

  /**
   * identifier of a logical element
   * @example "user-avatar"
   */
  logicalId: string;

  /**
   * identifier of a occurrence of a "logical element"
   * @example "in-toolbar" "in-profile-component"
   */
  instanceId: string;

  /**
   * transition spec when corresponded DOM element is mounted
   * @default '0.3s all ease-in'
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/transition
   */
  transition?: string;

  /**
   * apply transition after children is rendered
   * @default false
   * (all SharedElement-rendered children are source of transitions)
   */
  isTarget?: boolean;
}

export const SharedElement: React.FC<SharedElemProps> = ({ children, instanceId, isTarget, logicalId, transition }) => {
  const ref = useRef<HTMLElement>(null!);
  const delegate = useContext(SpringfieldContext) || defaultSpringfieldDelegate;

  const [extraStyle, setExtraStyle] = useState<undefined | React.CSSProperties>(() => {
    if (/* SSR */ typeof window === 'undefined') {
      return undefined;
    } else {
      return delegate.createStyle(TransitionPhase.initialRender, logicalId, instanceId, undefined, transition);
    }
  });

  const takeSnapshot = useCallback(() => {
    if (ref.current instanceof HTMLElement && logicalId && instanceId)
      delegate.takeSnapshot(logicalId, instanceId, ref.current);
  }, [logicalId, instanceId, delegate]);

  const removeSnapshot = useCallback(() => {
    if (logicalId && instanceId) delegate.removeSnapshot(logicalId, instanceId);
  }, [delegate, instanceId, logicalId]);

  useEffect(() => {
    takeSnapshot();

    let effecting = true;
    let elem: undefined | HTMLElement;
    let invertedTransform: undefined | React.CSSProperties;
    if (
      isTarget &&
      logicalId &&
      instanceId &&
      (elem = ref.current) instanceof HTMLElement &&
      (invertedTransform = delegate.createStyle(
        TransitionPhase.beforeTransition,
        logicalId,
        instanceId,
        ref.current,
        transition,
      ))
    ) {
      setExtraStyle(invertedTransform);
      requestAnimationFrame(() => {
        if (effecting) {
          setExtraStyle(
            delegate.createStyle(TransitionPhase.duringTransition, logicalId, instanceId, elem!, transition),
          );
          const tidyUp = () => {
            if (effecting) {
              setExtraStyle(
                delegate.createStyle(TransitionPhase.afterTransition, logicalId, instanceId, elem!, transition),
              );
            }
            elem!.removeEventListener('transitionend', tidyUp);
          };
          elem!.addEventListener('transitionend', tidyUp);
        }
      });
    } else {
      setExtraStyle({});
    }

    return () => {
      effecting = false;
    };
  }, [isTarget, logicalId, instanceId, transition, takeSnapshot, delegate]);

  if (typeof children !== 'function') {
    /**
     * when api mismatch: silently do nothing
     */
    return children as React.ReactElement;
  } else if (children.length > 3) {
    /**
     * when children (a function) makes use of ref: do not inject own
     */
    return children(extraStyle, takeSnapshot, removeSnapshot, ref) as React.ReactElement;
  } else {
    /**
     * assume it renders to a DOM element, and inject our ref
     */
    const origElem = children(extraStyle, takeSnapshot, removeSnapshot, undefined!);
    return cloneElement(origElem, { ref }) as React.ReactElement;
  }
};
