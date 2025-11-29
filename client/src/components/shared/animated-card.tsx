import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface AnimatedCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  [key: string]: any;
}

export function AnimatedCard({ children, delay = 0, className = "", ...props }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className={`card-hover ${className}`} {...props}>
        {children}
      </Card>
    </motion.div>
  );
}
