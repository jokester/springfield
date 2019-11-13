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
    takeSnapshot(conf, elem) {
        return positional_snapshots_1.takePositionalSnapshot(globalSnapshotStorage, conf.logicalId, conf.instanceId, elem);
    },
    removeSnapshot(conf) {
        return positional_snapshots_1.removePositionalSnapshot(globalSnapshotStorage, conf.logicalId, conf.instanceId);
    },
    createStyle(phase, { logicalId, instanceId, transition = 'all 0.3s ease-in', initialOpacity }, elem) {
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
                return {
                    transform: positional_transition_1.computeInvertedPositionalTransform(current, lastSnapshot),
                    opacity: initialOpacity,
                };
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