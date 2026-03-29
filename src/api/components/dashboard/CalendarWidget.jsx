import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const today = new Date();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const isToday = (day) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const isSelected = (day) =>
    day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear();

  const days = [];
  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: daysInPrevMonth - i, current: false });
  }
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, current: true });
  }
  // Next month leading days
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({ day: i, current: false });
  }

  return (
    <Card className="h-full border-0 shadow-lg overflow-hidden">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            {MONTHS[month]} {year}
          </h2>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8 rounded-lg">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8 rounded-lg">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map(d => (
            <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((d, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => d.current && setSelectedDate(new Date(year, month, d.day))}
              className={`
                h-9 w-full rounded-lg text-sm font-medium transition-all
                ${!d.current ? 'text-muted-foreground/30' : 'text-foreground hover:bg-secondary'}
                ${d.current && isToday(d.day) && !isSelected(d.day) ? 'bg-accent/10 text-accent font-bold' : ''}
                ${d.current && isSelected(d.day) ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : ''}
              `}
            >
              {d.day}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Selected date info */}
      <div className="px-5 pb-5 pt-2">
        <div className="bg-secondary/50 rounded-xl p-4">
          <p className="text-sm font-medium text-foreground">
            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {isToday(selectedDate.getDate()) && month === selectedDate.getMonth() 
              ? "Today — Make it count! ✨" 
              : "Select a date to plan ahead"}
          </p>
        </div>
      </div>
    </Card>
  );
}