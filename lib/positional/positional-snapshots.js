"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createPositionSnapshot(elem, instanceId) {
    const timestamp = Date.now();
    const { left, right, top, bottom } = elem.getBoundingClientRect();
    return {
        timestamp,
        instanceId,
        left,
        right,
        top,
        bottom,
        width: right - left,
        height: bottom - top,
    };
}
exports.createPositionSnapshot = createPositionSnapshot;
let inner;
function takePositionalSnapshot(storage, logicalId, instanceId, elem) {
    const x = createPositionSnapshot(elem, instanceId);
    if (!(x.width && x.height))
        return;
    if ((inner = storage.get(logicalId))) {
        inner.unshift(x);
        if (inner.length > 2)
            inner.length = 2;
    }
    else {
        storage.set(logicalId, [x]);
    }
}
exports.takePositionalSnapshot = takePositionalSnapshot;
function findPositionalSnapshot(storage, logicalId, instanceId) {
    if ((inner = storage.get(logicalId))) {
        for (let i = 0; i < inner.length; i++) {
            if (inner[i].instanceId !== instanceId) {
                return inner[i];
            }
        }
    }
    return null;
}
exports.findPositionalSnapshot = findPositionalSnapshot;
function removePositionalSnapshot(storage, logicalId, instanceId) {
    if ((inner = storage.get(logicalId))) {
        for (let i = 0; i < inner.length; i++) {
            if (inner[i].instanceId === instanceId) {
                inner.splice(i, 1);
                if (!inner.length)
                    storage.delete(logicalId);
                break;
            }
        }
    }
}
exports.removePositionalSnapshot = removePositionalSnapshot;
//# sourceMappingURL=positional-snapshots.js.map