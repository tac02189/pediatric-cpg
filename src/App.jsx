import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import HomePage from "./components/home/HomePage.jsx";
import GuidelineSession from "./components/guideline/GuidelineSession.jsx";
import GuidelinePage from "./components/guideline/GuidelinePage.jsx";
import GuidelineCalculatorsPage from "./components/calculators/GuidelineCalculatorsPage.jsx";
import CalculatorsPage from "./components/calculators/CalculatorsPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/calculators" element={<CalculatorsPage />} />
        {/* One session per guideline: the pathway and its calculators share it,
            so opening Calculators doesn't throw away the resident's place. */}
        <Route path="/guideline/:id" element={<GuidelineSession />}>
          <Route index element={<GuidelinePage />} />
          <Route path="calculators" element={<GuidelineCalculatorsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
