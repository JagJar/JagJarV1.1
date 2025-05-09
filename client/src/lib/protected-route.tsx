import React from "react";
import { Loader2 } from "lucide-react";
import { Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  // Return a route with a special render function without checking auth
  // This is a temporary solution until we have a more reliable auth system
  return (
    <Route path={path}>
      {() => <Component />}
    </Route>
  );
}
