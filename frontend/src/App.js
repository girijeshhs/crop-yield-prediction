import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PredictYield from "./pages/PredictYield";
import DiseaseDetection from "./pages/DiseaseDetection";

function App() {
  return (
    <div className="min-h-screen bg-background-primary">
      <Navbar />
      <main className="px-4 py-10 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/predict" element={<PredictYield />} />
          <Route path="/disease" element={<DiseaseDetection />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
