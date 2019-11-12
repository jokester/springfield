import React from 'react';
import { TransitionPhase } from './delegate';
interface TransitionConfig {
    isTarget?: boolean;
    transition?: string;
    initialOpacity?: number;
}
interface ChildProps {
    phase: TransitionPhase;
    style?: React.CSSProperties;
}
export interface SharedElementCallback {
    takeSnapshot: () => void;
    removeSnapshot: () => void;
}
export declare function useTransition(logicalId: string, instanceId: string, conf: TransitionConfig): readonly [ChildProps, SharedElementCallback, React.MutableRefObject<HTMLElement>];
export {};
