import {
  createPositionSnapshot,
  findPositionalSnapshot,
  PositionalSnapshotStorage,
  removePositionalSnapshot,
  takePositionalSnapshot,
} from './positional/positional-snapshots';
import { SpringfieldDelegate } from './delegate';
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
  createInitialStyle(logicalId: string, physicalId: string): React.CSSProperties | undefined {
    return { visibility: 'hidden' };
  },
  createInvertedTransformStyle(
    logicalId: string,
    physicalId: string,
    elem: HTMLElement,
    transition?: string,
  ): {} /* React.CSSProperties */ | undefined {
    const lastSnapshpt = findPositionalSnapshot(globalSnapshotStorage, logicalId, physicalId);
    if (lastSnapshpt) {
      const current = createPositionSnapshot(elem);

      return computeInvertedPositionalTransition(current, lastSnapshpt);
    }
    return undefined;
  },

  createInTransitionStyle(
    logicalId: string,
    physicalId: string,
    elem: HTMLElement,
    transition?: string,
  ): /* React.CSSProperties */ {} | undefined {
    return { transition: transition || 'all 0.3s ease-in' };
  },
};
