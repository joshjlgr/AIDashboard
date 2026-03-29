import React from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import CalendarWidget from '../components/dashboard/CalendarWidget';
import NotesWidget from '../components/dashboard/NotesWidget';
import SearchWidget from '../components/dashboard/SearchWidget';
import AIAssistant from '../components/dashboard/AIAssistant';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <DashboardHeader />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column — AI Assistant */}
          <div className="lg:col-span-4 xl:col-span-4">
            <div className="h-[600px] lg:h-[calc(100vh-220px)]">
              <AIAssistant />
            </div>
          </div>

          {/* Right column — Calendar, Notes, Search */}
          <div className="lg:col-span-8 xl:col-span-8 space-y-6">
            {/* Top row — Calendar + Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CalendarWidget />
              <div className="h-[420px]">
                <NotesWidget />
              </div>
            </div>

            {/* Bottom — Search */}
            <div className="h-[300px] lg:h-[calc(100vh-670px)]">
              <SearchWidget />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}