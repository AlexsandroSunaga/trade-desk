import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ConsoleShell } from "@/components/ConsoleShell";

const Command = lazy(() => import("@/views/console/command"));
const Journal = lazy(() => import("@/views/console/journal"));
const Analytics = lazy(() => import("@/views/console/analytics"));
const Calendar = lazy(() => import("@/pages/PnLCalendarPage/PnLCalendarPage"));
const Desks = lazy(() => import("@/views/console/desks"));
const Risk = lazy(() => import("@/views/console/risk"));
const Compliance = lazy(() => import("@/views/console/compliance"));
const Coach = lazy(() => import("@/views/console/coach"));

export default function ProtectedShell() {
  return (
    <ConsoleShell>
      <Routes>
        <Route path="/console" element={<Command />} />
        <Route path="/console/journal" element={<Journal />} />
        <Route path="/console/analytics" element={<Analytics />} />
        <Route path="/console/calendar" element={<Calendar />} />
        <Route path="/console/desks" element={<Desks />} />
        <Route path="/console/risk" element={<Risk />} />
        <Route path="/console/compliance" element={<Compliance />} />
        <Route path="/console/coach" element={<Coach />} />
        <Route path="*" element={<Navigate to="/console" replace />} />
      </Routes>
    </ConsoleShell>
  );
}
