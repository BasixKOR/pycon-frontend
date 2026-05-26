import { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { Layout } from "./components/layout.tsx";
import { LandingPage } from "./components/pages/home.tsx";
import { ModificationAuditPreview } from "./components/pages/modification_audit_preview.tsx";
import { ProfileEditor } from "./components/pages/profile_editor.tsx";
import { SessionEditor } from "./components/pages/session_editor";
import { SignInPage } from "./components/pages/signin.tsx";
import { SponsorEditor } from "./components/pages/sponsor_editor";

export const App: FC = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/user" element={<ProfileEditor />} />
      <Route path="/sponsor/:id" element={<SponsorEditor />} />
      <Route path="/session/:sessionId" element={<SessionEditor />} />
      <Route path="/modification-audit/:auditId" element={<ModificationAuditPreview />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
);
