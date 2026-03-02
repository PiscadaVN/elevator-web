import { useEffect } from "react";
import {
  createFileRoute,
  Outlet,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { AlertCircle, Languages, LayoutDashboard, Users } from "lucide-react";

export const Route = createFileRoute("/(dashboard)")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = location.pathname;

  const { user, isLoading } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    if (!user && !isLoading) {
      navigate({ to: "/login" });
    }
  }, [user, isLoading, navigate]);

  if (!user) {
    return null;
  }

  const isAdmin = user.role === "admin" || user.role === "super_admin";

  const handleNavigate = (path: string) => {
    navigate({ to: path });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <nav className="bg-white border-b px-8 py-2 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4 flex-1 justify-center">
          <Button
            variant={currentTab === "/dashboard" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleNavigate("/dashboard")}
            className="rounded-full"
          >
            <LayoutDashboard className="w-4 h-4 mr-2" /> {t("monitoring")}
          </Button>
          <Button
            variant={currentTab === "/dashboard/incident" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleNavigate("/dashboard/incident")}
            className="rounded-full"
          >
            <AlertCircle className="w-4 h-4 mr-2" /> {t("incidents")}
          </Button>
          {isAdmin && (
            <Button
              variant={currentTab === "/dashboard/user" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleNavigate("/dashboard/user")}
              className="rounded-full"
            >
              <Users className="w-4 h-4 mr-2" /> {t("users")}
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === "en" ? "vi" : "en")}
            className="rounded-full h-8 px-3"
          >
            <Languages className="w-4 h-4 mr-2" />
            <span className="text-xs font-bold uppercase">{language}</span>
          </Button>
        </div>
      </nav>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
