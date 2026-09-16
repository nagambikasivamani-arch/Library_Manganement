import { createFileRoute } from "@tanstack/react-router";
import { SignupScreen } from "@/components/screens";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — Expense Tracker" }, { name: "description", content: "Create your Expense Tracker account." }, { property: "og:title", content: "Create account — Expense Tracker" }, { property: "og:description", content: "Create your Expense Tracker account." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: SignupScreen,
});