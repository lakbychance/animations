import { Undo2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { InteractionContainer } from "../shared/InteractionContainer";

const CountdownTimer = ({ initialSeconds, intervalSeconds = 1, onFinish = () => { } }: { initialSeconds: number, intervalSeconds?: number, onFinish?: () => void }) => {
    const [seconds, setSeconds] = useState(initialSeconds);
    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds((seconds) => {
                if (seconds === 0) {
                    onFinish();
                    clearInterval(timer);
                    return seconds;
                }
                return seconds - 1;
            });
        }, intervalSeconds * 1000);
        return () => clearInterval(timer);
    }, [intervalSeconds, onFinish]);
    const secondsString = `${seconds}`
    const digits = secondsString.split('');
    return (
        <div style={{ boxShadow: `inset 0px -4px 10px maroon`, textShadow: `0px 1px 4px maroon` }}
            className="bg-red-500 text-white w-10 py-1 rounded-full">
            <AnimatePresence mode='popLayout' initial={false} >
                {
                    digits.map((digit, index) => {
                        return (
                            <motion.span
                                className="inline-block"
                                key={`${digit}-${index}`}
                                transition={{ delay: index * 0.1, type: 'spring', bounce: 0.3, stiffness: 180, damping: 15 }}
                                initial={{ y: -10, scale: 0.8, filter: 'blur(3px)', opacity: 0 }}
                                animate={{ y: 0, scale: 1, filter: 'blur(0px)', opacity: 1 }}
                                exit={{ y: 10, scale: 0.8, filter: 'blur(3px)', opacity: 0 }}>{digit}</motion.span>
                        )
                    })
                }
            </AnimatePresence>
        </div>
    );
};

const DELETE_STATUS = {
    INITIAL: "initial",
    IN_PROGRESS: "in-progress",
    CANCELLED: "cancelled",
    DELETED: "deleted",
} as const;

const StaggeredText = ({ text, initialAnimationEnabled = true }: { text: string, initialAnimationEnabled?: boolean }) => {
    const characters = text.split('');
    return (
        // This position:relative is intentional. It prevents the text from layout shift
        // The layout prop here ensures that text doesn't stretch too much
        <motion.div layout style={{ position: 'relative' }}>
            <AnimatePresence mode='popLayout' initial={initialAnimationEnabled}>
                {characters.map((char, index) => {
                    if (char === ' ') return <span key={`nbsp-${index}`}>&nbsp;</span>
                    return (
                        <motion.span className="inline-block" key={`${char}-${index}`} initial={{
                            y: 12,
                            filter: 'blur(4px)',
                            opacity: 0,
                            scale: 0.8
                        }} animate={{ y: 0, filter: 'blur(0px)', opacity: 1, scale: 1 }} exit={{ y: -12, filter: 'blur(4px)', opacity: 0, scale: 0.8 }} transition={{
                            delay: index * 0.01,
                        }}>
                            {char}
                        </motion.span>
                    )
                })}

            </AnimatePresence>
        </motion.div>

    )
}

export const TimedUndoButtonComponent = () => {
    const [status, setStatus] = useState<
        (typeof DELETE_STATUS)[keyof typeof DELETE_STATUS]
    >(DELETE_STATUS.INITIAL);

    const hasStatusChanged = status !== DELETE_STATUS.INITIAL;

    const isDeleting = status === DELETE_STATUS.IN_PROGRESS;
    const isDeleted = status === DELETE_STATUS.DELETED;

    const onTimerEnd = () => {
        setStatus(DELETE_STATUS.DELETED);
    }

    return (
        <AnimatePresence initial={false} onExitComplete={() => setTimeout(() => setStatus(DELETE_STATUS.INITIAL), 200)}>
            {!isDeleted ? (
                <motion.button
                    disabled={isDeleted}
                    exit={{ opacity: 0, filter: 'blur(4px)' }}
                    whileTap={{ scale: 0.8 }}
                    layout
                    transition={{
                        type: 'spring', bounce: 0.4, duration: 1,
                    }}
                    style={{
                        // needed to make sure the layout transition doesn't skew border radius
                        borderRadius: '9999px',
                        boxShadow: `inset 0px -8px 8px ${isDeleting ? 'pink' : 'maroon'}`,
                        ...(!isDeleting && { textShadow: `0px 1px 4px maroon` })
                    }}
                    initial={{
                        color: '#fff'
                    }}
                    animate={{
                        backgroundColor: isDeleting ? '#fef2f2' : '#ef4444',
                        color: isDeleting ? '#ef4444' : '#fff',
                    }}
                    onClick={() => {
                        setStatus(prevStatus => {
                            if (prevStatus === DELETE_STATUS.INITIAL || prevStatus === DELETE_STATUS.CANCELLED) return DELETE_STATUS.IN_PROGRESS;
                            return DELETE_STATUS.CANCELLED;
                        })
                    }}
                    className={clsx("flex items-center gap-2 h-14 py-2 rounded-full", isDeleting ? "px-4" : "px-6")}
                >
                    <>
                        {isDeleting && (
                            <motion.span aria-label='Undo delete account' transition={{ duration: 0.5 }} initial={{ opacity: 0, filter: 'blur(4px)' }} exit={{
                                opacity: 0, filter: 'blur(4px)',
                            }} animate={{ opacity: 1, filter: 'blur(0px)' }} style={{ boxShadow: `inset 0px -4px 8px maroon` }}
                                className="bg-red-500 text-white p-1.5 rounded-full">
                                <Undo2 className="w-5 h-5 stroke-[2.5px]" />
                            </motion.span>)}
                        <motion.div >
                            <StaggeredText initialAnimationEnabled={hasStatusChanged} text={isDeleting ? 'Cancel Deletion' : 'Delete Account'} />
                        </motion.div>
                        {isDeleting && (
                            <motion.div transition={{ duration: 0.5 }} initial={{ opacity: 0, filter: 'blur(4px)' }} exit={{
                                opacity: 0, filter: 'blur(4px)'
                            }} animate={{ opacity: 1, filter: 'blur(0px)' }}  ><CountdownTimer initialSeconds={10} onFinish={onTimerEnd} /></motion.div>
                        )}
                    </>



                </motion.button>
            ) : null}
        </AnimatePresence>
    )

};

export const TimedUndoButton = () => {
    return (
        <InteractionContainer className="font-[inter] font-bold bg-white">
            <TimedUndoButtonComponent />
        </InteractionContainer>
    );
};