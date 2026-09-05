'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Map,
  Calendar,
  Recycle,
  Package,
  Leaf,
  BarChart,
  HeartHandshake,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Participants', href: '/dashboard/participants', icon: Users },
  { name: 'Schools', href: '/dashboard/schools', icon: GraduationCap },
  { name: 'Communities', href: '/dashboard/communities', icon: Map },
  { name: 'Events', href: '/dashboard/events', icon: Calendar },
  { name: 'Waste Tracking', href: '/dashboard/waste', icon: Recycle },
  { name: 'Inventory', href: '/dashboard/inventory', icon: Package },
  { name: 'Env Clubs', href: '/dashboard/clubs', icon: Leaf },
  { name: 'Reports', href: '/dashboard/reports', icon: BarChart },
  { name: 'Donations', href: '/dashboard/donations', icon: HeartHandshake },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-border justify-between">
          <Link href="/" className="flex items-center gap-2 text-primary font-bold text-lg">
            <Leaf className="w-5 h-5" />
            <span>ECO GIRLS COLLECTIVE</span>
          </Link>
          <button className="md:hidden text-muted-foreground" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col overflow-y-auto p-4 gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-card px-4 md:px-6 shadow-sm z-30">
          <button type="button" className="-m-2.5 p-2.5 text-muted-foreground md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end items-center">
            <p className="text-sm text-muted-foreground hidden sm:block">Open access</p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            key={pathname}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
