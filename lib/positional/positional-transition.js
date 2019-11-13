"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function centerOf(pos) {
    return { x: pos.left + pos.width / 2, y: pos.top + pos.height / 2 };
}
/**
 * @param last
 * @param first
 * @returns CSS `transform` property that makes 'last' appear at position of 'first'
 */
function computeInvertedPositionalTransform(last, first) {
    const centerFirst = centerOf(first);
    const centerLast = centerOf(last);
    return [
        `translateX(${centerFirst.x - centerLast.x}px)`,
        `translateY(${centerFirst.y - centerLast.y}px)`,
        `scaleX(${first.width / last.width})`,
        `scaleY(${first.height / last.height})`,
    ].join(' ');
}
exports.computeInvertedPositionalTransform = computeInvertedPositionalTransform;
//# sourceMappingURL=positional-transition.js.map