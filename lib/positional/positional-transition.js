"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function centerOf(pos) {
    return { x: pos.left + pos.width / 2, y: pos.top + pos.height / 2 };
}
/**
 * @param last
 * @param first
 * @returns inline style that make 'last' appear at position of 'first'
 */
function computeInvertedPositionalTransition(last, first) {
    const centerFirst = centerOf(first);
    const centerLast = centerOf(last);
    return {
        transform: [
            `translateX(${centerFirst.x - centerLast.x}px)`,
            `translateY(${centerFirst.y - centerLast.y}px)`,
            `scaleX(${first.width / last.width})`,
            `scaleY(${first.height / last.height})`,
        ].join(' '),
    };
}
exports.computeInvertedPositionalTransition = computeInvertedPositionalTransition;
//# sourceMappingURL=positional-transition.js.map