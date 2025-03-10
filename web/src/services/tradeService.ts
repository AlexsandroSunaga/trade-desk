import { api } from "@/api/client";

export const tradeService = {
  desks: () => api<any[]>("/desks"),
  journal: () => api<any[]>("/journal"),
  risk: () => api<any[]>("/risk/snapshots"),
  compliance: () => api<any[]>("/compliance/alerts"),
};
