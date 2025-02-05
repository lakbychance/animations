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
];

export function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-full bg-[#08090a]">
      <div className="font-mono grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 p-4">
        {animations.map((animation) => (
          <Card key={animation.route} href={animation.route}>
            {animation.title}
          </Card>
        ))}
      </div>
    </div>
  );
}
