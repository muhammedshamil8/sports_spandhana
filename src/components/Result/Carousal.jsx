import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/config/fbase';
import { motion } from "framer-motion"
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
import offStagePoster from '../../assets/Poster/offStage.jpg';
import onStagePoster from '../../assets/Poster/onstage.jpg';
import Firstbadge from '../../assets/Poster/1st.png';
import Secondbadge from '../../assets/Poster/2nd.png';
import Thirdbadge from '../../assets/Poster/3rd.png';
import Union from '../../assets/Poster/40thUnion.png';
import Logo from '../../assets/Poster/logo.png';
import '../../styles/Carousal.css';
import Congrats from '../../assets/Poster/cngrts.png';

const Carousal = () => {
  const [resultList, setResultList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  // Add window resize listener
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch results from Firebase
        const resultsQuery = query(
          collection(db, 'programResults'),
          orderBy('timestamp', 'desc')
        );

        const snapshot = await getDocs(resultsQuery);
        
        const results = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            programName: data.programName || '',
            stage: (data.stage || '').toUpperCase(),
            winners: data.winners || [],
            createdAt: data.timestamp,
          };
        });

        setResultList(results);
      } catch (err) {
        console.error("Error fetching results from Firebase:", err);
        setError("Failed to load results. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const groupWinnersByPosition = (winners) => {
    const groupedWinners = {};
    winners.forEach((winner) => {
      const position = winner.position;
      if (!groupedWinners[position]) {
        groupedWinners[position] = [];
      }
      groupedWinners[position].push(winner);
    });
    return groupedWinners;
  };

  const getBadgeImage = (position) => {
    switch (position) {
      case "1st":
        return Firstbadge;
      case "2nd":
        return Secondbadge;
      case "3rd":
        return Thirdbadge;
      default:
        return '';
    }
  };

  // Function to determine content positioning based on screen size
  const getContentPosition = () => {
    if (windowWidth <= 480) {
      return { left: '8px', top: '38%' };
    } else if (windowWidth <= 768) {
      return { left: '12px', top: '42%' };
    } else {
      return { left: '19px', top: '30%' };
    }
  };

  const contentPosition = getContentPosition();

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {loading ? (
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          slidesPerView={'auto'}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          modules={[EffectCoverflow, Navigation, Pagination, Autoplay]}
          className="mySwiper rounded-md skeleton-loading flex gap-10 mx-auto"
        >
          {[1, 2, 3, 4].map((item) => (
            <SwiperSlide key={item}>
              <div className="skeleton-item"></div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : resultList.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-500 text-lg">No results available yet.</p>
        </div>
      ) : (
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 200,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          modules={[EffectCoverflow, Navigation, Pagination, Autoplay]}
          className="mySwiper2"
        >
          {resultList.map((item, index) => (
            <SwiperSlide key={item.id || index}>
              <motion.div
                initial={{ opacity: 0, scale: .5 }}
                whileInView={{ opacity: 1, scale: 1, transition: { duration: .5, delay: 0.1 } }}
                viewport={{ once: true }}
              >
                <div className='rounded-xl result-card-respo overflow-hidden'>
                  <div className="mx-auto shadow-xl relative">
                    <img 
                      src={item.stage === "OFF STAGE" ? offStagePoster : onStagePoster} 
                      alt={`${item.stage} Poster`} 
                      className="w-full h-full object-cover responsive-poster-img" 
                    />
                    
                    <div 
                      className="flex flex-col items-start justify-start absolute h-fit"
                      style={{ 
                        left: contentPosition.left, 
                        top: contentPosition.top 
                      }}
                    >
                      <div>
                        <p className="font-bold uppercase respo-program">
                          {item.programName}
                        </p>
                      </div>
                      
                      <div className="flex flex-col rounded-xl gap-1 respo-result-card">
                        {/* Group winners by position and display badge once for each group */}
                        {Object.entries(groupWinnersByPosition(item.winners || [])).map(([position, winners]) => (
                          <div key={position} className="flex gap-3 items-center">
                            <div>
                              <img 
                                src={getBadgeImage(position)} 
                                alt={`${position} Place Badge`} 
                                className="top-0 respo-badge" 
                              />
                            </div>
                            <div className={`flex flex-col items-start justify-center ${winners.length > 1 ? '-mt-1' : '-mt-1'}`}>
                              {/* Display winner(s) and department(s) for each position */}
                              {winners.map((winner, winnerIndex) => (
                                <div key={winnerIndex} className='flex flex-col items-start justify-center'>
                                  <p className={`font-semibold respo-winner ${winners.length > 1 ? 'more-winners' : ''}`}>
                                    {winner.name}
                                  </p>
                                  <p className={`respo-winner-year text-black items-centre ${winners.length > 1 ? 'more-winners-year' : ''}`}>
                                    {winner.team && <span>{winner.team}</span>}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </>
  );
};

export default Carousal;