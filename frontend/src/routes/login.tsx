import { createFileRoute } from "@tanstack/react-router";
import { LoginScreen } from "@/components/screens";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Expense Tracker" }, { name: "description", content: "Sign in to your Expense Tracker account." }, { property: "og:title", content: "Sign in — Expense Tracker" }, { property: "og:description", content: "Sign in to your Expense Tracker account." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: LoginScreen,
});