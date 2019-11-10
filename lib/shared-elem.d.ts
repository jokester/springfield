import React from 'react';
import { TransitionPhase } from './delegate';
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
    (extraStyle: undefined | React.CSSProperties, callbacks: SharedElementCallback, transitionPhase: TransitionPhase, ref?: React.MutableRefObject<any>): React.ReactElement;
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
export declare const SharedElement: React.FC<SharedElemProps>;
export {};
