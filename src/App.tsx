import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { Home } from "./components/Home";
import { motion, AnimatePresence } from 'framer-motion';
import { LinearProductThinking } from "./components/LinearProductThinking";
import "./App.css";
import { GooeyTooltip } from "./components/GooeyTooltip";
import { Blackhole } from "./components/Blackhole";
import { PeerlistScrollFeedTabs } from "./components/PeerlistScrollFeedTabs";
import { GoStepsClubNavigation } from "./components/GoStepsClubNavigation";
import { Minimap } from "./components/Minimap";
import { InlineTableControl } from "./components/InlineTableControl";
import { useRive } from "@rive-app/react-webgl2";



function AppRoutes() {
  return (
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
      <Route path="/minimap" element={<Minimap />} />
      <Route path="/inline-table-control" element={<InlineTableControl />} />
    </Routes>

  );
}

function App() {
  const [showIntroAnimation, setShowIntroAnimation] = useState(true);

  const { RiveComponent: Intro, rive } = useRive({
    src: "animations-lak_logo.riv",
    stateMachines: "Intro",
    autoplay: true,
  });

  useEffect(() => {
    if (rive?.isPlaying) {
      const timer = setTimeout(() => {
        setShowIntroAnimation(false);
      }, 2150);

      return () => clearTimeout(timer);
    }
  }, [rive]);

  return (
    <div className="antialiased bg-black">
      <AnimatePresence mode='wait'>
        {showIntroAnimation ? (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0
            }}
            key='intro'
            className="h-screen w-full"
          >
            <Intro />
          </motion.div>
        ) : (
          <AppRoutes />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;