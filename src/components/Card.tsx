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
      className="bg-[#1a1a1a] text-base text-center lg:text-xl items-center justify-center flex text-white p-8 rounded-xl cursor-pointer border border-transparent hover:border-white transition-colors duration-300 focus:outline-0 focus-visible:border-white"
    >
      {children}
    </motion.a>
  );
};
