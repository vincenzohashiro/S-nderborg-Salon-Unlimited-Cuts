import {
  Scissors, User, Sparkles, Crown, Baby, Droplet, Flame, Gift,
  type LucideProps,
} from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

type Icon = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;

const ICONS: Record<string, Icon> = {
  scissors: Scissors,
  user: User,
  sparkles: Sparkles,
  crown: Crown,
  baby: Baby,
  droplet: Droplet,
  flame: Flame,
  gift: Gift,
};

export const getIcon = (name: string): Icon => ICONS[name] ?? Scissors;
