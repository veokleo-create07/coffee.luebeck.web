import type { ReactNode } from "react";

type HeroTransitionProps = { hero: ReactNode; next: ReactNode };

export function HeroTransition({ hero, next }: HeroTransitionProps) {
  return (
    <div className="hero-transition-scene">
      <div className="hero-transition-hero">{hero}</div>
      <div className="hero-transition-incoming">{next}</div>
    </div>
  );
}
