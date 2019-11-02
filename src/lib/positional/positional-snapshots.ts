export type PositionSnapshot = (ClientRect | DOMRect) & {
  timestamp: number;
};

export function createPositionSnapshot(elem: HTMLElement): PositionSnapshot {
  const timestamp = Date.now();
  const { left, right, top, bottom, width, height } = elem.getBoundingClientRect();
  return {
    timestamp,
    left,
    right,
    top,
    bottom,
    width,
    height,
  };
}

export declare type PositionalSnapshotStorage = Map<
  /* logicalId */ string,
  Map</* physicalId */ string, PositionSnapshot>
>;

export function takePositionalSnapshot(
  storage: PositionalSnapshotStorage,
  logicalId: string,
  physicalId: string,
  elem: HTMLElement,
) {
  const innerMap = storage.get(logicalId);
  if (innerMap) {
    innerMap.set(physicalId, createPositionSnapshot(elem));
  } else {
    storage.set(logicalId, new Map([[physicalId, createPositionSnapshot(elem)]]));
  }
}

export function findPositionalSnapshot(
  storage: PositionalSnapshotStorage,
  logicalId: string,
  physicalId: string,
): null | PositionSnapshot {
  let inner;
  if ((inner = storage.get(logicalId))) {
    for (const [pId, snapshot] of inner.entries()) {
      if (pId !== physicalId && snapshot) return snapshot;
    }
  }
  return null;
}

export function removePositionalSnapshot(storage: PositionalSnapshotStorage, logicalId: string, physicalId: string) {
  let inner;
  if ((inner = storage.get(logicalId))) {
    inner.delete(physicalId);
    if (!inner.size) {
      storage.delete(logicalId);
    }
  }
}
