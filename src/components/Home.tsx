import { Card } from "./Card";

interface AnimationCard {
  title: string;
  route: string;
}

const animations: AnimationCard[] = [
  {
    title: "Linear Product Thinking",
    route: "/product-thinking",
  },
  {
    title: "Gooey Tooltip",
    route: "/gooey-tooltip",
  },
  {
    title: "Blackhole 2D",
    route: "/blackhole-2d",
  },
  {
    title: "Peerlist Scroll Feed Tabs",
    route: "/peerlist-scroll-feed-tabs",
  },
  {
    title: "Go Steps Club Navigation",
    route: "/go-steps-club-navigation",
  },
];

export function Home() {
  return (
    <div className="h-screen w-full bg-[#08090a]">
      <div className="font-mono grid lg:grid-cols-2 h-full place-content-center gap-4 p-4 max-w-2xl mx-auto">
        {animations.map((animation) => (
          <Card
            key={animation.route}
            href={animation.route}

          >
            {animation.title}
          </Card>
        ))}
      </div>
    </div>
  );
}
