import axios, { AxiosError } from "axios";
import { saveUsername, clearSavedUsername } from "./auth";

export const API_BASE_URL = "http://127.0.0.1:8000/api";
const ACCESS_TOKEN_KEY = "expense_tracker_access";
const REFRESH_TOKEN_KEY = "expense_tracker_refresh";

export type ExpenseCategory = "Food" | "Travel" | "Shopping" | "Bills" | "Entertainment" | "Education" | "Health" | "Other";

export interface Expense {
  id: number | string;
  title: string;
  amount: string | number;
  category: ExpenseCategory | string;
  date: string;
  description?: string;
}

export interface ExpensePayload {
  title: string;
  amount: string;
  category: string;
  date: string;
  description: string;
}

export interface LoginResponse { access: string; refresh: string; }

export const api = axios.create({ baseURL: API_BASE_URL, headers: { "Content-Type": "application/json" } });

export function getAccessToken() { return typeof window === "undefined" ? null : window.localStorage.getItem(ACCESS_TOKEN_KEY); }
export function isAuthenticated() { return Boolean(getAccessToken()); }
export function saveTokens(tokens: LoginResponse) {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
}

export function clearTokens() {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  clearSavedUsername();
}

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      clearTokens();
      if (!window.location.pathname.startsWith("/login") && !window.location.pathname.startsWith("/signup")) window.location.assign("/login");
    }
    return Promise.reject(error);
  },
);

export async function login(credentials: { username: string; password: string }) {
  const { data } = await api.post<LoginResponse>("/login/", credentials);

  saveTokens(data);
  saveUsername(credentials.username);

  return data;
}

export async function signup(payload: { username: string; email: string; password: string }) {
  return api.post("/register/", payload);
}

export async function getExpenses() {
  const { data } = await api.get<Expense[] | { results: Expense[] }>("/expenses/");
  return Array.isArray(data) ? data : data.results ?? [];
}

export async function createExpense(payload: ExpensePayload) { return api.post<Expense>("/expenses/", payload); }
export async function updateExpense(id: Expense["id"], payload: ExpensePayload) { return api.put<Expense>(`/expenses/${id}/`, payload); }
export async function deleteExpense(id: Expense["id"]) { return api.delete(`/expenses/${id}/`); }

export function getApiError(error: unknown, fallback = "Something went wrong. Please try again.") {
  if (!axios.isAxiosError(error)) return fallback;
  if (!error.response) return "We couldn't reach the Django server. Check that it is running and try again.";
  const data = error.response.data as Record<string, unknown> | undefined;
  if (typeof data?.["detail"] === "string") return data["detail"];
  const firstValue = data && Object.values(data)[0];
  if (Array.isArray(firstValue) && typeof firstValue[0] === "string") return firstValue[0];
  if (typeof firstValue === "string") return firstValue;
  return fallback;
}