import { Home, BarChart, Settings } from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";
import { useState, useLayoutEffect, useRef } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import clsx from "clsx";

const TAB_IDS = {
    HOME: 'home',
    STATS: 'stats',
    SETTINGS: 'settings',
} as const;

type TabId = typeof TAB_IDS[keyof typeof TAB_IDS];

type NavItem = {
    id: TabId;
    label: string;
    icon: React.ReactNode;
};

const NAV_ITEMS: NavItem[] = [
    {
        id: TAB_IDS.HOME,
        label: "Home",
        icon: <Home size={20} />,
    },
    {
        id: TAB_IDS.STATS,
        label: "Stats",
        icon: <BarChart size={20} />,
    },
    {
        id: TAB_IDS.SETTINGS,
        label: "Settings",
        icon: <Settings size={20} />,
    },
] as const;

export const GoStepsClubNavigation = () => {
    const [activeTab, setActiveTab] = useState<TabId>(TAB_IDS.HOME);
    const tabRefs = useRef<{ [key in TabId]?: HTMLButtonElement | null }>({});
    const activeTabRef = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
        const activeTabElement = tabRefs.current[activeTab];
        const activeTabOverlay = activeTabRef.current;
        if (activeTabElement && activeTabOverlay) {
            const tabWidth = activeTabElement.getBoundingClientRect().width;
            const tabLeft = activeTabElement.offsetLeft;
            activeTabOverlay.style.setProperty('--tab-width', `${tabWidth}px`);
            activeTabOverlay.style.setProperty('--tab-left', `${tabLeft}px`);
        }
    }, [activeTab]);

    return (
        <MotionConfig transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}>
            <div className="h-screen font-[Inter] w-full bg-white">
                <div className="flex flex-col items-center justify-center h-full">
                    <Tabs.Root
                        className="relative"
                        defaultValue={TAB_IDS.HOME}
                        onValueChange={(value) => setActiveTab(value as TabId)}
                    >
                        <Tabs.List
                            asChild
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                transition={{ duration: 1, ease: "easeInOut" }}
                                className="bg-zinc-800 rounded-full justify-between p-1 flex items-center min-w-[210px] overflow-hidden"
                                aria-label="Navigation tabs"
                            >
                                <motion.div
                                    ref={activeTabRef}
                                    className="absolute inset-1 rounded-full bg-white"
                                    layout
                                    transition={{ type: "spring", bounce: 0.3 }}
                                    style={{
                                        width: "var(--tab-width, 40px)",
                                        left: "var(--tab-left, 8px)",
                                    }}
                                />


                                {NAV_ITEMS.map((item) => (
                                    <Tabs.Trigger
                                        key={item.id}
                                        value={item.id}
                                        ref={(el) => tabRefs.current[item.id] = el}
                                        asChild
                                    >
                                        <button className={clsx("flex items-center gap-1 px-2 py-3 rounded-full relative", activeTab === item.id && "px-5")}   >
                                            <motion.div
                                                layoutId={`tab-${item.id}`}
                                                style={{

                                                    color: activeTab === item.id ? "#000000" : "#a1a1aa"
                                                }}
                                                transition={{ type: "spring", bounce: 0.3 }}
                                            >
                                                {item.icon}
                                            </motion.div>
                                            <AnimatePresence initial={false} mode="popLayout">
                                                {activeTab === item.id && (
                                                    <motion.span
                                                        key={`${item.id}-label`}
                                                        layout
                                                        className="font-semibold text-xs"
                                                        animate={{
                                                            opacity: 1,

                                                        }}
                                                        initial={{ opacity: 0 }}
                                                        exit={{ opacity: 0 }}
                                                    >
                                                        {item.label}
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </button>
                                    </Tabs.Trigger>
                                ))}

                            </motion.div>
                        </Tabs.List>
                    </Tabs.Root>
                </div>
            </div>
        </MotionConfig>
    );
};
