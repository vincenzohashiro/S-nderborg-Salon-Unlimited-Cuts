import React from "react";
import {
  Scissors, Baby, Droplet, Flame, Gift,
  type LucideProps,
} from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

type LucideIcon = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
type CustomIcon = (props: Omit<LucideProps, "ref">) => React.ReactElement;
type Icon = LucideIcon | CustomIcon;

// Render a custom SVG icon from raw SVG path strings using dangerouslySetInnerHTML.
// Only strokeWidth and className are forwarded — no other LucideProps bleed into the DOM.
const makeIcon = (svgContent: string): CustomIcon =>
  ({ strokeWidth = 1.5, className }: Omit<LucideProps, "ref">) =>
    React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: 24,
      height: 24,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className,
      dangerouslySetInnerHTML: { __html: svgContent },
    });

// ── Custom icons ────────────────────────────────────────────────────────────

const BeardIcon = makeIcon(
  '<path d="M8 9c0-1.5.8-2.5 2-2.5.7 0 1.4.4 2 1.2.6-.8 1.3-1.2 2-1.2 1.2 0 2 1 2 2.5"/>' +
  '<path d="M7 10.5c0 5.5 2 8.5 5 8.5s5-3 5-8.5"/>' +
  '<path d="M10.5 14.5l-.5 3.5"/>' +
  '<path d="M12 15v3.5"/>' +
  '<path d="M13.5 14.5l.5 3.5"/>',
);

const ScissorBeardIcon = makeIcon(
  '<circle cx="5" cy="7" r="2"/>' +
  '<circle cx="5" cy="15" r="2"/>' +
  '<path d="M6.5 8.5L11 12.5"/>' +
  '<path d="M6.5 13.5L11 9.5"/>' +
  '<circle cx="18" cy="8" r="3"/>' +
  '<path d="M15 11c0 4 1.3 6.5 3 6.5s3-2.5 3-6.5"/>' +
  '<path d="M16.5 14l-.4 3"/>' +
  '<path d="M18 14.5v3"/>' +
  '<path d="M19.5 14l.4 3"/>',
);

const ElderlyIcon = makeIcon(
  '<circle cx="9" cy="4" r="2"/>' +
  '<path d="M9 6v7"/>' +
  '<path d="M6.5 9.5h5"/>' +
  '<path d="M7.5 13l-2 7"/>' +
  '<path d="M10.5 13l2 7"/>' +
  '<path d="M16 5c0-1.5-.8-2.5-2-2.5"/>' +
  '<path d="M14 2.5l-1 17"/>' +
  '<path d="M13 19.5h3"/>',
);

const ClipperIcon = makeIcon(
  '<rect x="7" y="2" width="10" height="13" rx="2.5"/>' +
  '<path d="M7 12h10"/>' +
  '<path d="M9 12v5"/>' +
  '<path d="M11 12v6"/>' +
  '<path d="M13 12v6"/>' +
  '<path d="M15 12v5"/>' +
  '<circle cx="12" cy="7" r="2"/>',
);

// ── Icon map ─────────────────────────────────────────────────────────────────

const ICONS: Record<string, Icon> = {
  // Standard Lucide
  scissors:           Scissors,
  baby:               Baby,
  droplet:            Droplet,
  flame:              Flame,
  gift:               Gift,
  // Custom
  beard:              BeardIcon,
  "scissors-beard":   ScissorBeardIcon,
  elderly:            ElderlyIcon,
  clipper:            ClipperIcon,
  // Legacy aliases — keeps old published configs working
  user:               BeardIcon,
  sparkles:           ScissorBeardIcon,
  crown:              ElderlyIcon,
};

export const getIcon = (name: string): Icon => ICONS[name] ?? Scissors;
