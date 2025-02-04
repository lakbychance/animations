import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { LinearProductThinking } from "./components/LinearProductThinking";
import "./App.css";
import { GooeyTooltip } from "./components/GooeyTooltip";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product-thinking" element={<LinearProductThinking />} />
      <Route path="/gooey-tooltip" element={<GooeyTooltip />} />
    </Routes>
  );
}

export default App;
