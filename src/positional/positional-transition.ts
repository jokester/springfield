import { PositionSnapshot } from './positional-snapshots';

function centerOf(pos: PositionSnapshot) {
  return { x: pos.left + pos.width / 2, y: pos.top + pos.height / 2 };
}

/**
 * @param last
 * @param first
 * @returns inline style that make 'last' appear at position of 'first'
 */
export function computeInvertedPositionalTransition(
  last: PositionSnapshot,
  first: PositionSnapshot,
): /* React.CSSProperties */ {} {
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
