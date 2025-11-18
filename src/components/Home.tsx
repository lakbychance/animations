import { Card } from "./shared/Card";
import { useEffect, useState } from "react";

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
  {
    title: "Timed Undo Button",
    titleColor: "text-zinc-900",
    route: "/timed-undo-button",
    videoSrc: 'https://ik.imagekit.io/lapstjup/animations-lak/Timed_Undo_Button.mp4?tr=q-50',
    poster: 'https://ik.imagekit.io/lapstjup/animations-lak/Timed_Undo_Button.mp4/ik-thumbnail.jpg',
  },
  {
    title: "Chronicle Chapters Nav Menu",
    titleColor: "text-zinc-400",
    route: "/chronicle-chapters-nav-menu",
    videoSrc: 'https://ik.imagekit.io/lapstjup/animations-lak/Chronicle_Chapters_Nav_Menu.mov?tr=q-50',
    poster: 'https://ik.imagekit.io/lapstjup/animations-lak/Chronicle_Chapters_Nav_Menu.mov/ik-thumbnail.jpg',
  }
];

const VideoCard = ({ animation }: { animation: AnimationCard }) => (
  <Card href={animation.route}>
    <div className="relative">
      <video
        className="rounded-lg w-full h-full object-cover"
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

const useColumns = () => {
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 1280) { // xl breakpoint
        setColumns(3);
      } else if (window.innerWidth >= 768) { // md breakpoint
        setColumns(2);
      } else {
        setColumns(1);
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  return columns;
};


export function Home() {
  const columns = useColumns();

  return (
    <div className="w-full min-h-screen bg-zinc-950 p-4">


      <div className="font-mono grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 h-full mx-auto">
        {Array.from({ length: columns }).map((_, columnIndex) => (
          <div key={columnIndex} className="grid gap-2 content-baseline">
            {animations
              .slice(
                columnIndex * Math.ceil(animations.length / columns),
                (columnIndex + 1) * Math.ceil(animations.length / columns)
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
