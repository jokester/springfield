import React, { useEffect, useRef, useState, useCallback } from 'react';
import { findSnapshot, saveSnapshot } from './snapshots';
import { computeInvertTransformStyle, createPositionSnapshot, PositionSnapshot } from './positional-transition';

interface SharedElemProps {
  children(
    // merge with user's style. DO NOT overwrite visibility / transform / transition
    extraStyle: React.CSSProperties,
    // pass to DOM element
    ref: React.MutableRefObject<any>,
    // a callback to  e.g. in scroll/click handler
    takeSnapshot: () => void,
  ): React.ReactElement;
  logicalId: string;
  instanceId: string;
  transition?: string;

  isTarget?: boolean;
}

const defaultExtraStyle: React.CSSProperties = {
  visibility:
    typeof window !== 'undefined'
      ? /* browser rendering: layout but not shown */ 'hidden'
      : /* SSR: as usual */ undefined,
};

const defaultTransition = 'all 0.3s';

export const SharedElement: React.FC<SharedElemProps> = props => {
  const ref = useRef<HTMLElement>(null!);
  // initial
  const [extraStyle, setExtraStyle] = useState<React.CSSProperties>(defaultExtraStyle);

  const takeSnapshot = useCallback(() => {
    if (ref.current instanceof HTMLElement && props.logicalId && props.instanceId)
      saveSnapshot(props.logicalId, props.instanceId, ref.current);
  }, [props.logicalId, props.instanceId]);

  useEffect(() => {
    let effecting = true;
    let matchedSnapshot;

    if (props.logicalId && props.instanceId && ref.current instanceof HTMLElement) {
      takeSnapshot();

      if (ref.current && props.isTarget && (matchedSnapshot = findSnapshot(props.logicalId, props.instanceId))) {
        const elem = ref.current;
        const layouted = createPositionSnapshot(ref.current);

        if (!(matchedSnapshot.width && matchedSnapshot.height && layouted.width && layouted.height)) return;

        // inverted
        setExtraStyle(computeInvertTransformStyle(layouted, matchedSnapshot));

        requestAnimationFrame(() => {
          if (effecting) {
            // transitioning
            setExtraStyle({ transition: props.transition || defaultTransition });
            const tidyUp = () => {
              if (effecting) {
                // cleared
                setExtraStyle({});
              }
              elem.removeEventListener('transitionend', tidyUp);
            };
            elem.addEventListener('transitionend', tidyUp);
          }
        });
      } else {
        setExtraStyle({});
      }
    }

    return () => {
      effecting = false;
    };
  }, [props.isTarget, props.logicalId, props.instanceId, props.transition, takeSnapshot]);

  return props.children(extraStyle, ref, takeSnapshot);
};
