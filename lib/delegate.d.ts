/// <reference types="react" />
/**
 * @see https://aerotwist.com/blog/flip-your-animations/ for explanations of "first" "last" "inverted"
 */
export declare enum TransitionPhase {
    /**
     * the phase to render a DOM element and measure its "stable" position
     * e.g. {@code { opacity: 0 }}
     * @note returning style of `undefined` for this phase would apply no transition.
     * @note implementations *should* return undefined in SSR
     */
    initialRender = "initialRender",
    /**
     * the phase to apply transform-like style before transition starts
     * e.g. "inverted" transform style that transforms the position measured at `initialRender` to
     * the last snapshot of the logical element ("first")
     * @note returning `undefined` would apply no transition
     */
    beforeTransition = "beforeTransition",
    /**
     * the phase to apply in-transition style to progress
     * e.g. no transform (to undo transform done by `beforeTransition`) and CSS `transition` property.
     */
    duringTransition = "duringTransition",
    /**
     * the phase after transition ends
     * e.g. empty (so that the element gets rendered normally)
     */
    afterTransition = "afterTransition"
}
export interface TransitionConfig {
    logicalId: string;
    instanceId: string;
    isTarget?: boolean;
    transition?: string;
    initialOpacity?: number;
}
export interface SpringfieldDelegate {
    takeSnapshot(conf: TransitionConfig, elem: HTMLElement): void;
    removeSnapshot(conf: TransitionConfig): void;
    /**
     * @param phase
     * @param conf
     * @param elem
     * @return inline style to render DOM element with
     */
    createStyle(phase: TransitionPhase, conf: TransitionConfig, elem: undefined | HTMLElement): undefined | /* React.CSSProperties */ {};
}
export declare const SpringfieldContext: import("react").Context<SpringfieldDelegate | null>;
