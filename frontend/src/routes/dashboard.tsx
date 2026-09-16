import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "@/lib/api";
import { DashboardScreen } from "@/components/screens";

export const Route = createFileRoute("/dashboard")({ beforeLoad: () => { if (!isAuthenticated()) throw redirect({ to: "/login" }); }, head: () => ({ meta: [{ title: "Dashboard — Expense Tracker" }, { name: "description", content: "See your spending overview and recent expenses." }, { property: "og:title", content: "Dashboard — Expense Tracker" }, { property: "og:description", content: "See your spending overview and recent expenses." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: DashboardScreen });