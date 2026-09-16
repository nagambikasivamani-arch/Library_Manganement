import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "@/lib/api";

export const Route = createFileRoute("/")({
  beforeLoad: () => { if (isAuthenticated()) throw redirect({ to: "/dashboard" }); throw redirect({ to: "/login" }); },
  head: () => ({ meta: [{ title: "Expense Tracker — Personal Finance" }, { name: "description", content: "Track spending with a clear, friendly personal finance workspace." }, { property: "og:title", content: "Expense Tracker" }, { property: "og:description", content: "Track spending with a clear, friendly personal finance workspace." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => null,
});
