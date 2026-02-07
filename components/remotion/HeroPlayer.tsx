'use client'

import { Player } from '@remotion/player'
import { RoomTransformComposition } from './RoomTransform'

export function HeroPlayer() {
  return (
    <div className="w-full aspect-[16/9] md:aspect-[2.2/1] rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/50">
      <Player
        component={RoomTransformComposition}
        durationInFrames={150}
        fps={30}
        compositionWidth={1200}
        compositionHeight={540}
        style={{ width: '100%', height: '100%' }}
        loop
        autoPlay
        controls={false}
      />
    </div>
  )
}
