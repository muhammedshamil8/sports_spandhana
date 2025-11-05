import { Link } from 'react-scroll';
import { NavLink } from 'react-router-dom';
import Logo from '../../assets/arts/logo.png';
import { useEffect, useState } from 'react';
import { Example } from "../SideBar/Example";
import '../../styles/NavBar.css';

function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 100);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navClass = isScrolled
    ? 'bg-gradient-to-b from-black to-gray-100/20 backdrop-blur-sm '
    : '';

  return (
    <div>

    <div className={`lg:hidden fixed top-0 w-full text-white p-12 flex items-center justify-between z-50 cursor-pointer h-6  ${navClass}`}>
      <div className='nav-button'>
      <Example />
      </div>
      <div className='flex w-full justify-end'>
        <Link

          className='navLogo'
          to="hero"
          spy={true}
          smooth={true}
          offset={0}
          duration={500} >
          <img src={Logo} className='nav-logo' alt="logo" />

        </Link>
      </div>
    </div>

      <div className={`hidden lg:flex fixed top-0 w-full text-white p-12  items-center justify-between z-50 cursor-pointer h-6  ${navClass}`}>
        <Link

          className='navLogo'
          to="hero"
          spy={true}
          smooth={true}
          offset={0}
          duration={500} >
          <img src={Logo} className='w-24' alt="logo" />

        </Link>


        <div className='flex gap-10 text-xl '>
          <Link
            activeClass="navActive"
            className='navlink font-semibold'
            to="hero"
            spy={true}
            smooth={true}
            offset={0}
            duration={500} >Home</Link>
          <Link activeClass="navActive"
            className='navlink font-semibold'
            to="scoreBoard"
            spy={true}
            smooth={true}
            offset={-100}
            duration={500} >Score Board</Link>
          <NavLink
            className='navlink font-semibold'
            to="/results"
          >Result</NavLink>
          <Link activeClass="navActive"
            className='navlink font-semibold' 
            to="committee"
            spy={true}
            smooth={true}
            offset={-100}
            duration={500} >Committee</Link>
          <Link activeClass="navActive"
            className='navlink font-semibold'
            to="captains"
            spy={true}
            smooth={true}
            offset={-50}
            duration={500} >Captains</Link>
        </div>
      </div>
    </div>


  );
}

export default NavBar;
