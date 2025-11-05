import React from "react";
import { motion } from "framer-motion";
import { Link } from 'react-scroll';
import { NavLink } from "react-router-dom";


const variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 }
    }
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 }
    }
  }
};

export const MenuItem = ({ item, closeSidebarOK }) => {
  const { name, link, color } = item;
  const style = { border: `2px solid ${color}` };
  const handleClick = () => {

    closeSidebarOK();
    console.log('clicked');
  };

  return (
    <motion.li
      variants={variants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >

      <div className='flex gap-4 text-xl pl-12 py-2 '  >
        {link === '/results' ? <NavLink to={link} onClick={handleClick} style={style} className='navlink w-48 flex items-center justify-center rounded-xl py-1  text-orange-900 font-semibold'>{name}</NavLink> :
          <Link
            activeClass="navActive2"
            className='navlink w-48 flex items-center justify-center rounded-xl py-1 text-orange-900 font-semibold z-0'
            to={link}
            spy={true}
            smooth={true}
            offset={-100}
            delay={800}
            duration={800}
            style={style}
            onClick={handleClick}
          >
            {name}
          </Link>
        }
      </div>
      {/* <div className="icon-placeholder" style={style} /> */}
      <div className="text-placeholder" />
    </motion.li>
  );
};
