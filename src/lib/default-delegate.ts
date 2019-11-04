import {
  createPositionSnapshot,
  findPositionalSnapshot,
  PositionalSnapshotStorage,
  removePositionalSnapshot,
  takePositionalSnapshot,
} from './positional/positional-snapshots';
import { SpringfieldDelegate, TransitionPhase } from './delegate';
import { computeInvertedPositionalTransition } from './positional/positional-transition';

const globalSnapshotStorage: PositionalSnapshotStorage = new Map();

/**
 * A global singleton
 */
export const defaultSpringfieldDelegate: SpringfieldDelegate = {
  takeSnapshot(logicalId: string, physicalId: string, elem: HTMLElement) {
    return takePositionalSnapshot(globalSnapshotStorage, logicalId, physicalId, elem);
  },

  removeSnapshot(logicalId: string, physicalId: string): void {
    return removePositionalSnapshot(globalSnapshotStorage, logicalId, physicalId);
  },

  createStyle(
    phase: TransitionPhase,
    logicalId: string,
    physicalId: string,
    elem: undefined | HTMLElement,
    transition = 'all 0.3s ease-in',
  ): undefined | {} {
    if (phase === TransitionPhase.initialRender) {
      return { visibility: 'hidden' };
    } else if (phase === TransitionPhase.beforeTransition && elem) {
      const lastSnapshot = findPositionalSnapshot(globalSnapshotStorage, logicalId, physicalId);
      if (lastSnapshot) {
        const current = createPositionSnapshot(elem);
        return computeInvertedPositionalTransition(current, lastSnapshot);
      }
    } else if (phase === TransitionPhase.duringTransition) {
      return { transition };
    } else if (phase === TransitionPhase.afterTransition) {
      return undefined;
    }
    return undefined;
  },
};
