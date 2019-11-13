import React from 'react';
import { TransitionConfig, TransitionPhase } from './delegate';
interface ChildProps {
    phase: TransitionPhase;
    style?: React.CSSProperties;
}
export interface SharedElementCallback {
    takeSnapshot(): void;
    removeSnapshot(): void;
}
export declare function useTransition(conf: TransitionConfig): readonly [ChildProps, SharedElementCallback, React.MutableRefObject<HTMLElement>];
export {};
