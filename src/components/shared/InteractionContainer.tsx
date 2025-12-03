import React, { RefObject, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftCircle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { getLightnessFromRgb } from '../../utils/color';

const useBadgeColor = (elementRef: RefObject<HTMLElement>) => {
    const [badgeColor, setBadgeColor] = useState<'light' | 'dark' | null>(null);
    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;
        const color = getComputedStyle(element).backgroundColor;
        const [r, g, b] = color.match(/\d+/g)?.map(Number) || [0, 0, 0];
        const lightness = getLightnessFromRgb(r, g, b);
        setBadgeColor(lightness > 50 ? 'light' : 'dark');
    }, [elementRef]);
    return badgeColor;
}

interface InteractionContainerProps extends React.ComponentPropsWithoutRef<'div'> {
    badgePosition?: 'top' | 'bottom',
}

export const InteractionContainer: React.FC<InteractionContainerProps> = ({ children, badgePosition = 'top', className, ...restOfTheProps }) => {
    const ref = useRef<HTMLDivElement>(null);
    const badgeColor = useBadgeColor(ref);
    return (
        <div ref={ref} className={cn("flex flex-col items-center justify-center h-svh w-full", className)} {...restOfTheProps}>
            {badgeColor ? <a
                className={cn("fixed left-1/2 origin-top -translate-x-1/2 scale-120 md:scale-90 z-10 md:hover:scale-[0.95] duration-150", badgePosition === 'top' ? 'top-3' : 'bottom-3')}
                href="https://peerlist.io/lakbychance/project/animations" target="_blank" rel="noreferrer">
                <img
                    src={`https://peerlist.io/api/v1/projects/embed/PRJHEOL8KAAMOQ8NR1RREBGNJA8QP8?showUpvote=true&theme=${badgeColor}`}
                    alt="Animations"
                />
            </a> : null}
            {children}
            <Link aria-label="Go back to home" className='fixed top-3 left-3 text-white mix-blend-difference contrast-50 focus:outline-none focus-visible:ring-2 focus:ring-white rounded-full
              hover:transform-[scale(1.1)] duration-150 hover:contrast-100
            ' to='/'
            >
                <ArrowLeftCircle className='w-8 h-8' />
            </Link>
        </div>

    )
}