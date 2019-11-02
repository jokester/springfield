import React, { useEffect, useRef, useState, useCallback, useContext } from 'react';
import { SpringFieldContext } from './delegate';
import { defaultSpringfieldDelegate } from './default-delegate';

interface SharedElemProps {
  children(
    // merge with user's style. DO NOT overwrite visibility / transform / transition
    extraStyle: undefined | React.CSSProperties,
    // pass to DOM element FIXME: remove
    ref: React.MutableRefObject<any>,
    // a callback to take snapshot manually e.g. in scroll/click event handler
    takeSnapshot: () => void,
  ): React.ReactElement;

  /**
   * identifier of a logical element
   * @example "user-avatar"
   */
  logicalId: string;

  /**
   * identifier of a occurrence of a "logical element"
   * @example "in-toolbar" "in-profile-component"
   */
  instanceId: string;

  /**
   * transition spec when corresponded DOM element is mounted
   * @default '0.3s all ease-in'
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/transition
   */
  transition?: string;

  /**
   * apply transition to children on
   * @default false
   * (all SharedElement-rendered children are source of transitions)
   */
  isTarget?: boolean;
}

export const SharedElement: React.FC<SharedElemProps> = props => {
  const ref = useRef<HTMLElement>(null!);
  const delegate = useContext(SpringFieldContext) || defaultSpringfieldDelegate;

  const [extraStyle, setExtraStyle] = useState<undefined | React.CSSProperties>(() => {
    if (/* SSR */ typeof window === 'undefined') {
      return undefined;
    } else {
      return delegate.createInitialStyle(props.logicalId, props.instanceId);
    }
  });

  const takeSnapshot = useCallback(() => {
    if (ref.current instanceof HTMLElement && props.logicalId && props.instanceId)
      delegate.takeSnapshot(props.logicalId, props.instanceId, ref.current);
  }, [props.logicalId, props.instanceId, delegate]);

  useEffect(() => {
    takeSnapshot();

    let effecting = true;
    let elem: undefined | HTMLElement;
    let invertedTransform: undefined | React.CSSProperties;
    if (
      props.isTarget &&
      props.logicalId &&
      props.instanceId &&
      (elem = ref.current) instanceof HTMLElement &&
      (invertedTransform = delegate.createInvertedTransformStyle(props.logicalId, props.instanceId, ref.current))
    ) {
      setExtraStyle(invertedTransform);
      requestAnimationFrame(() => {
        if (effecting) {
          setExtraStyle(delegate.createInvertedTransformStyle(props.logicalId, props.instanceId, elem!));
          const tidyUp = () => {
            if (effecting) {
              setExtraStyle(undefined);
            }
            elem!.removeEventListener('transitionend', tidyUp);
          };
          elem!.addEventListener('transitionend', tidyUp);
        }
      });
    } else {
      setExtraStyle({});
    }

    return () => {
      effecting = false;
    };
  }, [props.isTarget, props.logicalId, props.instanceId, props.transition, takeSnapshot, delegate]);

  return props.children(extraStyle, ref, takeSnapshot);
};
