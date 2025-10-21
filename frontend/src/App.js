import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/NavbarClean";
import Chatbot from "./components/Chatbot";
import Home from "./pages/HomeClean";
import PredictYield from "./pages/PredictYieldClean";
import DiseaseDetection from "./pages/DiseaseDetectionClean";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/predict" element={<PredictYield />} />
          <Route path="/disease" element={<DiseaseDetection />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Chatbot />
    </div>
  );
}

export default App;
