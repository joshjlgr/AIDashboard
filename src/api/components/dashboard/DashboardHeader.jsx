import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function DashboardHeader() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hour = time.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
    >
      <div>
        <p className="text-sm font-medium text-primary/70 tracking-wide uppercase">
          {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mt-1">
          {greeting} ✨
        </h1>
      </div>
      <div className="text-right">
        <p className="text-4xl sm:text-5xl font-light text-foreground/80 tabular-nums tracking-tight">
          {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
        </p>
      </div>
    </motion.div>
  );
}