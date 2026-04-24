import { useEffect, useRef, useState } from "react";

type AnimatedNumberProps = {
  value: number;
  durationMs?: number;
  className?: string;
  style?: React.CSSProperties;
};

export function AnimatedNumber({ value, durationMs = 700, className = "", style }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const previous = useRef(0);

  useEffect(() => {
    const start = performance.now();
    const from = previous.current;
    const to = value;

    let frame = 0;
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (to - from) * eased);
      setDisplayValue(current);

      if (progress < 1) {
        frame = requestAnimationFrame(step);
      } else {
        previous.current = to;
      }
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value, durationMs]);

  return <span className={className} style={style}>{displayValue}</span>;
}
