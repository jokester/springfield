import { createPositionSnapshot, PositionSnapshot } from './positional-transition';

const snapshots = new Map</* logicalId */ string, Map</* physicalId */ string, PositionSnapshot>>();

export function saveSnapshot(logicalId: string, physicalId: string, elem: HTMLElement) {
  const innerMap = snapshots.get(logicalId);
  if (innerMap) {
    innerMap.set(physicalId, createPositionSnapshot(elem));
  } else {
    snapshots.set(logicalId, new Map([[physicalId, createPositionSnapshot(elem)]] as const));
  }
}

export function findSnapshot(logicalId: string, physicalId: string): null | PositionSnapshot {
  let found;
  if ((found = snapshots.get(logicalId))) {
    for (const [pId, snapshot] of found.entries()) {
      if (pId !== physicalId && snapshot) return snapshot;
    }
  }
  return null;
}
