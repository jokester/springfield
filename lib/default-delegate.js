"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const positional_snapshots_1 = require("./positional/positional-snapshots");
const delegate_1 = require("./delegate");
const positional_transition_1 = require("./positional/positional-transition");
const globalSnapshotStorage = new Map();
/**
 * A global singleton
 */
exports.defaultSpringfieldDelegate = {
    takeSnapshot(logicalId, instanceId, elem) {
        return positional_snapshots_1.takePositionalSnapshot(globalSnapshotStorage, logicalId, instanceId, elem);
    },
    removeSnapshot(logicalId, instanceId) {
        return positional_snapshots_1.removePositionalSnapshot(globalSnapshotStorage, logicalId, instanceId);
    },
    createStyle(phase, logicalId, instanceId, elem, transition = 'all 0.3s ease-in') {
        if ( /* SSR */typeof window === 'undefined') {
            return undefined;
        }
        else if (phase === delegate_1.TransitionPhase.initialRender) {
            return { opacity: 0 };
        }
        else if (phase === delegate_1.TransitionPhase.beforeTransition && elem) {
            const lastSnapshot = positional_snapshots_1.findPositionalSnapshot(globalSnapshotStorage, logicalId, instanceId);
            if (lastSnapshot) {
                const current = positional_snapshots_1.createPositionSnapshot(elem);
                return positional_transition_1.computeInvertedPositionalTransition(current, lastSnapshot);
            }
        }
        else if (phase === delegate_1.TransitionPhase.duringTransition) {
            return { transition };
        }
        else if (phase === delegate_1.TransitionPhase.afterTransition) {
            return undefined;
        }
        return undefined;
    },
};
//# sourceMappingURL=default-delegate.js.map