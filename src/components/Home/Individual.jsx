import { useEffect, useState } from "react";
import { fetchRecords } from "../../utils/airtableService";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function Individual() {

  const [individualData, setIndividualData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tableName = 'Participants';
        const filterBy = '';
        const sortField = 'Points';
        const sortDirection = 'desc';
        const maxRecords = 10;
        const Records = await fetchRecords(tableName, filterBy, sortField, sortDirection, maxRecords);
        // console.log(Records)
        setIndividualData(Records)
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);


  return (
    <div className='my-20 mb-40 '>

      <div className=' w-full ' id='individual'>
        <h1 className=' font-bold text-3xl text-center'>Individual Results</h1>
        {individualData.length ? (

          <div className=" p-2 px-4 flex flex-col gap-6 max-w-[600px] mx-auto mt-16">
            <AnimatePresence>

              {individualData.map((item, index) => (

                <motion.div
                  initial={{ opacity: 0, scale: 0, x: -150 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className=" bg-orange-100 flex justify-between p-4 border-2 border-red-900 px-2 shadow-xl rounded-lg select-none"
                  key={index}
                >
                  <div className=" basis-1/5 flex items-center justify-center text-6xl font-semibold text-orange-900/60">
                    <p>{index + 1}</p>
                  </div>
                  <div className=" basis-1/2 flex flex-col justify-center items-start leading-5 py-2 my-2 text-orange-950">
                    <h6 className="font-bold text-lg">{item.fields.Name}</h6>
                    <p>{item.fields.Department} ({item.fields.Year} Year)</p>
                  </div>
                  <div className=" basis-1/3 flex items-end justify-end px-6 text-orange-950">
                    <p className="font-semibold">{item.fields.Points} <span className="font-medium text-lg">pts</span></p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

          </div>
        ) : (
          <div className="mx-auto my-4 w-full  flex items-center justify-center">
  <span className="font-semibold mx-auto">Loading<FontAwesomeIcon icon={faSpinner} className="animate-spin ml-2" /></span>
          </div>
        
        )
        }
      </div>
    </div >

  )
}

export default Individual