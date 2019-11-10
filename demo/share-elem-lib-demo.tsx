import React, { useState } from 'react';
import { SharedElement } from '../src/shared-elem';

const styles = {
  button: `p-2 inline-block border border-solid shadow-outline focus:outline-0`,
  verticalContainer: `flex p-4 justify-around`,

  mainContent: 'h-64 bg-gray-100',
  expandedRegion: 'w-48 h-36 border-solid border inline-block bg-gray-200 mx-4 text-xs whitespace-pre-line',
} as const;

const ButtonsBar: React.FC<{ currentTab: number; setCurrentTab(t: number): void }> = ({
  setCurrentTab,
  currentTab,
}) => {
  return (
    <p className={styles.verticalContainer}>
      <SharedElement logicalId="tab1" instanceId="btn" isTarget={currentTab !== 1}>
        <button className={styles.button} onClick={() => setCurrentTab(1)}>
          tab1
        </button>
      </SharedElement>

      {/* when children is a React.Element for DOM element, SharedElement overrides its ref/style properties */}
      <SharedElement logicalId="tab2" instanceId="btn" isTarget={currentTab !== 2}>
        <button className={styles.button} onClick={() => setCurrentTab(2)}>
          tab2
        </button>
      </SharedElement>

      <SharedElement logicalId="tab3" instanceId="btn">
        <button className={styles.button} onClick={() => setCurrentTab(3)}>
          tab2
        </button>
      </SharedElement>
    </p>
  );
};

export const ShareElemLibPlayground: React.FC = props => {
  const [currentTab, setCurrentTab] = useState(1);
  return (
    <div>
      <ButtonsBar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <p>currentTab={currentTab}</p>

      {currentTab === 2 && (
        /* when children is a function, SharedElements passes style/ref/callbacks  to to it, and return its return value  */ <SharedElement
          logicalId="tab2"
          instanceId="main"
          isTarget
        >
          {(style, callbacks, phase, ref) => (
            <div
              className={styles.mainContent}
              style={style}
              ref={ref}
              onClick={() => {
                callbacks.takeSnapshot();
                setCurrentTab(1);
              }}
            >
              {phase}
            </div>
          )}
        </SharedElement>
      )}
    </div>
  );
};
