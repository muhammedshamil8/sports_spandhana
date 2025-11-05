import * as React from "react";
import { useRef, useEffect, useState } from "react";
import { motion, sync, useCycle } from "framer-motion";
import { useDimensions } from "./use-dimensions";
import { MenuToggle } from "./MenuToggle";
import { Navigation } from "./Navigation";

const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 50px 45px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2
    }
  }),
  closed: {
    clipPath: "circle(20px at 50px 45px)",
    transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 400,
      damping: 40
    }
  }
};

export const Example = () => {
  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);
  const [closedClass, setClosedClass] = useState('closed');
  const closeSidebar = () => {
    toggleOpen();
  };
  useEffect(() => {
    if (isOpen) {
      console.log("Sidebar is open");
      setClosedClass('open');
    } else {
      const timeoutId = setTimeout(() => {
        setClosedClass('closed');
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);
  return (
    <motion.nav
      initial={false}
      animate={isOpen ? "open" : "closed"}
      custom={height}
      ref={containerRef}
      className={isOpen ? "sideBarOpen" : "sideBarClosed"}
    >
      <motion.div className="background backdrop-blur-lg " variants={sidebar} />
      <div className={closedClass}>
        <Navigation closeSidebar={closeSidebar} />
      </div>
      <MenuToggle toggle={() => toggleOpen()}
      />
    </motion.nav>
  );
};
