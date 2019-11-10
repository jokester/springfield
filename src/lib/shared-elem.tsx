import React, { cloneElement, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { SpringfieldContext, TransitionPhase } from './delegate';
import { defaultSpringfieldDelegate } from './default-delegate';

interface SharedElementCallback {
  takeSnapshot: () => void;
  removeSnapshot: () => void;
}

interface RenderPropsChildren {
  /**
   * @param extraStyle
   * inline styles to render a DOM element with. Typically contains opacity / transform / transition
   *
   * @param transitionPhase
   *
   * @param callbacks
   * takeSnapshot: a callback to take snapshot manually. e.g. in scroll/click event handler
   * removeSnapshot: a callback to remove snapshot manually. e.g. when the element is no longer appropriate a transition source
   *
   * @param ref
   * If the desired shared element is not return value of children, manually pass to desired element.
   */
  (
    extraStyle: undefined | React.CSSProperties,
    transitionPhase: TransitionPhase,
    callbacks: SharedElementCallback,
    ref?: React.MutableRefObject<any>,
  ): React.ReactElement;
}

interface SharedElemProps {
  children: React.ReactElement | RenderPropsChildren;

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
   * whether child can be target of shared-element transition
   * @default false
   * (all SharedElement-rendered children are source of transitions)
   */
  isTarget?: boolean;
}

interface ChildProps {
  phase: TransitionPhase;
  styles?: React.CSSProperties;
}

export const SharedElement: React.FC<SharedElemProps> = ({ children, instanceId, isTarget, logicalId, transition }) => {
  const ref = useRef<HTMLElement>(null!);
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

    if (isTarget && logicalId && instanceId && initialChildProps.styles && elem instanceof HTMLElement) {
      callbacks.takeSnapshot();
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

  const effectiveChildProps = childProps || initialChildProps;

  if (typeof children === 'function' && children.length > 3) {
    /**
     * when children is a function with arity >= 4:
     * it's a render function that handles ref by itself
     */
    return children(effectiveChildProps.styles, effectiveChildProps.phase, callbacks, ref) as React.ReactElement;
  }

  if (typeof children === 'function') {
    /**
     * when children is a function with arity <= 3:
     * assume it returns a React (DOM) Element, and inject our ref
     */
    const origElem = children(effectiveChildProps.styles, effectiveChildProps.phase, callbacks);
    return origElem && cloneElement(origElem, { ref });
  }

  if (children && typeof (children as React.ReactElement).type === 'string') {
    return cloneElement(children as React.ReactElement, {
      ref,
      style: effectiveChildProps.styles,
    }) as React.ReactElement;
  }

  return children as React.ReactElement;
};
