import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { LinearProductThinking } from "./components/LinearProductThinking";
import "./App.css";
import { GooeyTooltip } from "./components/GooeyTooltip";
import { Blackhole } from "./components/Blackhole";
import { PeerlistScrollFeedTabs } from "./components/PeerlistScrollFeedTabs";
import { GoStepsClubNavigation } from "./components/GoStepsClubNavigation";
function App() {
  return (
    <div className="antialiased">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product-thinking" element={<LinearProductThinking />} />
        <Route path="/gooey-tooltip" element={<GooeyTooltip />} />
        <Route path="/blackhole-2d" element={<Blackhole />} />
        <Route path="/go-steps-club-navigation" element={<GoStepsClubNavigation />} />
        <Route
          path="/peerlist-scroll-feed-tabs"
          element={<PeerlistScrollFeedTabs />}
        />
      </Routes>
    </div>
  );
}

export default App;
