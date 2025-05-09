import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Route, useLocation } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  // Return a route with a special render function
  return (
    <Route path={path}>
      {() => {
        // Show loading spinner while checking auth
        if (isLoading) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          );
        }

        // If user is authenticated, render the component
        if (user) {
          return <Component />;
        }
        
        // If no user, redirect to auth page (this keeps the route protected)
        console.log("ProtectedRoute: Not authenticated, redirecting to auth page");
        // Use direct window.location for more reliable redirect
        window.location.href = '/auth';
        return null;
      }}
    </Route>
  );
}
