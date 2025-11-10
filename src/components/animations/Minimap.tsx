import clsx from 'clsx';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useState, useCallback, useEffect, useRef } from 'react';
import { InteractionContainer } from '../shared/InteractionContainer';

export const Minimap = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [lineScales, setLineScales] = useState<number[]>(Array(26).fill(1));
    const { scrollYProgress } = useScroll();

    // Transform scroll progress (0-1) to x position (0 to container width - bar width)
    const barX = useTransform(scrollYProgress, [0, 1], [0, (containerRef.current?.offsetWidth ?? 0) - 1]);

    const transformedBarXForBar = useSpring(barX, {
        stiffness: 700,
        damping: 60,
        bounce: 0,
    });

    const transformedBarXForLines = useSpring(transformedBarXForBar, {
        visualDuration: 0.1,
        bounce: 0,
    });

    const calculateScale = (distance: number): number => {
        const maxScale = 3.5;
        const falloffRate = 3;
        return 1 + (maxScale - 1) * Math.exp(-(distance * distance) / falloffRate);
    };

    const updateScales = useCallback((xPosition: number) => {
        const lineWidth = 1;
        const gap = 9;
        const totalWidthPerLine = lineWidth + gap;

        // Calculate exact position relative to lines
        const exactLinePosition = xPosition / totalWidthPerLine;

        // Calculate new scales
        setLineScales(prevScales => prevScales.map((_, index) => {
            const distance = Math.abs(exactLinePosition - index);
            if (distance <= 2.5) {
                return calculateScale(distance);
            }
            return 1;
        }));
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        requestAnimationFrame(() => {
            updateScales(mouseX);
        });
    };

    const handleMouseLeave = () => {
        requestAnimationFrame(() => {
            setLineScales(Array(26).fill(1));
        });
    };

    // Update scales when bar position changes
    useEffect(() => {
        const unsubscribe = transformedBarXForLines.on("change", (latest: number) => {
            updateScales(latest);
        });

        return () => unsubscribe();
    }, [transformedBarXForLines, updateScales]);

    // Create an array of line heights
    const lineHeights = Array(26).fill(null).map((_, index) =>
        (index + 1) % 5 === 1 ? 24 : 18
    );

    return (
        <InteractionContainer className='font-mono bg-[#08090a]'>
            <div aria-hidden="true" className="pointer-events-none user-select-none h-[5000px]"></div>
            <motion.div
                initial={{ opacity: 0, filter: 'blur(4px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.5 }}
                className="fixed top-20 items-end flex gap-[9px]"
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {lineHeights.map((height, index) => (
                    <motion.div
                        key={index}
                        className={clsx('w-[1px]', height === 24 ? 'bg-zinc-200' : 'bg-zinc-400')}
                        initial={{ height }}
                        style={{ height }}
                        animate={{
                            scaleY: lineScales[index]
                        }}
                        transition={{
                            type: "spring",
                            bounce: 0,
                            duration: 0.3
                        }}
                    />
                ))}
                <motion.div
                    className="w-[1px] h-screen flex flex-col items-center bg-orange-400 absolute -top-8 left-0"
                    style={{
                        x: transformedBarXForBar
                    }}
                >
                    <svg width="10" height="8" viewBox="0 0 7 6" fill="none" className="translate-y-[-12px]"><path className='fill-orange-400' d="M3.54688 6L0.515786 0.75L6.57796 0.75L3.54688 6Z"></path></svg>
                </motion.div>
            </motion.div>
        </InteractionContainer>
    )
};
