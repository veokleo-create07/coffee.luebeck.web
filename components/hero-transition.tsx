import type { ReactNode } from "react";

type HeroTransitionProps = {
  hero: ReactNode;
  next: ReactNode;
};

export function HeroTransition({ hero, next }: HeroTransitionProps) {
  return <>{hero}{next}</>;
}
