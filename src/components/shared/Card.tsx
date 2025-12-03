import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";

interface CardProps {
  children: React.ReactNode;
  href: string;
}

const MotionLink = motion.create(Link);

export const Card = ({ children, href }: CardProps) => {
  return (
    <MotionLink initial={{ opacity: 0.5, filter: "blur(4px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.5 }} to={href} className="bg-zinc-900 h-fit text-white overflow-hidden rounded-xl cursor-pointer border border-zinc-800 hover:border-zinc-500 transition-colors duration-300 focus:outline-0 focus-visible:border-zinc-500">      {children}</MotionLink>
  );
};
