export declare type PositionSnapshot = (ClientRect | DOMRect) & {
    timestamp: number;
};
export declare function createPositionSnapshot(elem: HTMLElement): PositionSnapshot;
export declare type PositionalSnapshotStorage = Map<string, Map</* instanceId */ string, PositionSnapshot>>;
export declare function takePositionalSnapshot(storage: PositionalSnapshotStorage, logicalId: string, instanceId: string, elem: HTMLElement): void;
export declare function findPositionalSnapshot(storage: PositionalSnapshotStorage, logicalId: string, instanceId: string): null | PositionSnapshot;
export declare function removePositionalSnapshot(storage: PositionalSnapshotStorage, logicalId: string, instanceId: string): void;
