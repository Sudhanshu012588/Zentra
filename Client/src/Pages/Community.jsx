import React from 'react';
import Navbar from '../components/Navbar';
import LeftCommunity from '../components/Community/LeftCommunity';
import CreateCommunity from '../components/Community/CreateCommunity';
import ComunityInterface from '../components/Community/ComunityInterface';
import { useCommunityStore } from '../../store/CommunityState';

function Community() {
  const Action = useCommunityStore((state) => state.Action);

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-white">
      {/* Fixed Navbar */}
      <div className="h-[9vh] w-full z-10">
        <Navbar />
      </div>

      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Scroll independently */}
        <div className="w-fit h-[91vh] overflow-y-auto border-r border-gray-300 dark:border-gray-800 scroll-hide">
          <LeftCommunity />
        </div>

        {/* Right Content - Scroll independently */}
        <div className="flex-1 h-[91vh] overflow-y-auto z-2">
          {Action === 'CreateCommunity' ? <CreateCommunity /> : <ComunityInterface />}
        </div>
      </div>
    </div>
  );
}

export default Community;
