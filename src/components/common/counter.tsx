"use client";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

type CounterProps = {
  value: number;
  className?: string;
};

export function Counter({ value, className }: CounterProps) {
  const [oldVal, setOldVal] = useState(0);
  const count = useMotionValue(oldVal);
  const rounded = useTransform(count, (latest) => {
    return Math.round(latest);
  });
  const ref = useRef(null);
  const inView = useInView(ref);

  // while in view animate the count
  useEffect(() => {
    if (inView) {
      animate(count, value, { duration: 0.3 }).then(() => setOldVal(value));
    }
  }, [count, inView, value]);

  return (
    <motion.span ref={ref} className={className}>
      {rounded}
    </motion.span>
  );
}
