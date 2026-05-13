import React from "react";
import {
  Scissors, Baby, Droplet, Flame, Gift,
  type LucideProps,
} from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

type LucideIcon = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
type CustomIcon = (props: Omit<LucideProps, "ref">) => React.ReactElement;
type Icon = LucideIcon | CustomIcon;

const mkSvg = (
  { strokeWidth = 1.5, className, ...rest }: Omit<LucideProps, "ref">,
  ...children: React.ReactElement[]
) =>
  React.createElement(
    "svg",
    {
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
      ...rest,
    },
    ...children,
  );

const p = (d: string) => React.createElement("path", { d });
const c = (cx: number, cy: number, r: number) => React.createElement("circle", { cx, cy, r });
const r = (x: number, y: number, width: number, height: number, rx: number) =>
  React.createElement("rect", { x, y, width, height, rx });

// Beard symbol — mustache arch + teardrop beard with hair strands
const BeardIcon: CustomIcon = (props) =>
  mkSvg(
    props,
    p("M8 9c0-1.5.8-2.5 2-2.5.7 0 1.4.4 2 1.2.6-.8 1.3-1.2 2-1.2 1.2 0 2 1 2 2.5"),
    p("M7 10.5c0 5 2 8 5 8s5-3 5-8"),
    p("M10.5 14.5l-.5 3.5"),
    p("M12 15v3.5"),
    p("M13.5 14.5l.5 3.5"),
  );

// Scissors (left) + beard face (right) side by side
const ScissorBeardIcon: CustomIcon = (props) =>
  mkSvg(
    props,
    c(5, 7, 2),
    c(5, 15, 2),
    p("M6.5 8.5L11 12.5"),
    p("M6.5 13.5L11 9.5"),
    c(18, 8, 3),
    p("M15 11c0 4 1.3 6.5 3 6.5s3-2.5 3-6.5"),
    p("M16.5 14l-.4 3"),
    p("M18 14.5v3"),
    p("M19.5 14l.4 3"),
  );

// Elderly person with walking cane
const ElderlyIcon: CustomIcon = (props) =>
  mkSvg(
    props,
    c(9, 4, 2),
    p("M9 6v7"),
    p("M6.5 9.5h5"),
    p("M7.5 13l-2 7"),
    p("M10.5 13l2 7"),
    p("M16 5c0-1.5-.8-2.5-2-2.5"),
    p("M14 2.5l-1 17"),
    p("M13 19.5h3"),
  );

// Electric hair clipper / trimmer
const ClipperIcon: CustomIcon = (props) =>
  mkSvg(
    props,
    r(7, 2, 10, 13, 2.5),
    p("M7 12h10"),
    p("M9 12v5"),
    p("M11 12v6"),
    p("M13 12v6"),
    p("M15 12v5"),
    c(12, 7, 2),
  );

const ICONS: Record<string, Icon> = {
  scissors:       Scissors,
  baby:           Baby,
  droplet:        Droplet,
  flame:          Flame,
  gift:           Gift,
  beard:          BeardIcon,
  "scissors-beard": ScissorBeardIcon,
  elderly:        ElderlyIcon,
  clipper:        ClipperIcon,
};

export const getIcon = (name: string): Icon => ICONS[name] ?? Scissors;
