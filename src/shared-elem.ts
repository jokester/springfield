import { cloneElement, CSSProperties, ReactElement, FunctionComponent, MutableRefObject } from 'react';
import { TransitionPhase } from './delegate';
import { SharedElementCallback, useTransition } from './use-transition';

interface RenderPropsChildren {
  /**
   * @param style
   * inline styles to render a DOM element with. Typically contains opacity / transform / transition
   *
   * @param transitionPhase
   * current transition phase
   *
   * @param callbacks
   * an Object with the following methods:
   * takeSnapshot: a callback to take snapshot manually. e.g. in scroll/click event handler
   * removeSnapshot: a callback to remove snapshot manually. e.g. when the element is no longer appropriate a transition source
   *
   * @param ref
   * If the desired shared element is not the return value of children, manually pass this `ref` to desired element.
   */
  (
    style: undefined | CSSProperties,
    callbacks: SharedElementCallback,
    transitionPhase: TransitionPhase,
    ref?: MutableRefObject<any>,
  ): ReactElement;
}

interface SharedElemProps {
  children: ReactElement | RenderPropsChildren;

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
   * whether child is target of shared-element transition
   * @default false
   * (all SharedElement-rendered direct children are source of transitions)
   */
  isTarget?: boolean;

  /**
   * transition spec for {@code TransitionPhase.duringTransition}
   * @default '0.3s all ease-in'
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/transition
   */
  transition?: string;

  /**
   * `opacity` style for phase {@code TransitionPhase.beforeTransition}
   * @default 1
   */
  initialOpacity?: number;
}

export const SharedElement: FunctionComponent<SharedElemProps> = ({ children, ...conf }) => {
  const [effectiveChildProps, callbacks, ref] = useTransition(conf);

  if (typeof children === 'function' && children.length > 3) {
    /**
     * when children is a function with arity >= 4:
     * it's a render function that handles ref by itself
     */
    return children(effectiveChildProps.style, callbacks, effectiveChildProps.phase, ref) as ReactElement;
  }

  if (typeof children === 'function') {
    /**
     * when children is a function with arity <= 3:
     * assume it returns a React (DOM) Element, and inject our ref
     */
    const origElem = children(effectiveChildProps.style, callbacks, effectiveChildProps.phase);
    return origElem && cloneElement(origElem, { ref });
  }

  if (children && typeof (children as ReactElement).type === 'string') {
    return cloneElement(children as ReactElement, {
      ref,
      style: effectiveChildProps.style,
    }) as ReactElement;
  }

  return children as ReactElement;
};
