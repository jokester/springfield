export type PositionSnapshot = (ClientRect | DOMRect) & {
  instanceId: string;
  timestamp: number;
};

export function createPositionSnapshot(elem: HTMLElement, instanceId: string): PositionSnapshot {
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

export declare type PositionalSnapshotStorage = Map<
  /* logicalId */ string,
  /* a timestamp-desc array of <= 2 elements */ PositionSnapshot[]
>;

let inner;

export function takePositionalSnapshot(
  storage: PositionalSnapshotStorage,
  logicalId: string,
  instanceId: string,
  elem: HTMLElement,
): void {
  const x = createPositionSnapshot(elem, instanceId);
  if (!(x.width && x.height)) return;

  if ((inner = storage.get(logicalId))) {
    inner.unshift(x);
    if (inner.length > 2) inner.length = 2;
  } else {
    storage.set(logicalId, [x]);
  }
}

export function findPositionalSnapshot(
  storage: PositionalSnapshotStorage,
  logicalId: string,
  instanceId: string,
): null | PositionSnapshot {
  if ((inner = storage.get(logicalId))) {
    for (let i = 0; i < inner.length; i++) {
      if (inner[i].instanceId !== instanceId) {
        return inner[i];
      }
    }
  }
  return null;
}

export function removePositionalSnapshot(
  storage: PositionalSnapshotStorage,
  logicalId: string,
  instanceId: string,
): void {
  if ((inner = storage.get(logicalId))) {
    for (let i = 0; i < inner.length; i++) {
      if (inner[i].instanceId === instanceId) {
        inner.splice(i, 1);
        if (!inner.length) storage.delete(logicalId);
        break;
      }
    }
  }
}
