import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "@/lib/api";
import { ExpensesScreen } from "@/components/screens";

export const Route = createFileRoute("/expenses")({ beforeLoad: () => { if (!isAuthenticated()) throw redirect({ to: "/login" }); }, head: () => ({ meta: [{ title: "Expenses — Expense Tracker" }, { name: "description", content: "Search, sort, add, edit, and delete your expenses." }, { property: "og:title", content: "Expenses — Expense Tracker" }, { property: "og:description", content: "Search, sort, add, edit, and delete your expenses." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: ExpensesScreen });