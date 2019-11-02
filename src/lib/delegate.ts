/**
 * @file delegate.ts
 * extension point of this library
 * - what elements to apply transition
 * - what transition / transform to apply
 */
import * as React from 'react';

export interface SpringfieldDelegate {
  takeSnapshot(logicalId: string, physicalId: string, elem: HTMLElement): void;
  removeSnapshot(logicalId: string, physicalId: string): void;

  /**
   *
   * @param logicalId
   * @param physicalId
   * @note not called in SSR
   * @FIXME make this optional
   * @default returns {@code ({visibility: 'hidden})}
   */
  createInitialStyle(logicalId: string, physicalId: string): undefined | React.CSSProperties;

  createInvertedTransformStyle(
    logicalId: string,
    physicalId: string,
    elem: HTMLElement,
  ): undefined | React.CSSProperties;

  /**
   *
   * @param logicalId
   * @param physicalId
   * @param elem
   * @param transition
   */
  createInTransitionStyle(
    logicalId: string,
    physicalId: string,
    elem: HTMLElement,
    transition?: string,
  ): undefined | React.CSSProperties;
}

export const SpringfieldContext = React.createContext<null | SpringfieldDelegate>(null);
