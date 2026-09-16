import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "@/lib/api";
import { SettingsScreen } from "@/components/screens";

export const Route = createFileRoute("/settings")({ beforeLoad: () => { if (!isAuthenticated()) throw redirect({ to: "/login" }); }, head: () => ({ meta: [{ title: "Settings — Expense Tracker" }, { name: "description", content: "View your Expense Tracker account details." }, { property: "og:title", content: "Settings — Expense Tracker" }, { property: "og:description", content: "View your Expense Tracker account details." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: SettingsScreen });