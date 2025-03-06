import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const Home = lazy(() => import("@/pages/LandingPage/LandingPage"));
const Features = lazy(() => import("@/views/features"));
const Security = lazy(() => import("@/views/security"));
const Institutions = lazy(() => import("@/views/institutions"));
const Pricing = lazy(() => import("@/views/pricing"));
const Contact = lazy(() => import("@/views/contact"));
const Login = lazy(() => import("@/views/login"));
const Console = lazy(() => import("@/router/ProtectedShell"));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="p-8 text-slate-400">Loading…</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/security" element={<Security />} />
          <Route path="/institutions" element={<Institutions />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<Console />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
