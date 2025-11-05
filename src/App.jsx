import Hero from './components/Home/Hero'
import NavBar from './components/Home/NavBar'
import Captains from './components/Home/Captains'
import Footer from './components/Home/Footer'
import Committe from './components/Home/Committe'
import ScoreBoard from './components/Home/ScoreBoard'
// import Individual from './components/Home/Individual'
import Result from './components/Home/Result'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCableCar } from '@fortawesome/free-solid-svg-icons';
import { animateScroll } from 'react-scroll';
import { useEffect, useState } from 'react';
function Home() {
  const options = {
    duration: 500,
    smooth: true,
  };
  const [isScrolled, setIsScrolled] = useState(false);
  const handleScroll = () => {
    // Calculate the scroll position
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    // Set a threshold value to determine when to change the opacity
    const scrollThreshold = 100;

    // Update the state based on the scroll position
    setIsScrolled(scrollY > scrollThreshold);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const navClass = isScrolled ? 'opacity-100 delay-100' : 'opacity-0';

  return (
    <div className='mx-auto overflow-hidden select-none'>
      <NavBar />
      <Hero />
      <div className='container mx-auto'>
        <div id='scoreBoard'>
          <ScoreBoard />
          <Result />
          {/* <Individual /> */}
        </div>
        <Committe />
        <Captains />
      </div>
      <Footer />



      {/* back to top  */}
      <div className={`fixed bottom-6 right-6  ${navClass}`}>
        <button onClick={() => animateScroll.scrollToTop(options)} className='bg-white p-3 rounded-full'>
          {/*change log now its just for fun */}
          <FontAwesomeIcon icon={faCableCar} />
        </button>
      </div>
    </div>
  )
}

export default Home
