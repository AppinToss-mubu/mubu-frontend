import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { AppShell } from "./components/AppShell";
import Home from "./pages/Home";
import Analyzing from "./pages/Analyzing";
import PriceConfirm from "./pages/PriceConfirm";
import Result from "./pages/Result";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analyzing" element={<Analyzing />} />
          <Route path="/price-confirm/:imageId" element={<PriceConfirm />} />
          <Route path="/result/:imageId" element={<Result />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;