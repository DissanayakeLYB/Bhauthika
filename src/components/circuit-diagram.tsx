import { cn } from '@/lib/utils';

/** Potentiometer schematic used by the Current Electricity past-paper item. */
export function PotentiometerDiagram({ className }: { className?: string }) {
  return (
    <figure
      className={cn(
        'overflow-hidden rounded-tile border border-border-strong/50 bg-surface p-2.5',
        className,
      )}
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(199,197,210,0.28) 1px, transparent 1px), linear-gradient(to bottom, rgba(199,197,210,0.28) 1px, transparent 1px)',
        backgroundSize: '16px 16px',
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-border-strong/30 bg-white/90 px-1.5 py-0.5 text-label-sm text-ink-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-mid" aria-hidden="true" />
          FIG 1.1: POTENTIOMETER SETUP
        </span>
        <span className="text-label-sm text-ink-muted">L = 100 cm</span>
      </div>

      <svg
        viewBox="0 0 290 64"
        className="my-1 h-auto w-full max-w-full"
        role="img"
        aria-label="Potentiometer circuit: a 2 volt cell with 1 ohm internal resistance in series with a 1 ohm resistor and a 100 centimetre, 10 ohm wire between points A and B, with a galvanometer tapping the wire."
      >
        <path
          d="M 40 40 L 40 14 L 110 14"
          stroke="#464650"
          strokeLinecap="round"
          strokeWidth="1.75"
          fill="none"
        />
        <line x1="110" x2="110" y1="7" y2="21" stroke="#070B57" strokeWidth="2" />
        <line x1="115" x2="115" y1="10" y2="18" stroke="#464650" strokeWidth="1.5" />
        <text x="104" y="6" fill="#070B57" className="font-display text-[8px] font-semibold">
          2V, 1Ω
        </text>
        <path d="M 115 14 L 170 14" stroke="#464650" strokeWidth="1.75" fill="none" />
        <path
          d="M 170 14 L 175 10 L 180 18 L 185 10 L 190 18 L 195 14 L 250 14 L 250 40"
          fill="none"
          stroke="#464650"
          strokeWidth="1.75"
        />
        <text x="188" y="6" fill="#636A7E" className="font-display text-[8px]">
          r = 1Ω
        </text>
        <line
          x1="40"
          x2="250"
          y1="40"
          y2="40"
          stroke="#070B57"
          strokeLinecap="round"
          strokeWidth="3.5"
        />
        <circle cx="40" cy="40" r="3" fill="#20256B" />
        <circle cx="250" cy="40" r="3" fill="#20256B" />
        <text x="34" y="55" fill="#070B57" className="font-display text-[10px]">
          A
        </text>
        <text x="252" y="55" fill="#070B57" className="font-display text-[10px]">
          B
        </text>
        <text x="112" y="53" fill="#3B3F9E" className="font-display text-[9px]">
          10 Ω (100 cm)
        </text>
        <path d="M 145 40 L 145 35" stroke="#D64545" strokeDasharray="2 2" strokeWidth="1.5" />
        <circle cx="145" cy="40" r="2" fill="#D64545" />
        <text x="148" y="36" fill="#B3261E" className="font-display text-[7px]">
          G
        </text>
      </svg>

      <figcaption className="flex justify-between gap-2 border-t border-border-strong/30 pt-1 text-label-sm text-ink-muted">
        <span>R_wire = 10 Ω</span>
        <span>E = 2.0 V · r = 1.0 Ω</span>
      </figcaption>
    </figure>
  );
}
