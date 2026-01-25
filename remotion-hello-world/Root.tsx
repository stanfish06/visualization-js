import React from 'react';
import {Composition} from 'remotion';
import {MyComposition} from './Composition';
 
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BouncingBall"
        component={MyComposition}
        durationInFrames={600}
        fps={60}
        width={1280}
        height={720}
      />
    </>
  );
};
