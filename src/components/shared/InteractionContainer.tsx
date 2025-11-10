import React from 'react';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';
import { ArrowLeftCircle } from 'lucide-react';


export const InteractionContainer: React.FC<React.ComponentPropsWithoutRef<'div'>> = ({ children, className, ...restOfTheProps }) => {
    return (
        <div className={clsx("flex flex-col items-center justify-center h-screen w-full", className)} {...restOfTheProps}>
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