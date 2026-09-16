import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "@/lib/api";
import { AnalyticsScreen } from "@/components/screens";

export const Route = createFileRoute("/analytics")({ beforeLoad: () => { if (!isAuthenticated()) throw redirect({ to: "/login" }); }, head: () => ({ meta: [{ title: "Analytics — Expense Tracker" }, { name: "description", content: "Explore monthly spending and category analytics." }, { property: "og:title", content: "Analytics — Expense Tracker" }, { property: "og:description", content: "Explore monthly spending and category analytics." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: AnalyticsScreen });