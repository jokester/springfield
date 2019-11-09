import React, { cloneElement, useCallback, useContext, useLayoutEffect, useRef, useState } from 'react';
import { SpringfieldContext, TransitionPhase } from './delegate';
import { defaultSpringfieldDelegate } from './default-delegate';

interface SharedElemProps {
  /**
   * @param extraStyle
   * inline styles to render a DOM element with. Typically contains opacity / transform / transition
   *
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
    ref?: React.MutableRefObject<any>,
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

  const [extraStyle, setExtraStyle] = useState<undefined | React.CSSProperties>(() =>
    isTarget
      ? delegate.createStyle(TransitionPhase.initialRender, logicalId, instanceId, undefined, transition)
      : undefined,
  );

  const takeSnapshot = useCallback(() => {
    if (ref.current instanceof HTMLElement && logicalId && instanceId)
      delegate.takeSnapshot(logicalId, instanceId, ref.current);
  }, [logicalId, instanceId, delegate]);

  const removeSnapshot = useCallback(() => {
    if (logicalId && instanceId) delegate.removeSnapshot(logicalId, instanceId);
  }, [instanceId, logicalId, delegate]);

  useLayoutEffect(() => {
    const elem = ref.current;
    if (!(elem instanceof HTMLElement)) return;

    takeSnapshot();

    let effecting = true;

    if (isTarget && logicalId && instanceId && extraStyle /* the value for initialRender */) {
      const invertedTransform = delegate.createStyle(
        TransitionPhase.beforeTransition,
        logicalId,
        instanceId,
        ref.current,
        transition,
      );

      setExtraStyle(invertedTransform || undefined);
      // do not start transition if invertedTransform is falsy (and we just unset the styles)
      if (!invertedTransform) return;

      /**
       * requestAnimationFrame does not really ensure `invertedTransform` style is set to DOM
       * If this becomes a problem, consider https://www.robinwieruch.de/react-usestate-callback
       */
      requestAnimationFrame(() => {
        if (!(effecting && ref.current === elem)) return;

        // force invertedTransform to be layouted
        elem.getBoundingClientRect();

        setExtraStyle(delegate.createStyle(TransitionPhase.duringTransition, logicalId, instanceId, elem, transition));

        const tidyUp = () => {
          elem.removeEventListener('transitionend', tidyUp);
          if (!(effecting && ref.current === elem)) return;

          setExtraStyle(delegate.createStyle(TransitionPhase.afterTransition, logicalId, instanceId, elem, transition));
        };
        elem.addEventListener('transitionend', tidyUp);
      });
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
    const origElem = children(extraStyle, takeSnapshot, removeSnapshot);
    return cloneElement(origElem, { ref }) as React.ReactElement;
  }
};
