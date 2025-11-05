
import { motion } from "framer-motion"
import { NavLink } from 'react-router-dom'
import Carousal from '../Result/Carousal'
function Result() {
  return (
    <div className=' mb-36  max-w-[800px] mx-auto'>
        <h1 className=' font-bold text-3xl text-center'>Recent Results</h1>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1, transition: { duration: 1, delay: 0.5 } }}
        viewport={{ once: true }}
      >
        <div className='w-full flex gap-3 items-center m-auto' id='result'>
          <Carousal />

        </div>
        <div className='mt-10 flex w-full items-center justify-center ' >
          <NavLink
            to="/results"
            className=' text-center text-white bg-[#280B0C] capitalize rounded-md py-2 px-4 font-semibold cursor-pointer hover:bg-[#06094C] transition-all ease-in-out '>Other Results</NavLink>
        </div>
      </motion.div>

    </div>

  )
}

export default Result