import React from "react";
import { Sidebar, SidebarHeader, SidebarNav, SidebarNavItem, SidebarFooter } from "@/components/ui/sidebar";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { BarChart3, KeyRound, Code, DollarSign, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar className="w-64 hidden md:flex">
        <SidebarHeader>
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-md gradient-bg flex items-center justify-center">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <span className="font-bold text-xl">JagJar</span>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarNav>
          <SidebarNavItem href="/dashboard" icon={BarChart3}>
            Dashboard
          </SidebarNavItem>
          <SidebarNavItem href="/dashboard/api-keys" icon={KeyRound}>
            API Keys
          </SidebarNavItem>
          <SidebarNavItem href="/dashboard/integration" icon={Code}>
            Integration
          </SidebarNavItem>
          <SidebarNavItem href="/dashboard/earnings" icon={DollarSign}>
            Earnings
          </SidebarNavItem>
          <SidebarNavItem href="/dashboard/settings" icon={Settings}>
            Settings
          </SidebarNavItem>
        </SidebarNav>
        <SidebarFooter>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-xs font-medium">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="text-sm font-medium truncate">
                {user?.username || 'User'}
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout} 
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </div>
    </div>
  );
}
