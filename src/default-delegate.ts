import {
  createPositionSnapshot,
  findPositionalSnapshot,
  PositionalSnapshotStorage,
  removePositionalSnapshot,
  takePositionalSnapshot,
} from './positional/positional-snapshots';
import { SpringfieldDelegate, TransitionConfig, TransitionPhase } from './delegate';
import { computeInvertedPositionalTransform } from './positional/positional-transition';

const globalSnapshotStorage: PositionalSnapshotStorage = new Map();

/**
 * A global singleton
 */
export const defaultSpringfieldDelegate: SpringfieldDelegate = {
  takeSnapshot(conf: TransitionConfig, elem: HTMLElement) {
    return takePositionalSnapshot(globalSnapshotStorage, conf.logicalId, conf.instanceId, elem);
  },

  removeSnapshot(conf: TransitionConfig): void {
    return removePositionalSnapshot(globalSnapshotStorage, conf.logicalId, conf.instanceId);
  },

  createStyle(
    phase: TransitionPhase,
    { logicalId, instanceId, transition = 'all 0.3s ease-in', initialOpacity }: TransitionConfig,
    elem: undefined | HTMLElement,
  ): undefined | {} {
    if (/* SSR */ typeof window === 'undefined') {
      return undefined;
    } else if (phase === TransitionPhase.initialRender) {
      return { opacity: 0 };
    } else if (phase === TransitionPhase.beforeTransition && elem) {
      const lastSnapshot = findPositionalSnapshot(globalSnapshotStorage, logicalId, instanceId);
      if (lastSnapshot) {
        const current = createPositionSnapshot(elem, logicalId);
        return {
          transform: computeInvertedPositionalTransform(current, lastSnapshot),
          opacity: initialOpacity,
        };
      }
    } else if (phase === TransitionPhase.duringTransition) {
      return { transition };
    } else if (phase === TransitionPhase.afterTransition) {
      return undefined;
    }
    return undefined;
  },
};
