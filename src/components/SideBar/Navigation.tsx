import React from "react";
import { motion } from "framer-motion";
import { MenuItem } from "./MenuItem";

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 }
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 }
  }
};

const items = [
  { name: 'Home', link: 'hero', color: 'brown' },
  { name: 'Score Board', link: 'scoreBoard', color: 'brown' },
  { name: 'Result', link: '/results', color: 'brown' },
  { name: 'Committee', link: 'committee', color: 'brown' },
  { name: 'Captains', link: 'captains', color: 'brown' }
];
const closeSidebar = () => {
  console.log('clickedwww');
}

export const Navigation = ({closeSidebar}) => (
  <motion.ul variants={variants}>
    {items.map((item, i) => (
      <MenuItem key={i} item={item} closeSidebarOK={closeSidebar} />
    ))}
  </motion.ul>
);
