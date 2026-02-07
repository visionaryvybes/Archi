'use client'

import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence } from 'remotion'

// Room wireframe that transforms into a rendered room
function RoomWireframe({ progress }: { progress: number }) {
  const opacity = interpolate(progress, [0, 0.3], [1, 0], { extrapolateRight: 'clamp' })

  return (
    <div style={{ position: 'absolute', inset: 0, opacity }}>
      <svg viewBox="0 0 400 300" width="100%" height="100%" fill="none" stroke="#3f3f46" strokeWidth={1}>
        {/* Floor */}
        <line x1="60" y1="220" x2="340" y2="220" />
        <line x1="60" y1="220" x2="20" y2="280" />
        <line x1="340" y1="220" x2="380" y2="280" />
        <line x1="20" y1="280" x2="380" y2="280" />

        {/* Back wall */}
        <line x1="60" y1="60" x2="340" y2="60" />
        <line x1="60" y1="60" x2="60" y2="220" />
        <line x1="340" y1="60" x2="340" y2="220" />

        {/* Side walls perspective */}
        <line x1="60" y1="60" x2="20" y2="20" />
        <line x1="340" y1="60" x2="380" y2="20" />
        <line x1="20" y1="20" x2="380" y2="20" />

        {/* Window */}
        <rect x="140" y="80" width="120" height="80" rx="2" />
        <line x1="200" y1="80" x2="200" y2="160" />
        <line x1="140" y1="120" x2="260" y2="120" />

        {/* Sofa outline */}
        <rect x="100" y="170" width="120" height="45" rx="4" />
        <rect x="96" y="160" width="128" height="14" rx="4" />

        {/* Table */}
        <ellipse cx="290" cy="200" rx="30" ry="15" />
        <line x1="290" y1="215" x2="290" y2="240" />
      </svg>
    </div>
  )
}

// Rendered room with color fills
function RenderedRoom({ progress }: { progress: number }) {
  const opacity = interpolate(progress, [0.2, 0.6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <div style={{ position: 'absolute', inset: 0, opacity }}>
      {/* Floor */}
      <div style={{
        position: 'absolute',
        bottom: '6%',
        left: '5%',
        right: '5%',
        height: '20%',
        background: 'linear-gradient(180deg, #1c1917 0%, #292524 100%)',
        borderRadius: 4,
      }} />

      {/* Back wall */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '15%',
        right: '15%',
        height: '54%',
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
        borderRadius: 4,
      }} />

      {/* Window with light */}
      <div style={{
        position: 'absolute',
        top: '27%',
        left: '35%',
        width: '30%',
        height: '27%',
        background: 'linear-gradient(180deg, #2d1b69 0%, #44337a 40%, #553c9a 100%)',
        borderRadius: 4,
        boxShadow: '0 0 60px rgba(167, 139, 250, 0.15)',
      }}>
        <div style={{
          position: 'absolute',
          inset: 2,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: 2,
        }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{
              background: `linear-gradient(${135 + i * 30}deg, rgba(167, 139, 250, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)`,
              borderRadius: 2,
            }} />
          ))}
        </div>
      </div>

      {/* Sofa */}
      <div style={{
        position: 'absolute',
        bottom: '25%',
        left: '25%',
        width: '30%',
        height: '15%',
        background: 'linear-gradient(180deg, #374151 0%, #1f2937 100%)',
        borderRadius: 8,
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}>
        {/* Cushions */}
        <div style={{
          position: 'absolute',
          top: -10,
          left: 4,
          right: 4,
          height: 14,
          background: 'linear-gradient(180deg, #4b5563 0%, #374151 100%)',
          borderRadius: '6px 6px 2px 2px',
        }} />
      </div>

      {/* Side table */}
      <div style={{
        position: 'absolute',
        bottom: '25%',
        right: '18%',
        width: '15%',
        height: '8%',
        background: '#292524',
        borderRadius: '50%',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
      }} />

      {/* Plant */}
      <div style={{
        position: 'absolute',
        bottom: '32%',
        right: '21%',
        width: 8,
        height: 24,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #059669 0%, #047857 100%)',
        }} />
        <div style={{ width: 3, height: 12, background: '#78716c' }} />
      </div>

      {/* Rug */}
      <div style={{
        position: 'absolute',
        bottom: '8%',
        left: '22%',
        width: '35%',
        height: '12%',
        background: 'linear-gradient(90deg, rgba(167, 139, 250, 0.08) 0%, rgba(139, 92, 246, 0.12) 50%, rgba(167, 139, 250, 0.08) 100%)',
        borderRadius: 4,
        border: '1px solid rgba(167, 139, 250, 0.1)',
      }} />
    </div>
  )
}

// Style label that appears
function StyleLabel({ progress }: { progress: number }) {
  const opacity = interpolate(progress, [0.5, 0.7], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <div style={{
      position: 'absolute',
      bottom: 16,
      right: 16,
      opacity,
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 12px',
      background: 'rgba(9, 9, 11, 0.8)',
      borderRadius: 8,
      border: '1px solid rgba(63, 63, 70, 0.5)',
    }}>
      <div style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: '#a78bfa',
      }} />
      <span style={{
        fontSize: 11,
        color: '#a1a1aa',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        Modern Minimalist
      </span>
    </div>
  )
}

// Scan line effect during transformation
function ScanLine({ progress }: { progress: number }) {
  const lineY = interpolate(progress, [0.15, 0.55], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const opacity = interpolate(progress, [0.15, 0.2, 0.5, 0.55], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <div style={{
      position: 'absolute',
      left: 0,
      right: 0,
      top: `${lineY}%`,
      height: 2,
      opacity,
      background: 'linear-gradient(90deg, transparent 0%, #a78bfa 20%, #8b5cf6 50%, #a78bfa 80%, transparent 100%)',
      boxShadow: '0 0 20px rgba(167, 139, 250, 0.4)',
      zIndex: 10,
    }} />
  )
}

export function RoomTransformComposition() {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  // Progress from 0 to 1 over the animation
  const progress = interpolate(frame, [0, durationInFrames * 0.8], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{
      background: '#09090b',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid #27272a',
        background: '#0c0c0e',
      }}>
        <RoomWireframe progress={progress} />
        <ScanLine progress={progress} />
        <RenderedRoom progress={progress} />
        <StyleLabel progress={progress} />
      </div>
    </AbsoluteFill>
  )
}
