import React, { useState } from 'react';
import { SharedElement } from '../src';

export const ListDetailExample: React.FC = () => {
  const users = ['alice', 'bob', 'cindy', 'daniel', 'frank'];

  const [showingUser, setShowingUser] = useState<null | string>(null);

  return (
    <div className="p-4">
      <h1 className="text-2xl">list-detail example</h1>
      <div className="h-12">
        {showingUser ? (
          <button className="border-2" onClick={() => setShowingUser('')}>
            back to list
          </button>
        ) : (
          <button className="border-2" disabled>
            click a user
          </button>
        )}
      </div>
      <div className="h-64 flex flex-wrap items-start">
        {!showingUser &&
          users.map((userName, index) => (
            <SharedElement logicalId={`user-avatar-${userName}`} instanceId="in-list" key={index}>
              <div
                key={index}
                onClick={() => setShowingUser(userName)}
                className="inline-block h-16 w-16 bg-blue-500 mr-4 rounded-full text-white font-bold flex justify-center items-center"
              >
                <span>{userName}</span>
              </div>
            </SharedElement>
          ))}
        {showingUser && (
          <div className="flex w-full items-center">
            <SharedElement logicalId={`user-avatar-${showingUser}`} instanceId="in-detail" isTarget>
              <div className="inline-block h-32 w-32 bg-blue-500 mr-4 rounded-full" />
            </SharedElement>
            {showingUser}
          </div>
        )}
      </div>
    </div>
  );
};
