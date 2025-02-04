import * as Tooltip from "@radix-ui/react-tooltip";
import * as Popover from "@radix-ui/react-popover";
import { motion, AnimatePresence } from "framer-motion";
import { useState, ReactNode } from "react";
import React from "react";

/* The whole gooey effect is due to the SVG filter */
const GooeyFilter = () => {
  return (
    <svg aria-hidden="true">
      <defs>
        <filter id="goo-effect">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -15"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
};

type GooeyContentProps = {
  open: boolean;
  children: ReactNode;
};

const GooeyContent = ({ children }: GooeyContentProps) => (
  <motion.div
    className="bg-zinc-200 text-zinc-900"
    initial={{
      y: 40,
      x: 5,
      width: 64,
      height: 64,
      borderRadius: 50,
    }}
    animate={{
      y: -10,
      x: 0,
      width: window.innerWidth < 768 ? 200 : 240,
      height: window.innerWidth < 768 ? 108 : 128,
      borderRadius: 24,
    }}
    exit={{
      y: 20,
      x: 15,
      width: 0,
      height: 0,
      borderRadius: 50,
    }}
    transition={{
      duration: 0.75,
      type: "spring",
      bounce: 0.2,
    }}
  >
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,

        transition: {
          delay: 0.15,
        },
      }}
      exit={{
        opacity: 0,

        transition: {
          duration: 0.1,
        },
      }}
      className="flex w-full h-full items-center justify-center pointer-events-none"
    >
      {children}
    </motion.div>
  </motion.div>
);

const GooeyTrigger = React.forwardRef<
  HTMLButtonElement,
  {
    open: boolean;
    setOpen: (open: boolean) => void;
  }
>(
  (
    {
      open,
      setOpen,
    }: {
      open: boolean;
      setOpen: (open: boolean) => void;
    },
    ref
  ) => (
    <motion.button
      initial={{ filter: "blur(4px)" }}
      animate={{ filter: "blur(0px)" }}
      transition={{ duration: 0.5 }}
      ref={ref}
      onClick={() =>
        !window.matchMedia("(min-width: 768px)").matches && setOpen(!open)
      }
      className="w-12 z-10 relative h-12 md:w-16 md:h-16 rounded-full bg-zinc-200 text-zinc-900 flex items-center justify-center md:cursor-pointer"
      onMouseEnter={() =>
        window.matchMedia("(min-width: 768px)").matches && setOpen(true)
      }
      onMouseLeave={() =>
        window.matchMedia("(min-width: 768px)").matches && setOpen(false)
      }
    >
      <span className="scale-125 md:scale-150">?</span>
    </motion.button>
  )
);

const GooeyTooltipComponent = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <Tooltip.Provider delayDuration={0}>
      <Tooltip.Root open={open} onOpenChange={setOpen}>
        <Tooltip.Trigger asChild>
          <GooeyTrigger open={open} setOpen={setOpen} />
        </Tooltip.Trigger>
        <AnimatePresence>
          {open && (
            <Tooltip.Content forceMount align="start">
              <GooeyContent open={open}>{children}</GooeyContent>
            </Tooltip.Content>
          )}
        </AnimatePresence>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

const GooeyPopoverComponent = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <GooeyTrigger open={open} setOpen={setOpen} />
      </Popover.Trigger>
      <AnimatePresence>
        {open && (
          <Popover.Content forceMount align="start">
            <GooeyContent open={open}>{children}</GooeyContent>
          </Popover.Content>
        )}
      </AnimatePresence>
    </Popover.Root>
  );
};

export const GooeyTooltip = () => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const tooltipContent = !isSafari
    ? "Damn that's gooey"
    : "Damn that's not gooey";

  return (
    <div className="flex font-mono flex-col justify-center items-center h-screen w-full bg-[#08090a]">
      <div className="absolute top-0 left-0">
        {!isSafari && <GooeyFilter />}
      </div>
      <div
        style={{ filter: "url(#goo-effect)" }}
        className="relative font-bold"
      >
        {isMobile ? (
          <GooeyPopoverComponent>{tooltipContent}</GooeyPopoverComponent>
        ) : (
          <GooeyTooltipComponent>{tooltipContent}</GooeyTooltipComponent>
        )}
      </div>
      {isSafari && (
        <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-zinc-400">
          * Effect not supported in Safari
        </div>
      )}
    </div>
  );
};
