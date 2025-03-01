import { motion } from "framer-motion";
import React from "react";

interface CardProps {
  children: React.ReactNode;
  href: string;
}

export const Card = ({ children, href }: CardProps) => {
  return (
    <motion.a
      initial={{ opacity: 0.5, filter: "blur(4px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.5 }}
      href={href}
      className="bg-zinc-900 h-fit text-white overflow-hidden rounded-xl cursor-pointer border border-transparent hover:border-zinc-600 transition-colors duration-300 focus:outline-0 focus-visible:border-zinc-600"
    >
      {children}
    </motion.a>
  );
};
