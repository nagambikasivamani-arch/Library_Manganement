import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  BarChart3, CalendarDays, ChevronDown, CircleDollarSign, FileText, LayoutDashboard,
  ListFilter, LogOut, Menu, Pencil, Plus, Search, Settings, ShieldCheck, Trash2, Wallet, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  clearTokens, createExpense, deleteExpense, Expense, ExpenseCategory, ExpensePayload,
  getApiError, getExpenses, updateExpense,
} from "@/lib/api";
import { displayName } from "@/lib/auth";

export const categories: { name: ExpenseCategory; icon: string; color: string; className: string }[] = [
  { name: "Food", icon: "🍔", color: "var(--peach)", className: "bg-peach/20 text-foreground" },
  { name: "Travel", icon: "🚌", color: "var(--sky)", className: "bg-sky/20 text-foreground" },
  { name: "Shopping", icon: "🛍️", color: "var(--rose)", className: "bg-rose/20 text-foreground" },
  { name: "Bills", icon: "🧾", color: "var(--mint)", className: "bg-mint/20 text-foreground" },
  { name: "Entertainment", icon: "🎬", color: "var(--brand)", className: "bg-brand/15 text-foreground" },
  { name: "Education", icon: "📚", color: "var(--lemon)", className: "bg-lemon/25 text-foreground" },
  { name: "Health", icon: "❤️", color: "var(--rose)", className: "bg-rose/20 text-foreground" },
  { name: "Other", icon: "📦", color: "var(--brand-soft)", className: "bg-brand-soft/20 text-foreground" },
];

