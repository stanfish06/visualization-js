import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

const BALL_SIZE = 60;
const BORDER = 8;
const PADDING = 40;
const SPEED = 3;

const INITIAL_X = 200;
const INITIAL_Y = 150;
const INITIAL_VX = 1;
const INITIAL_VY = 0.7;

function bounce(distance: number, min: number, max: number): number {
  const range = max - min;
  const period = 2 * range;
  let phase = ((distance % period) + period) % period;
  return phase > range ? max - (phase - range) : min + phase;
}

export const MyComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const boxLeft = PADDING;
  const boxTop = PADDING;
  const boxWidth = width - 2 * PADDING;
  const boxHeight = height - 2 * PADDING;

  const minX = boxLeft + BORDER + BALL_SIZE / 2;
  const maxX = boxLeft + boxWidth - BORDER - BALL_SIZE / 2;
  const minY = boxTop + BORDER + BALL_SIZE / 2;
  const maxY = boxTop + boxHeight - BORDER - BALL_SIZE / 2;

  const distanceX = INITIAL_VX * SPEED * frame;
  const distanceY = INITIAL_VY * SPEED * frame;

  const x = bounce(INITIAL_X + distanceX, minX, maxX);
  const y = bounce(INITIAL_Y + distanceY, minY, maxY);

  return (
    <AbsoluteFill style={{backgroundColor: '#1E1E1E'}}>
      <div
        style={{
          position: 'absolute',
          left: boxLeft,
          top: boxTop,
          width: boxWidth,
          height: boxHeight,
          border: `${BORDER}px solid #FFFFFF`,
          boxSizing: 'border-box',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: x - BALL_SIZE / 2,
          top: y - BALL_SIZE / 2,
          width: BALL_SIZE,
          height: BALL_SIZE,
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
        }}
      />
    </AbsoluteFill>
  );
};
