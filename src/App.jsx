import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import HomePage from "./components/home/HomePage.jsx";
import GuidelinePage from "./components/guideline/GuidelinePage.jsx";
import GuidelineCalculatorsPage from "./components/calculators/GuidelineCalculatorsPage.jsx";
import CalculatorsPage from "./components/calculators/CalculatorsPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/calculators" element={<CalculatorsPage />} />
        <Route path="/guideline/:id" element={<GuidelinePage />} />
        <Route path="/guideline/:id/calculators" element={<GuidelineCalculatorsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
