/**
 * @file delegate.ts
 * extension point of this library
 * - what elements to apply transition
 * - what transition / transform to apply
 */
import * as React from 'react';

/**
 * @see https://aerotwist.com/blog/flip-your-animations/ for explanations of "first" "last" "invert"
 */
export enum TransitionPhase {
  /**
   * the styles to render a DOM element and measure its "stable" state
   * e.g. {@code { visibility: 'hidden }}
   */
  initialRender = 0,

  /**
   * the styles to apply before transition starts
   * e.g. transform styles that transforms position measured at `initialRender` to last snapshot of the logical element,
   * aka "invert"
   */
  beforeTransition = 1,

  /**
   * the styles that starts (and exists during) transition
   * e.g. no transform (to undo transform done by `beforeTransition`) and CSS `transition` property.
   */
  duringTransition = 2,

  /**
   * the styles to apply after transition ends
   * e.g. empty (so that the element gets rendered normally)
   */
  afterTransition = 3,
}

export interface SpringfieldDelegate {
  takeSnapshot(logicalId: string, physicalId: string, elem: HTMLElement): void;
  removeSnapshot(logicalId: string, physicalId: string): void;

  /**
   *
   * @param phase
   * @param logicalId
   * @param physicalId
   * @param elem
   * @param transition property specified in {@ref SharedElement}
   * @return inline styles to render DOM element with
   */
  createStyle(
    phase: TransitionPhase,
    logicalId: string,
    physicalId: string,
    elem: undefined | HTMLElement,
    transition?: string,
  ): undefined | /* React.CSSProperties */ {};
}

export const SpringfieldContext = React.createContext<null | SpringfieldDelegate>(null);
