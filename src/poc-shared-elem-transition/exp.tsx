import React, { useState } from 'react';
import { Button, tailwind } from '../tailwind/components';
import { SharedElement } from './shared-elem';

const componentClasses = {
  tabHeader: `flex items-center justify-end p-4 `,
  userIcon: `flex-none inline-block w-24 h-24 border-solid border bg-gray-200`,
  tabContent: `h-64`,
  mainContent: 'h-64 bg-gray-100',
  userAvatar: 'w-40 h-40 border-solid border inline-block bg-gray-200 mx-4',
} as const;

export const ShareElemPlayground: React.FC = props => {
  const [currentTab, setCurrentTab] = useState<1 | 2 | 3>(1);
  return (
    <div>
      <p className={tailwind.verticalContainer}>
        <Button title="tab1" onClick={() => setCurrentTab(1)} />
        <Button title="tab2" onClick={() => setCurrentTab(2)} />
      </p>

      {currentTab === 1 && (
        <div>
          <div className={componentClasses.tabContent}>
            <SharedElement logicalId="user" instanceId="tab" isTarget>
              {(style, ref) => <div className={componentClasses.userIcon} ref={ref} style={style} />}
            </SharedElement>
          </div>
          <div className={componentClasses.mainContent}>
            <p>page1</p>
          </div>
        </div>
      )}
      {currentTab === 2 && (
        <div>
          <div className={componentClasses.tabContent}>{/*<div className={componentClasses.userIcon} />*/}</div>
          <div className={componentClasses.mainContent}>
            <p>page2</p>
            <SharedElement logicalId="user" instanceId="main" isTarget>
              {(style, ref, takeSnapshot) => (
                <div
                  className={componentClasses.userAvatar}
                  ref={ref}
                  style={style}
                  onClick={() => {
                    // takeSnapshot();
                    setCurrentTab(1);
                  }}
                />
              )}
            </SharedElement>
          </div>
        </div>
      )}
    </div>
  );
};
