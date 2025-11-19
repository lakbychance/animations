import { useState } from "react"
import { InteractionContainer } from "../shared/InteractionContainer"
import { AnimatePresence, motion, MotionConfig, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { cn } from "../../utils/cn";
import FocusLock from 'react-focus-lock';

const items = [
    { id: "item-001" },
    { id: "item-002" },
    { id: "item-003" },
    { id: "item-004" },
    { id: "item-005" },
    { id: "item-006" },
    { id: "item-007" },
    { id: "item-008" },
    { id: "item-009" },
    { id: "item-010" },
    { id: "item-011" },
    { id: "item-012" },
    { id: "item-013" },
    { id: "item-014" },
    { id: "item-015" },
    { id: "item-016" },
    { id: "item-017" },
    { id: "item-018" },
    { id: "item-019" },
    { id: "item-020" },

];
type ItemId = string;


export const ChronicleChaptersNavMenu = () => {
    const [selected, setSelected] = useState<ItemId>(items[0].id);
    const [showExpandedMenu, setShowExpandedMenu] = useState(false);
    const { scrollYProgress } = useScroll();
    const currentItemValue = useTransform(scrollYProgress, [0, 1], [0, items.length]);
    const navTranslationY = useTransform(scrollYProgress, [0, 1], [25, -25]);

    useMotionValueEvent(currentItemValue, "change", (itemValue) => {
        const itemIndex = Math.floor(itemValue);
        const item = items[itemIndex];
        if (item) setSelected(item.id);
    })

    const handleSelection = (id: ItemId) => {
        setSelected(id);
        const element = document.getElementById(id);
        // rAF minimizes flicker of nav when selected
        requestAnimationFrame(() => {
            element?.scrollIntoView()
        })
    }

    return (
        <MotionConfig transition={{ duration: showExpandedMenu ? 1 : 0.5, type: 'spring', bounce: showExpandedMenu ? 0.3 : 0.15 }}>
            <InteractionContainer className="font-mono h-auto">
                <motion.nav
                    initial={{
                        y: navTranslationY.get(),
                    }}
                    animate={{
                        y: !showExpandedMenu ? navTranslationY.get() : '0px'
                    }} className="fixed left-4 top-1/2 -translate-y-1/2" onMouseEnter={() => setShowExpandedMenu(true)} onMouseLeave={() => setShowExpandedMenu(false)}>

                    <AnimatePresence mode='popLayout'>
                        {!showExpandedMenu ?
                            <motion.ol
                                animate={{
                                    opacity: 1,
                                    filter: 'blur(0px)',
                                }}
                                exit={{
                                    opacity: 0,
                                    filter: 'blur(8px)',
                                }}
                                key='items-lines' layoutId='items-container' className={cn("flex flex-col gap-1.5 w-10 overflow-clip")}>
                                {items.map((item) =>
                                    <motion.li

                                        layoutId={item.id}
                                        className={cn("h-0.5 bg-zinc-50/50 w-3", selected === item.id && "bg-zinc-50 w-6")}>
                                    </motion.li>
                                )}
                            </motion.ol> :
                            <FocusLock>
                                <motion.ol
                                    animate={{
                                        opacity: 1,
                                        filter: 'blur(0px)',

                                    }} exit={{
                                        opacity: 0,
                                        filter: 'blur(8px)'
                                    }} key='items-cards' layoutId='items-container' className={cn("flex flex-col gap-2 bg-zinc-900/50 border border-zinc-800/50 p-2 rounded-lg max-h-160 overflow-auto no-scrollbar")}>

                                    {items.map((item, index) =>
                                        <motion.li
                                            layoutId={item.id}
                                            id={`${item.id}-card`}

                                        >
                                            <button data-autofocus={selected === item.id} onClick={() => handleSelection(item.id)} className={cn("flex transition-colors items-center text-xl justify-center text-white w-40 h-20 bg-black rounded-md border border-zinc-800/50 hover:border-zinc-600 focus-visible:border-blue-500 ", selected === item.id && "border-zinc-200 hover:border-zinc-200 focus-visible:border-zinc-200")}>
                                                {index + 1}
                                            </button>
                                        </motion.li>
                                    )}

                                </motion.ol>
                            </FocusLock>
                        }
                    </AnimatePresence>

                </motion.nav>

                {items.map((item, index) => <div id={item.id} className="h-svh text-white text-9xl flex items-center justify-center" key={item.id} >
                    {index + 1}
                </div>)}


            </InteractionContainer>
        </MotionConfig>
    )
}