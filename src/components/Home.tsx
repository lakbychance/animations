import { Card } from "./Card";
interface AnimationCard {
  title: string;
  titleColor: string;
  videoSrc: string;
  poster: string;
  route: string;
}

const animations: AnimationCard[] = [
  {
    title: "Linear Product Thinking",
    titleColor: "text-zinc-400",
    videoSrc: 'https://ik.imagekit.io/lapstjup/animations-lak/Linear_Product_Thinking.mp4?tr=q-50',
    poster: 'https://ik.imagekit.io/lapstjup/animations-lak/Linear_Product_Thinking.mp4/ik-thumbnail.jpg',
    route: "/product-thinking",
  },
  {
    title: "Gooey Tooltip",
    titleColor: "text-zinc-400",
    videoSrc: 'https://ik.imagekit.io/lapstjup/animations-lak/Gooey_Tooltip.mp4?tr=q-50',
    poster: 'https://ik.imagekit.io/lapstjup/animations-lak/Gooey_Tooltip.mp4/ik-thumbnail.jpg',
    route: "/gooey-tooltip",
  },
  {
    title: "Blackhole 2D",
    titleColor: "text-zinc-400",
    videoSrc: 'https://ik.imagekit.io/lapstjup/animations-lak/Blackhole_2D.mp4?tr=q-50',
    poster: "https://ik.imagekit.io/lapstjup/animations-lak/Blackhole_2D.mp4/ik-thumbnail.jpg",
    route: "/blackhole-2d",
  },
  {
    title: "Peerlist Scroll Feed Tabs",
    titleColor: "text-zinc-400",
    route: "/peerlist-scroll-feed-tabs",
    videoSrc: 'https://ik.imagekit.io/lapstjup/animations-lak/Peerlist_Scroll_Feed_Tabs.mp4?tr=q-50',
    poster: 'https://ik.imagekit.io/lapstjup/animations-lak/Peerlist_Scroll_Feed_Tabs.mp4/ik-thumbnail.jpg',
  },
  {
    title: "GoSteps Club Navigation",
    titleColor: "text-zinc-900",
    route: "/go-steps-club-navigation",
    videoSrc: 'https://ik.imagekit.io/lapstjup/animations-lak/GoSteps_Club_Navigation.mp4?tr=q-50',
    poster: 'https://ik.imagekit.io/lapstjup/animations-lak/GoSteps_Club_Navigation.mp4/ik-thumbnail.jpg',
  },
  {
    title: "Minimap",
    titleColor: "text-zinc-400",
    route: "/minimap",
    videoSrc: 'https://ik.imagekit.io/lapstjup/animations-lak/Minimap.mp4?tr=q-50',
    poster: 'https://ik.imagekit.io/lapstjup/animations-lak/Minimap.mp4/ik-thumbnail.jpg',
  },
  {
    title: "Inline Table Control",
    titleColor: "text-zinc-900",
    route: "/inline-table-control",
    videoSrc: 'https://ik.imagekit.io/lapstjup/animations-lak/Inline_Table.mp4?tr=q-50',
    poster: 'https://ik.imagekit.io/lapstjup/animations-lak/Inline_Table.mp4/ik-thumbnail.jpg',
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
        poster={animation.poster}
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