export function money(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}
export function amountOf(expense: Expense) { return Number(expense.amount) || 0; }
export function categoryMeta(category: string) { return categories.find((item) => item.name === category) ?? categories[categories.length - 1]; }

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const refresh = async () => {
    setLoading(true); setError("");
    try { setExpenses(await getExpenses()); } catch (err) { setError(getApiError(err)); } finally { setLoading(false); }
  };
  useEffect(() => { void refresh(); }, []);
  return { expenses, setExpenses, loading, error, refresh };
}

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => { if (typeof window !== "undefined" && !window.localStorage.getItem("expense_tracker_access")) void navigate({ to: "/login" }); }, [navigate]);
  const logout = () => { clearTokens(); toast.success("You have been logged out."); void navigate({ to: "/login" }); };
  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/expenses", label: "Expenses", icon: FileText },
    { to: "/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/settings", label: "Settings", icon: Settings },
  ] as const;
  const Nav = () => <nav className="clay rounded-3xl bg-card p-3 flex flex-col gap-1.5">
    {navItems.map(({ to, label, icon: Icon }) => {
      const active = location.pathname === to;
      return <Link key={to} to={to} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold transition ${active ? "bg-brand/12 text-brand clay-sm" : "text-foreground/60 hover:bg-cream"}`}>
        <span className={`grid size-9 place-items-center rounded-xl text-lg ${active ? "bg-brand/20" : "bg-cream"}`}><Icon className="size-4" /></span>{label}
      </Link>;
    })}
  </nav>;
  return <div className="finance-canvas min-h-screen bg-cream text-foreground">
    <div className="mx-auto flex max-w-[1380px] gap-6 px-4 py-4 sm:px-6 lg:py-6">
      <aside className="hidden w-60 shrink-0 flex-col gap-4 lg:flex">
        <Brand /> <Nav />
        <div className="clay mt-auto rounded-3xl bg-card p-3"><Button variant="ghost" onClick={logout} className="h-auto w-full justify-start gap-3 rounded-2xl bg-rose/15 px-4 py-3 font-semibold text-foreground hover:bg-rose/25"><span className="grid size-9 place-items-center rounded-xl bg-rose/25"><LogOut className="size-4" /></span>Logout</Button></div>
      </aside>
      {mobileOpen && <div className="fixed inset-0 z-40 bg-foreground/20 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col gap-4 bg-cream p-5 shadow-xl transition-transform lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}><div className="flex justify-end"><Button size="icon" variant="ghost" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X /></Button></div><Brand /><Nav /><Button variant="ghost" onClick={logout} className="mt-auto justify-start gap-3 rounded-2xl bg-rose/15 px-4 py-3 font-semibold"><LogOut className="size-4" />Logout</Button></aside>
      <main className="min-w-0 flex-1">
        <header className="flex items-center gap-3"><Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu /></Button><div className="hidden sm:grid size-9 place-items-center rounded-2xl bg-brand text-xl text-primary-foreground clay-sm"><Wallet className="size-5" /></div><div className="flex-1" /><Link to="/settings" className="grid size-11 shrink-0 place-items-center rounded-2xl bg-lemon font-display font-semibold text-foreground clay-sm">{displayName().slice(0, 1).toUpperCase()}</Link></header>
        <div className="mt-6">{location.pathname !== "/dashboard" && <div className="mb-5"><p className="font-display text-3xl font-semibold">{location.pathname.slice(1).replace(/^[a-z]/, (value) => value.toUpperCase())}</p><p className="text-sm text-foreground/55">Keep your money story organized.</p></div>}{children}</div>
      </main>
    </div>
  </div>;
}

function Brand() { return <Link to="/dashboard" className="clay flex items-center gap-3 rounded-3xl bg-card p-5"><span className="floaty grid size-11 place-items-center rounded-2xl bg-brand text-primary-foreground clay-sm"><Wallet className="size-6" /></span><span><span className="block font-display text-lg font-semibold leading-none">Expense Tracker</span><span className="text-xs text-foreground/50">Personal Finance</span></span></Link>; }

export function PageHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) { return <div className="flex flex-wrap items-center gap-4"><div className="flex-1"><h1 className="font-display text-2xl font-semibold md:text-3xl">{title}</h1><p className="text-sm text-foreground/55">{subtitle}</p></div>{action}</div>; }

export function StatCard({ label, value, icon, tone = "brand", hint }: { label: string; value: string; icon: ReactNode; tone?: string; hint: string }) { const toneClass = { brand: "bg-brand/20", sky: "bg-sky/20", lemon: "bg-lemon/25", mint: "bg-mint/20", rose: "bg-rose/20" }[tone] ?? "bg-brand/20"; return <div className="clay rounded-3xl bg-card p-5 transition-transform hover:-translate-y-1"><div className="flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-wide text-foreground/50">{label}</span><span className={`grid size-10 place-items-center rounded-2xl ${toneClass} text-xl`}>{icon}</span></div><p className="mt-3 font-display text-2xl font-semibold md:text-3xl">{value}</p><p className="mt-1 text-xs font-semibold text-foreground/45">{hint}</p></div>; }

export function ExpenseRow({ expense, onEdit, onDelete }: { expense: Expense; onEdit: (expense: Expense) => void; onDelete: (expense: Expense) => void }) { const meta = categoryMeta(expense.category); return <div className="group grid grid-cols-2 items-center gap-3 rounded-2xl px-2 py-3 transition hover:bg-cream md:grid-cols-[1.1fr_1.2fr_120px_100px_100px]"><div className="flex items-center gap-3"><span className={`grid size-10 place-items-center rounded-2xl ${meta?.className ?? "bg-muted"}`}>{meta?.icon}</span><div className="min-w-0"><p className="truncate text-sm font-semibold">{expense.title}</p><p className="truncate text-xs text-foreground/45">{expense.description || "No description"}</p></div></div><span className={`hidden w-fit rounded-full px-3 py-1 text-xs font-semibold md:inline-flex ${meta?.className ?? "bg-muted"}`}>{expense.category}</span><span className="hidden text-xs text-foreground/50 md:block">{new Date(expense.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</span><span className="text-right font-display font-semibold">{money(amountOf(expense))}</span><div className="flex justify-end gap-1"><Button size="icon" variant="ghost" onClick={() => onEdit(expense)} aria-label={`Edit ${expense.title}`}><Pencil className="size-4" /></Button><Button size="icon" variant="ghost" onClick={() => onDelete(expense)} aria-label={`Delete ${expense.title}`} className="hover:text-destructive"><Trash2 className="size-4" /></Button></div></div>; }

export function ExpenseForm({ initial, onSaved, onCancel }: { initial: Expense | undefined; onSaved: (expense: Expense) => void; onCancel: () => void }) {
  const [form, setForm] = useState<ExpensePayload>({ title: initial?.title ?? "", amount: initial ? String(initial.amount) : "", category: initial?.category ?? "Food", date: initial?.date ?? new Date().toISOString().slice(0, 10), description: initial?.description ?? "" });
  const [saving, setSaving] = useState(false);
  const submit = async (event: FormEvent) => { event.preventDefault(); if (!form.title || !form.amount || !form.date) { toast.error("Add a title, amount, and date first."); return; } setSaving(true); try { const response = initial ? await updateExpense(initial.id, form) : await createExpense(form); onSaved(response.data); toast.success(initial ? "Expense updated." : "Expense added."); } catch (err) { toast.error(getApiError(err)); } finally { setSaving(false); } };
  const update = (key: keyof ExpensePayload, value: string) => setForm((current) => ({ ...current, [key]: value }));
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/25 p-4 backdrop-blur-sm"><form onSubmit={submit} className="clay w-full max-w-lg rounded-3xl bg-card p-6"><div className="flex items-start justify-between"><div><p className="font-display text-2xl font-semibold">{initial ? "Edit expense" : "Add expense"}</p><p className="text-sm text-foreground/55">Capture the detail while it is fresh.</p></div><Button type="button" size="icon" variant="ghost" onClick={onCancel} aria-label="Close"><X /></Button></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="grid gap-1.5 text-sm font-semibold sm:col-span-2">Title<Input value={form.title} onChange={(event) => update("title", event.target.value)} placeholder="e.g. Lunch with friends" /></label><label className="grid gap-1.5 text-sm font-semibold">Amount (₹)<Input type="number" min="0" step="0.01" value={form.amount} onChange={(event) => update("amount", event.target.value)} placeholder="0" /></label><label className="grid gap-1.5 text-sm font-semibold">Date<Input type="date" value={form.date} onChange={(event) => update("date", event.target.value)} /></label><label className="grid gap-1.5 text-sm font-semibold sm:col-span-2">Category<select value={form.category} onChange={(event) => update("category", event.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm font-normal outline-none focus:ring-1 focus:ring-ring">{categories.map((item) => <option key={item.name}>{item.name}</option>)}</select></label><label className="grid gap-1.5 text-sm font-semibold sm:col-span-2">Description<textarea value={form.description} onChange={(event) => update("description", event.target.value)} placeholder="Optional note" className="min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm font-normal outline-none focus:ring-1 focus:ring-ring" /></label></div><div className="mt-6 flex justify-end gap-2"><Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? "Saving…" : initial ? "Save changes" : "Add expense"}</Button></div></form></div>;
}

export function DeleteDialog({ expense, onCancel, onDeleted }: { expense: Expense; onCancel: () => void; onDeleted: () => void }) { const [deleting, setDeleting] = useState(false); const confirm = async () => { setDeleting(true); try { await deleteExpense(expense.id); toast.success("Expense deleted."); onDeleted(); } catch (err) { toast.error(getApiError(err)); } finally { setDeleting(false); } }; return <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/25 p-4 backdrop-blur-sm"><div className="clay w-full max-w-md rounded-3xl bg-card p-6"><div className="grid size-12 place-items-center rounded-2xl bg-rose/20 text-2xl">🗑️</div><h2 className="mt-4 font-display text-2xl font-semibold">Delete this expense?</h2><p className="mt-2 text-sm text-foreground/60">Are you sure you want to delete “{expense.title}”? This action cannot be undone.</p><div className="mt-6 flex justify-end gap-2"><Button variant="ghost" onClick={onCancel}>Keep it</Button><Button variant="destructive" onClick={confirm} disabled={deleting}>{deleting ? "Deleting…" : "Delete expense"}</Button></div></div></div>; }

export function ChartData({ expenses }: { expenses: Expense[] }) { const year = new Date().getFullYear(); const monthly = Array.from({ length: 12 }, (_, month) => ({ month: new Date(year, month, 1).toLocaleString("en", { month: "short" }), amount: expenses.filter((item) => { const date = new Date(item.date); return date.getFullYear() === year && date.getMonth() === month; }).reduce((sum, item) => sum + amountOf(item), 0) })); const byCategory = categories.map((category) => ({ name: category.name, value: expenses.filter((item) => item.category === category.name).reduce((sum, item) => sum + amountOf(item), 0), color: category.color })).filter((item) => item.value > 0); return <div className="grid gap-4 lg:grid-cols-3"><div className="clay rounded-3xl bg-card p-6 lg:col-span-2"><div className="flex items-center justify-between"><div><h2 className="font-display text-xl font-semibold">Monthly Spending</h2><p className="text-xs text-foreground/50">Amount in ₹ · current year</p></div><span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold text-foreground/50">{year}</span></div><div className="mt-4 h-64"><ResponsiveContainer width="100%" height="100%"><AreaChart data={monthly} margin={{ top: 10, right: 8, left: -22, bottom: 0 }}><defs><linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--brand)" stopOpacity={0.35} /><stop offset="100%" stopColor="var(--brand)" stopOpacity={0.02} /></linearGradient></defs><XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} /><YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} tickFormatter={(value) => `₹${Math.round(value / 1000)}k`} /><Tooltip formatter={(value) => money(Number(value))} contentStyle={{ borderRadius: 16, border: "none", boxShadow: "0 12px 30px color-mix(in oklab, var(--brand) 18%, transparent)" }} /><Area type="monotone" dataKey="amount" stroke="var(--brand)" strokeWidth={3} fill="url(#spendFill)" /></AreaChart></ResponsiveContainer></div></div><div className="clay rounded-3xl bg-card p-6"><h2 className="font-display text-xl font-semibold">Spending by Category</h2><p className="text-xs text-foreground/50">All logged expenses</p>{byCategory.length ? <><div className="relative mx-auto mt-4 h-44"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={byCategory} dataKey="value" nameKey="name" innerRadius={52} outerRadius={78} paddingAngle={3}>{byCategory.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip formatter={(value) => money(Number(value))} /></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="font-display text-lg font-semibold">{money(byCategory.reduce((sum, item) => sum + item.value, 0))}</span><span className="text-[10px] text-foreground/45">total</span></div></div><div className="mt-2 grid grid-cols-2 gap-2 text-xs">{byCategory.slice(0, 6).map((item) => <span key={item.name} className="flex items-center gap-2"><i className="size-3 rounded-full" style={{ backgroundColor: item.color }} />{item.name}</span>)}</div></> : <EmptyState compact title="No categories yet" description="Add an expense to see the mix." />}</div></div>; }

export function EmptyState({ title, description, compact = false }: { title: string; description: string; compact?: boolean }) { return <div className={`flex flex-col items-center justify-center text-center ${compact ? "py-8" : "min-h-56 py-12"}`}><span className="grid size-14 place-items-center rounded-2xl bg-brand/10 text-brand"><CircleDollarSign className="size-7" /></span><h3 className="mt-4 font-display text-xl font-semibold">{title}</h3><p className="mt-1 max-w-sm text-sm text-foreground/55">{description}</p></div>; }

export function Filters({ search, setSearch, category, setCategory, sort, setSort }: { search: string; setSearch: (value: string) => void; category: string; setCategory: (value: string) => void; sort: string; setSort: (value: string) => void }) { return <div className="clay flex flex-col gap-3 rounded-3xl bg-card p-4 md:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground/40" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search expenses…" className="h-10 rounded-2xl pl-9" /></div><div className="flex gap-3"><div className="relative"><ListFilter className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground/40" /><select value={category} onChange={(event) => setCategory(event.target.value)} className="h-10 w-full appearance-none rounded-2xl border border-input bg-background pl-9 pr-8 text-sm outline-none focus:ring-1 focus:ring-ring"><option value="all">All categories</option>{categories.map((item) => <option key={item.name}>{item.name}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-foreground/40" /></div><select value={sort} onChange={(event) => setSort(event.target.value)} className="h-10 rounded-2xl border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring"><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="highest">Highest amount</option><option value="lowest">Lowest amount</option></select></div></div>; }

export function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) { return <div className="clay rounded-3xl bg-card p-8 text-center"><ShieldCheck className="mx-auto size-9 text-rose" /><h3 className="mt-3 font-display text-xl font-semibold">We couldn't load your expenses</h3><p className="mx-auto mt-1 max-w-md text-sm text-foreground/55">{error}</p><Button onClick={onRetry} className="mt-5">Try again</Button></div>; }