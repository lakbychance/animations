import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { LinearProductThinking } from "./components/LinearProductThinking";
import "./App.css";
import { GooeyTooltip } from "./components/GooeyTooltip";
import { Blackhole } from "./components/Blackhole";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product-thinking" element={<LinearProductThinking />} />
      <Route path="/gooey-tooltip" element={<GooeyTooltip />} />
      <Route path="/blackhole-2d" element={<Blackhole />} />
    </Routes>
  );
}

export default App;
