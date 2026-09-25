import { FaFan } from 'react-icons/fa';

// Decorative ocean waves. Motion is decorative only — never financial data.
export function OceanWaveBackground({ className = '' }) {
  const Wave = ({ offset = 0, opacity = 0.25, slow = false, color = '#00E5FF' }) => (
    <svg
      className={`absolute bottom-0 left-0 w-[200%] ${slow ? 'animate-wave-slow' : 'animate-wave'}`}
      style={{ opacity, animationDelay: `${offset}s` }}
      viewBox="0 0 2880 120"
      preserveAspectRatio="none"
    >
      <path
        d="M0,64 C240,96 480,32 720,48 C960,64 1200,96 1440,80 C1680,64 1920,32 2160,48 C2400,64 2640,96 2880,80 L2880,120 L0,120 Z"
        fill={color}
      />
      <path
        d="M-1440,64 C-1200,96 -960,32 -720,48 C-480,64 -240,96 0,80 C240,64 480,32 720,48 C960,64 1200,96 1440,80 L1440,120 L-1440,120 Z"
        fill={color}
      />
    </svg>
  );
  return (
    <div className={`pointer-events-none absolute inset-x-0 bottom-0 h-40 overflow-hidden ${className}`} aria-hidden="true">
      <div className="relative h-full w-full">
        <Wave opacity={0.12} />
        <Wave offset={-6} opacity={0.1} slow color="#0D1B4B" />
        <Wave offset={-12} opacity={0.16} slow />
      </div>
    </div>
  );
}

// Spinning turbine icon for turbine cards.
export function TurbineSpin({ size = 44, className = '' }) {
  return (
    <div
      className={`flex items-center justify-center rounded-full border border-aqua/30 bg-aqua/10 ${className}`}
      style={{ width: size, height: size }}
    >
      <FaFan className="animate-spin-slow text-aqua" style={{ width: size * 0.55, height: size * 0.55 }} />
    </div>
  );
}
