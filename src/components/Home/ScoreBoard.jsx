import { useEffect, useState } from "react";
import { motion } from "framer-motion"
import '../../styles/ScoreBoard.css';
import start1 from '../../assets/star/filled/thinsmooth-1.svg';
import start2 from '../../assets/star/filled/thinsmooth-2.svg';
import start3 from '../../assets/star/filled/thinsmooth-3.svg';
import start4 from '../../assets/star/filled/thinsmooth-4.svg';
import start5 from '../../assets/star/filled/thinsmooth.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
// import { db } from "../../config/fbase"; // Make sure this path matches your Firebase config file
import {db} from "../../config/fbase";
function ScoreBoard() {
  const [scoreBoardData, setScoreBoardData] = useState([]);
  const [animationRunning, setAnimationRunning] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Create a query to get teams ordered by totalPoints in descending order
        const teamsQuery = query(
          collection(db, "teams"), 
          orderBy("totalPoints", "desc")
        );
        
        const querySnapshot = await getDocs(teamsQuery);
        
        const teamsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          fields: {
            Total: doc.data().totalPoints
          }
        }));
        
        setScoreBoardData(teamsData);
        
        // If there's at least one team, start the animation
        if (teamsData.length > 0) {
          setAnimationRunning(true);
          
          // Stop animation after 3 seconds
          setTimeout(() => {
            setAnimationRunning(false);
          }, 3000);
        }
      } catch (error) {
        console.error("Error fetching teams data:", error);
      }
    };

    fetchData();
  }, []);

  function getCardNumber(name){
    if(name === "Green"){
      return 4;
    }else if (name === "Yellow"){
      return 3;
    }else if (name === "Blue"){
      return 2;
    }else if (name === "Red"){
      return 1;
    }
  }

  return (
    <div className='my-20'>
      <div className='w-full'>
        <h1 className='font-bold text-3xl text-center capitalize mb-20'>Score Board</h1>
        {scoreBoardData.length ? (
          <div className="gap-3 responsive--scoreBoard">
            {animationRunning && <Fireworks autorun={{ speed: 1 }} />}
            {scoreBoardData.map((item, index) => (
              <div key={item.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                  viewport={{ once: true }} 
                  className={`w-56 h-72 rounded-lg shadow-lg relative card card${getCardNumber(item.name)}`}
                >
                  {/* stars for first position */}
                  {/* {index === 0 && (
                    <div className='absolute -top-7 left-0 w-full rounded-lg'>
                      <div className="flex h-14 gap-2 items-center justify-around">
                        <img src={start1} className="h-14" alt="star1" />
                        <img src={start2} className="h-14" alt="star2" />
                        <img src={start5} className="h-14" alt="star5" />
                      </div>
                      <div className="flex items-center justify-around mx-6">
                        <img src={start3} className="h-10" alt="star3" />
                        <img src={start4} className="h-10" alt="star4" />
                      </div>
                    </div>
                  )} */}
                  
                  {/* custom css for Positions */}
                  <div className={`absolute text-9xl font-bold top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 card-child-${getCardNumber(item.name)}`}>
                    {index + 1}
                  </div>
                  
                  <div className="flex items-center justify-center w-full h-full z-10 text-center flex-col">
                    <h6 className={`text-3xl uppercase mt-20 font-bold card-team-${getCardNumber(item.name)}`}>
                      {item.name}
                    </h6>
                    <span className="mt-14 text-center text-2xl mx-auto font-bold">
                      {item.fields.Total} <span className="font-semibold text-lg">pts</span>
                    </span>
                  </div>
                </motion.div>
                
                {index % 2 !== 0 && <div className="scoreCard--responsive" />}
              </div>
            ))}
          </div>
        ) : (
          <div className="mx-auto my-4 w-full flex items-center justify-center">
            <span className="font-semibold mx-auto">
              Loading <FontAwesomeIcon icon={faSpinner} className="animate-spin ml-2" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScoreBoard;