import { forwardRef, useEffect, useRef, useState } from "react";

import * as Tabs from "@radix-ui/react-tabs";
import { twMerge } from "tailwind-merge";
import { motion, cubicBezier, MotionConfig } from "framer-motion";
import clsx from "clsx";

const LINKS = {
  NEWEST: "/scroll",
  TRENDING: "/scroll/trending",
  FOLLOWING: "/scroll/following",
} as const;

const TABS = {
  NEWEST: "newest",
  TRENDING: "trending",
  FOLLOWING: "following",
} as const;

const GRADIENT_POSITIONS = {
  [TABS.NEWEST]: 10,
  [TABS.TRENDING]: 45,
  [TABS.FOLLOWING]: 90,
} as const;

const CONSTANTS = {
  DEFAULT_CIRCLE_SIZE: 250,
  GRADIENT_MULTIPLIER: 1.5,
  DISTANCE_OFFSET: 25,
  INTERPOLATION_FACTOR: 0.3,
  ANIMATION_DURATION: 0.45,
} as const;

const COLORS = {
  gray00: "23 23 23",
  gray1k: "250 250 250",
  gray200: "64 64 64",
  green200: "82 192 120",
  primaryGradient: "83 193 121",
} as const;

const BaseTabsLabel = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) => <p className={clsx("font-semibold text-xs", className)}>{children}</p>;

const InactiveTabsLabel = ({ children }: { children: React.ReactNode }) => (
  <BaseTabsLabel className="text-[rgb(var(--gray-1k))]">
    {children}
  </BaseTabsLabel>
);

const ActiveTabsLabel = ({ children }: { children: React.ReactNode }) => (
  <BaseTabsLabel className="text-[rgb(var(--green-200))]">
    {children}
  </BaseTabsLabel>
);

const TabsLink = forwardRef<HTMLAnchorElement, React.ComponentProps<"a">>(
  ({ className, ...restOfProps }, ref) => (
    <a
      ref={ref}
      className={twMerge(
        "px-4 focus:outline-none uppercase border-transparent flex items-center",
        className
      )}
      {...restOfProps}
    />
  )
);

const InteractiveTabsLink = forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a">
>(({ className, ...restOfProps }, ref) => (
  <TabsLink ref={ref} className={twMerge("py-2", className)} {...restOfProps} />
));

export const PeerlistScrollFeedTabs = () => {
  const [activeTab, setActiveTab] = useState({
    name: "newest",
    leftPercentage: 0,
    rightPercentage: 70,
  });
  const activeTabRef = useRef<HTMLAnchorElement>(null);
  const [gradientPositionPercentage, setGradientPositionPercentage] =
    useState<number>(GRADIENT_POSITIONS[TABS.NEWEST]);
  const [circleSize, setCircleSize] = useState("250px");

  useEffect(() => {
    if (!activeTabRef.current) return;
    const activeTabBoundsPercentage = getActiveTabBoundsPercentage(
      activeTabRef.current
    );
    if (!activeTabBoundsPercentage) return;
    setActiveTab((prev) => ({
      ...prev,
      leftPercentage: activeTabBoundsPercentage.leftPercentage,
      rightPercentage: activeTabBoundsPercentage.rightPercentage,
    }));
  }, [activeTab.name]);

  const onValueChange = (value: string) => {
    setActiveTab((prev) => ({
      ...prev,
      name: value,
    }));
    setGradientPositionPercentage(getGradientPosition(value));
    setCircleSize(`${CONSTANTS.DEFAULT_CIRCLE_SIZE}px`);
  };

  const getGradientPosition = (tab: string) => {
    switch (tab) {
      case TABS.NEWEST:
        return GRADIENT_POSITIONS[TABS.NEWEST];
      case TABS.TRENDING:
        return GRADIENT_POSITIONS[TABS.TRENDING];
      case TABS.FOLLOWING:
        return GRADIENT_POSITIONS[TABS.FOLLOWING];
      default:
        return GRADIENT_POSITIONS[TABS.NEWEST];
    }
  };

  const getGradientDistanceMultiplier = (tab: string) => {
    switch (tab) {
      case TABS.NEWEST:
        return CONSTANTS.GRADIENT_MULTIPLIER;
      case TABS.TRENDING:
        return CONSTANTS.GRADIENT_MULTIPLIER;
      case TABS.FOLLOWING:
        return CONSTANTS.GRADIENT_MULTIPLIER;
      default:
        return CONSTANTS.GRADIENT_MULTIPLIER;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const gradientXPositionInPercent =
      ((e.clientX - rect.left) / rect.width) * 100;

    const currentGradientPositionInPercent = getGradientPosition(
      activeTab.name
    );

    const interpolatedGradientPositionInPercent =
      currentGradientPositionInPercent +
      (gradientXPositionInPercent - currentGradientPositionInPercent) * 0.3;

    const gradientDistance =
      ((Math.abs(
        gradientXPositionInPercent - currentGradientPositionInPercent
      ) *
        rect.width) /
        100) *
      getGradientDistanceMultiplier(activeTab.name);
    const distanceOffset = 25;
    const minCircleSize = 250;
    const newCircleSize = minCircleSize + gradientDistance - distanceOffset;
    setCircleSize(`${newCircleSize}px`);
    setGradientPositionPercentage(interpolatedGradientPositionInPercent);
  };

  const handleMouseLeave = () => {
    setGradientPositionPercentage(getGradientPosition(activeTab.name));
    setCircleSize(`${CONSTANTS.DEFAULT_CIRCLE_SIZE}px`);
  };

  const getActiveTabBoundsPercentage = (
    activeTabElement: HTMLAnchorElement
  ) => {
    const activeTabParent = activeTabElement.parentElement;
    if (!activeTabParent) return;
    const parentRect = activeTabParent.getBoundingClientRect();
    const activeTabRect = activeTabElement.getBoundingClientRect();
    const activeTabLeft =
      (activeTabRect.left - parentRect.left) / parentRect.width;
    const activeTabRight =
      (parentRect.right - activeTabRect.right) / parentRect.width;
    return {
      leftPercentage: activeTabLeft * 100,
      rightPercentage: activeTabRight * 100,
    };
  };

  const handleTabClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
  };

  return (
    <MotionConfig
      transition={{
        duration: CONSTANTS.ANIMATION_DURATION,
        ease: cubicBezier(0.19, 1, 0.22, 1),
      }}
    >
      <div
        style={{
          "--gray-00": COLORS.gray00,
          "--gray-1k": COLORS.gray1k,
          "--gray-200": COLORS.gray200,
          "--green-200": COLORS.green200,
        }}
        className="flex font-[Inter] flex-col justify-center items-center h-screen w-full bg-[rgb(var(--gray-00))]"
      >
        <Tabs.Root value={activeTab.name} onValueChange={onValueChange}>
          <Tabs.List asChild>
            <motion.div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="flex z-1 rounded-xl relative"
              initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              <Tabs.Trigger value={TABS.NEWEST} asChild>
                <InteractiveTabsLink
                  ref={
                    activeTab.name === TABS.NEWEST ? activeTabRef : undefined
                  }
                  className="border rounded-l-xl bg-clip-padding bg-[rgb(var(--gray-00))]"
                  href={LINKS.NEWEST}
                  onClick={handleTabClick}
                >
                  <InactiveTabsLabel>Newest</InactiveTabsLabel>
                </InteractiveTabsLink>
              </Tabs.Trigger>
              <Tabs.Trigger value={TABS.TRENDING} asChild>
                <InteractiveTabsLink
                  ref={
                    activeTab.name === TABS.TRENDING ? activeTabRef : undefined
                  }
                  className="border-y bg-clip-padding bg-[rgb(var(--gray-00))]"
                  href={LINKS.TRENDING}
                  onClick={handleTabClick}
                >
                  <InactiveTabsLabel>Trending</InactiveTabsLabel>
                </InteractiveTabsLink>
              </Tabs.Trigger>
              <Tabs.Trigger value={TABS.FOLLOWING} asChild>
                <InteractiveTabsLink
                  ref={
                    activeTab.name === TABS.FOLLOWING ? activeTabRef : undefined
                  }
                  className="border rounded-r-xl bg-clip-padding bg-[rgb(var(--gray-00))]"
                  href={LINKS.FOLLOWING}
                  onClick={handleTabClick}
                >
                  <InactiveTabsLabel>Following</InactiveTabsLabel>
                </InteractiveTabsLink>
              </Tabs.Trigger>
              <motion.div
                className="absolute inset-0 flex pointer-events-none bg-clip-text"
                style={{
                  backgroundImage: `linear-gradient(to right, rgb(var(--green-200)), rgb(var(--green-200)))`,
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                }}
                initial={false}
                animate={{
                  clipPath: `inset(0 ${activeTab.rightPercentage}% 0 ${activeTab.leftPercentage}%)`,
                }}
              >
                <InteractiveTabsLink
                  href={LINKS.NEWEST}
                  onClick={handleTabClick}
                  className="border rounded-l-xl "
                >
                  <ActiveTabsLabel>Newest</ActiveTabsLabel>
                </InteractiveTabsLink>
                <InteractiveTabsLink
                  className="border-y "
                  href={LINKS.TRENDING}
                  onClick={handleTabClick}
                >
                  <ActiveTabsLabel>Trending</ActiveTabsLabel>
                </InteractiveTabsLink>
                <InteractiveTabsLink
                  href={LINKS.FOLLOWING}
                  className="border rounded-r-xl"
                  onClick={handleTabClick}
                >
                  <ActiveTabsLabel>Following</ActiveTabsLabel>
                </InteractiveTabsLink>
              </motion.div>
              <motion.div
                className="rounded-xl absolute inset-0 -z-5"
                style={{
                  "--primary-gradient": COLORS.primaryGradient,
                  background:
                    "radial-gradient(var(--circle-size) circle at var(--gradient-position-x), rgb(var(--primary-gradient)) 10%, rgb(var(--gray-200)) 23%)",
                }}
                initial={false}
                animate={{
                  "--gradient-position-x": `${gradientPositionPercentage}%`,
                  "--circle-size": circleSize,
                }}
              />
            </motion.div>
          </Tabs.List>
        </Tabs.Root>
      </div>
    </MotionConfig>
  );
};
