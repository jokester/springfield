"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createPositionSnapshot(elem) {
    const timestamp = Date.now();
    const { left, right, top, bottom } = elem.getBoundingClientRect();
    return {
        timestamp,
        left,
        right,
        top,
        bottom,
        width: right - left,
        height: bottom - top,
    };
}
exports.createPositionSnapshot = createPositionSnapshot;
function takePositionalSnapshot(storage, logicalId, instanceId, elem) {
    const x = createPositionSnapshot(elem);
    if (!(x.width && x.height))
        return;
    const innerMap = storage.get(logicalId);
    if (innerMap) {
        innerMap.set(instanceId, x);
    }
    else {
        storage.set(logicalId, new Map([[instanceId, x]]));
    }
}
exports.takePositionalSnapshot = takePositionalSnapshot;
function findPositionalSnapshot(storage, logicalId, instanceId) {
    let inner;
    if ((inner = storage.get(logicalId))) {
        for (const [pId, snapshot] of inner.entries()) {
            if (pId !== instanceId && snapshot)
                return snapshot;
        }
    }
    return null;
}
exports.findPositionalSnapshot = findPositionalSnapshot;
function removePositionalSnapshot(storage, logicalId, instanceId) {
    let inner;
    if ((inner = storage.get(logicalId))) {
        inner.delete(instanceId);
        if (!inner.size) {
            storage.delete(logicalId);
        }
    }
}
exports.removePositionalSnapshot = removePositionalSnapshot;
//# sourceMappingURL=positional-snapshots.js.map