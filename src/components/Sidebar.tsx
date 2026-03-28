"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Link as LinkIcon, Calendar, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Event Types", href: "/dashboard", icon: LinkIcon },
  { name: "Availability", href: "/dashboard/availability", icon: Clock },
  { name: "Meetings", href: "/dashboard/meetings", icon: Calendar },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r min-h-screen bg-gray-50/40 hidden md:block px-4 py-8">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
          C
        </div>
        <span className="font-semibold text-lg">CalendlyClone</span>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-8 left-4 right-4">
        <Link
          href="/demo"
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors"
        >
          <User className="h-4 w-4" />
          Public Page
        </Link>
      </div>
    </div>
  );
}
