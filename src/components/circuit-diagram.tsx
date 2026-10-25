import { cn } from '@/lib/utils';

/**
 * Potentiometer schematic used by the Current Electricity past-paper item.
 * Drawn with the palette colours only: muted wires, ink marks, no other hues.
 */
export function PotentiometerDiagram({ className }: { className?: string }) {
  return (
    <figure
      className={cn('overflow-hidden rounded-xs border border-line bg-bg p-4', className)}
      style={{
        backgroundImage:
          'linear-gradient(to right, #26262A 1px, transparent 1px), linear-gradient(to bottom, #26262A 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono text-label tracking-[0.14em] text-muted uppercase">
          Fig 1.1 · Potentiometer
        </span>
        <span className="font-mono text-label tracking-[0.14em] text-muted uppercase">L = 100 cm</span>
      </div>

      <svg
        viewBox="0 0 290 64"
        className="my-3 h-auto w-full max-w-full"
        role="img"
        aria-label="Potentiometer circuit: a 2 volt cell with 1 ohm internal resistance in series with a 1 ohm resistor and a 100 centimetre, 10 ohm wire between points A and B, with a galvanometer tapping the wire."
      >
        <path
          d="M 40 40 L 40 14 L 110 14"
          stroke="#8A8A86"
          strokeLinecap="round"
          strokeWidth="1.5"
          fill="none"
        />
        <line x1="110" x2="110" y1="7" y2="21" stroke="#ECECEA" strokeWidth="2" />
        <line x1="115" x2="115" y1="10" y2="18" stroke="#8A8A86" strokeWidth="1.5" />
        <text x="104" y="6" fill="#ECECEA" className="font-mono text-[8px]">
          2V, 1Ω
        </text>
        <path d="M 115 14 L 170 14" stroke="#8A8A86" strokeWidth="1.5" fill="none" />
        <path
          d="M 170 14 L 175 10 L 180 18 L 185 10 L 190 18 L 195 14 L 250 14 L 250 40"
          fill="none"
          stroke="#8A8A86"
          strokeWidth="1.5"
        />
        <text x="186" y="6" fill="#8A8A86" className="font-mono text-[8px]">
          r = 1Ω
        </text>
        <line
          x1="40"
          x2="250"
          y1="40"
          y2="40"
          stroke="#ECECEA"
          strokeLinecap="round"
          strokeWidth="3"
        />
        <circle cx="40" cy="40" r="2.5" fill="#ECECEA" />
        <circle cx="250" cy="40" r="2.5" fill="#ECECEA" />
        <text x="35" y="55" fill="#ECECEA" className="font-mono text-[10px]">
          A
        </text>
        <text x="252" y="55" fill="#ECECEA" className="font-mono text-[10px]">
          B
        </text>
        <text x="112" y="53" fill="#8A8A86" className="font-mono text-[9px]">
          10 Ω (100 cm)
        </text>
        <path d="M 145 40 L 145 35" stroke="#8A8A86" strokeDasharray="2 2" strokeWidth="1.5" />
        <circle cx="145" cy="40" r="2" fill="#8A8A86" />
        <text x="148" y="36" fill="#8A8A86" className="font-mono text-[7px]">
          G
        </text>
      </svg>

      <figcaption className="flex justify-between gap-2 border-t border-line pt-2 font-mono text-label tracking-[0.14em] text-muted uppercase">
        <span>R_wire = 10 Ω</span>
        <span>E = 2.0 V · r = 1.0 Ω</span>
      </figcaption>
    </figure>
  );
}
