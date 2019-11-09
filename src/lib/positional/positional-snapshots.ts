export type PositionSnapshot = (ClientRect | DOMRect) & {
  timestamp: number;
};

export function createPositionSnapshot(elem: HTMLElement): PositionSnapshot {
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

export declare type PositionalSnapshotStorage = Map<
  /* logicalId */ string,
  Map</* instanceId */ string, PositionSnapshot>
>;

export function takePositionalSnapshot(
  storage: PositionalSnapshotStorage,
  logicalId: string,
  instanceId: string,
  elem: HTMLElement,
): void {
  const x = createPositionSnapshot(elem);
  if (!(x.width && x.height)) return;

  const innerMap = storage.get(logicalId);
  if (innerMap) {
    innerMap.set(instanceId, x);
  } else {
    storage.set(logicalId, new Map([[instanceId, x]]));
  }
}

export function findPositionalSnapshot(
  storage: PositionalSnapshotStorage,
  logicalId: string,
  instanceId: string,
): null | PositionSnapshot {
  let inner;
  if ((inner = storage.get(logicalId))) {
    for (const [pId, snapshot] of inner.entries()) {
      if (pId !== instanceId && snapshot) return snapshot;
    }
  }
  return null;
}

export function removePositionalSnapshot(
  storage: PositionalSnapshotStorage,
  logicalId: string,
  instanceId: string,
): void {
  let inner;
  if ((inner = storage.get(logicalId))) {
    inner.delete(instanceId);
    if (!inner.size) {
      storage.delete(logicalId);
    }
  }
}
