/**
 * @file delegate.ts
 * extension point of this library
 * - what elements to apply transition
 * - what transition / transform to apply
 */
import * as React from 'react';

/**
 * @see https://aerotwist.com/blog/flip-your-animations/ for explanations of "first" "last" "inverted"
 */
export enum TransitionPhase {
  /**
   * the phase to render a DOM element and measure its "stable" position
   * e.g. {@code { opacity: 0 }}
   * @note returning style of `undefined` for this phase would apply no transition.
   * @note implementations *should* return undefined in SSR
   */
  initialRender = 'initialRender',

  /**
   * the phase to apply transform-like style before transition starts
   * e.g. "inverted" transform style that transforms the position measured at `initialRender` to
   * the last snapshot of the logical element ("first")
   * @note returning `undefined` would apply no transition
   */
  beforeTransition = 'beforeTransition',

  /**
   * the phase to apply in-transition style to progress
   * e.g. no transform (to undo transform done by `beforeTransition`) and CSS `transition` property.
   */
  duringTransition = 'duringTransition',

  /**
   * the phase after transition ends
   * e.g. empty (so that the element gets rendered normally)
   */
  afterTransition = 'afterTransition',
}

export interface SpringfieldDelegate {
  takeSnapshot(logicalId: string, instanceId: string, elem: HTMLElement): void;
  removeSnapshot(logicalId: string, instanceId: string): void;

  /**
   *
   * @param phase
   * @param logicalId
   * @param instanceId
   * @param elem
   * @param transition property specified in {@ref SharedElement}
   * @return inline style to render DOM element with
   */
  createStyle(
    phase: TransitionPhase,
    logicalId: string,
    instanceId: string,
    elem: undefined | HTMLElement,
    transition?: string,
  ): undefined | /* React.CSSProperties */ {};
}

export const SpringfieldContext = React.createContext<null | SpringfieldDelegate>(null);
