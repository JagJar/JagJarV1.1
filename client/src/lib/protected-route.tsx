import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading } = useAuth();
  console.log("ProtectedRoute check - User:", user);
  console.log("ProtectedRoute check - Path:", path);

  return (
    <Route path={path}>
      {() => <Component />}
    </Route>
  );
}
