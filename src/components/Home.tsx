import { Card } from "./Card";
import LinearProductThinking from '../assets/videos/Linear_Product_Thinking.mp4'
import GooeyTooltip from '../assets/videos/Gooey_Tooltip.mp4'
import Blackhole2D from '../assets/videos/Blackhole_2D.mp4'
import PeerlistScrollFeedTabs from '../assets/videos/Peerlist_Scroll_Feed_Tabs.mp4'
import GoStepsClubNavigation from '../assets/videos/GoSteps_Club_Navigation.mp4'
import Minimap from '../assets/videos/Minimap.mp4'
interface AnimationCard {
  title: string;
  titleColor: string;
  videoSrc: string;
  route: string;
}

const animations: AnimationCard[] = [
  {
    title: "Linear Product Thinking",
    titleColor: "text-zinc-400",
    videoSrc: LinearProductThinking,
    route: "/product-thinking",
  },
  {
    title: "Gooey Tooltip",
    titleColor: "text-zinc-400",
    videoSrc: GooeyTooltip,
    route: "/gooey-tooltip",
  },
  {
    title: "Blackhole 2D",
    titleColor: "text-zinc-400",
    videoSrc: Blackhole2D,
    route: "/blackhole-2d",
  },
  {
    title: "Peerlist Scroll Feed Tabs",
    titleColor: "text-zinc-400",
    route: "/peerlist-scroll-feed-tabs",
    videoSrc: PeerlistScrollFeedTabs,
  },
  {
    title: "GoSteps Club Navigation",
    titleColor: "text-zinc-900",
    route: "/go-steps-club-navigation",
    videoSrc: GoStepsClubNavigation,
  },
  {
    title: "Minimap",
    titleColor: "text-zinc-400",
    route: "/minimap",
    videoSrc: Minimap,
  },

];

const VideoCard = ({ animation }: { animation: AnimationCard }) => (
  <Card href={animation.route}>
    <div className="relative">
      <video
        className="aspect-video rounded-lg w-full h-full object-cover"
        src={animation.videoSrc}
        playsInline
        muted
        autoPlay
        loop
      />
      <p className={`${animation.titleColor} absolute top-3 left-3 text-xs`}>
        {animation.title}
      </p>
    </div>
  </Card>
);

export function Home() {
  return (
    <div className="w-full min-h-screen bg-[#08090a] p-4">
      <div className="font-mono grid grid-cols-1 lg:grid-cols-2 gap-4 h-full max-w-[1536px] mx-auto">
        {[0, 1].map((columnIndex) => (
          <div key={columnIndex} className="grid gap-4 content-center">
            {animations
              .slice(
                columnIndex * Math.ceil(animations.length / 2),
                (columnIndex + 1) * Math.ceil(animations.length / 2)
              )
              .map((animation) => (
                <VideoCard key={animation.route} animation={animation} />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
