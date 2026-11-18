import { createBrowserRouter, type RouteObject } from "react-router-dom";
import AuthOnlyLayout from "@/common/components/layouts/AuthOnlyLayout";
import ProtectedLayout from "@/common/components/layouts/ProtectedLayout";
import PublicLayout from "@/common/components/layouts/PublicLayout";
import NotFound from "@/screens/not-found/NotFound";
import HomePage from "@/screens/public/home/HomePage";
import ProjectsPage from "@/screens/public/projects/ProjectsPage";
import ProjectDetailPage from "@/screens/public/projects/ProjectDetailPage";
import ProjectDemoPage from "@/screens/public/projects/ProjectDemoPage";
import TeamPage from "@/screens/public/team/TeamPage";
import ContactPage from "@/screens/public/contact/ContactPage";

/** Login and admin screens are code-split so public visitors never download the editor bundle. */
function lazyPage(load: () => Promise<{ default: React.ComponentType }>): Pick<RouteObject, "lazy"> {
  return { lazy: async () => ({ Component: (await load()).default }) };
}

const adminRoutes: RouteObject[] = [
  { index: true, ...lazyPage(() => import("@/screens/admin/dashboard/Dashboard")) },
  { path: "projects", ...lazyPage(() => import("@/screens/admin/projects/ProjectsList")) },
  { path: "projects/new", ...lazyPage(() => import("@/screens/admin/projects/ProjectEditor")) },
  { path: "projects/:id", ...lazyPage(() => import("@/screens/admin/projects/ProjectEditor")) },
  { path: "members", ...lazyPage(() => import("@/screens/admin/members/MembersList")) },
  { path: "members/new", ...lazyPage(() => import("@/screens/admin/members/MemberEditor")) },
  { path: "members/:id", ...lazyPage(() => import("@/screens/admin/members/MemberEditor")) },
  { path: "media", ...lazyPage(() => import("@/screens/admin/media/MediaLibrary")) },
  { path: "lab-info", ...lazyPage(() => import("@/screens/admin/lab-info/LabInfoEditor")) },
  { path: "presentations", ...lazyPage(() => import("@/screens/admin/presentations/PresentationsBuilder")) },
  { path: "users", ...lazyPage(() => import("@/screens/admin/users/UsersList")) },
];

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/projects", element: <ProjectsPage /> },
      { path: "/projects/:slug", element: <ProjectDetailPage /> },
      { path: "/projects/:slug/demo", element: <ProjectDemoPage /> },
      { path: "/team", element: <TeamPage /> },
      { path: "/contact", element: <ContactPage /> },
    ],
  },
  { path: "/login", ...lazyPage(() => import("@/screens/login/Login")) },
  {
    path: "/admin",
    element: <ProtectedLayout />,
    children: adminRoutes,
  },
  {
    // Full-screen editor: same auth guard as /admin, without the sidebar shell.
    element: <AuthOnlyLayout />,
    children: [
      {
        path: "/admin/presentations/:id/edit",
        ...lazyPage(() => import("@/screens/admin/presentations/editor/DeckEditor")),
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
