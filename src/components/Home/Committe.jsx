
import Shahina from '../../assets/arts/Shahina.png'
import Safa from '../../assets/arts/Safa.png'
import Sheela from '../../assets/arts/Sheela.png'
import Fayis from '../../assets/sports/fayis.png'
import Akhila from  '../../assets/sport/Akhila.png'
import Saeed from '../../assets/arts/Saeed.png'
import Adwaid from  '../../assets/sports/Adwaid.png'

import { motion } from "framer-motion"

function Committe() {
  return (
    <div className='w-full mx-auto ' id='committee' >
      <h1 className='font-bold text-3xl text-center mb-10 text-black'>Committee</h1>
      <main className='flex flex-col gap-16 p-4 mx-auto items-center '>
        {/* Main Committe */}
        <section className='flex gap-10  mx-auto items-center justify-center  max-w-full main-committe-parent'>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className='flex flex-col items-center justify-center'>
              <div className='flex items-center justify-end  w-full'>
                <h1 className='font-bold text-[#73052F] text-2xl  uppercase leading-6 text-right main-committee-heading'>
                  DIRECTOR</h1>
              </div>
              <div className='relative main-committee overflow-hidden'>
                <img src={ishaaq} alt='main1' className='w-full h-full object-cover' />
                <div className='absolute  h-20 w-10 -top-8 -left-5 rotate-45 background-custom-color' ></div>
                <div className='absolute background-custom-color h-[70px] w-10 -bottom-8 -right-5 rotate-45'></div>
              </div>
              <div className='flex items-center justify-start  w-full'>
                <h3 className='font-semibold text-2xl leading-6 text-gray-900 mt-2 main-committee-name'>Ishaaq</h3>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <div className='flex flex-col items-center justify-center '>
              <div className='flex items-center justify-end  w-full'>
                <h1 className='font-bold text-[#73052F] text-2xl  uppercase leading-6 text-right main-committee-heading'>DIRECTOR</h1>
              </div>
              <div className='relative main-committee overflow-hidden'>
                <img src={yasin} alt='main1' className='w-full h-full object-cover' />
                <div className='absolute background-custom-color h-20 w-10 -top-8 -left-5 rotate-45'></div>
                <div className='absolute background-custom-color h-[70px] w-10 -bottom-8 -right-5 rotate-45'></div>
              </div>
              <div className='flex items-center justify-start  w-full'>
                <h3 className='font-semibold text-2xl leading-6 text-gray-900 mt-2 main-committee-name'>Yasin</h3>
              </div>
            </div>
          </motion.div>
        </section>
        <section className='flex flex-col gap-2 items-center '>

          <div className='text-center flex items-center gap-6  relative  mb-3 overflow-hidden w-full'>
            <span className='h-0 w-0 border-b-[15px] border-t-[15px] border-l-[30px] border-l-[#73052F] border-transparent absolute -left-4'></span>
            <hr className='border-[2px] border-[#73052F] w-1/2 mx-auto' />
            <span className='text-3xl font-bold  uppercase text-[#73052F] text-nowrap onstage-committee-heading'>JOIN CONVENER</span>
            <hr className='border-[2px] border-[#73052F] w-1/2 mx-auto' />
            <span className='h-0 w-0 border-b-[15px] border-t-[15px] border-r-[30px] border-r-[#73052F] border-transparent absolute -right-4'></span>
          </div>
        
            {/* OnStage Commiite */}

            <div className='flex gap-4 w-full mx-auto onstage-committee-parent'>
            <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1, transition: { duration: 1, delay: 0.2 } }}
            viewport={{ once: true }}
          >
              <div className='flex flex-col items-center justify-center '>
                <div className='relative onstage-committee overflow-hidden'>
                  <img src={Adwaid} alt='main1' className='w-full h-full object-cover' />
                  <div className='absolute h-20 w-8 -top-8 -left-5 rotate-[55deg]  background-custom-color'></div>
                  <div className='absolute background-custom-color h-[70px] w-10 -bottom-8 -right-5  rotate-[55deg]'></div>
                </div>
                <div className='flex items-center justify-start  w-full'>
                  <h3 className='font-semibold text-gray-800 text-xl mt-2 capitalize text-wrap onstage-committee-name'>Adwaid U</h3>
                </div>
              </div>
              </motion.div>
              <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1, transition: { duration: 1, delay: 0.4 } }}
            viewport={{ once: true }}
          >
              <div className='flex flex-col items-center justify-center'>
                <div className='relative onstage-committee overflow-hidden'>
                  <img src={Saeed} alt='main1' className='w-full h-full object-cover' />
                  <div className='absolute h-20 w-8 -top-8 -left-5 rotate-[55deg] background-custom-color'></div>
                  <div className='absolute background-custom-color h-[70px] w-10 -bottom-8 -right-5  rotate-[55deg]'></div>
                </div>
                <div className='flex items-center justify-start  w-full'>
                  <h3 className='font-semibold text-gray-800 text-xl mt-2 capitalize text-wrap onstage-committee-name'>Saeed</h3>
                </div>
              </div>
              </motion.div>
              <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1, transition: { duration: 1, delay: 0.6 } }}
            viewport={{ once: true }}
          >
              <div className='flex flex-col items-center justify-center mt-5'>
                <div className='relative onstage-committee  overflow-hidden -mt-5'>
                  <img src={Akhila} alt='main1' className='w-full h-full object-cover' />
                  <div className='absolute h-20 w-8 -top-8 -left-5 rotate-[55deg]  background-custom-color'></div>
                  <div className='absolute background-custom-color h-[70px] w-10 -bottom-8 -right-5  rotate-[55deg]'></div>
                </div>
                <div className='flex items-center justify-start  w-full'>
                  <h3 className='font-semibold text-gray-800 text-xl mt-2 capitalize text-wrap onstage-committee-name'>Akhila K</h3>
                </div>
              </div>
              </motion.div>
              <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1, transition: { duration: 1, delay: 0.8 } }}
            viewport={{ once: true }}
          >
              <div className='flex flex-col items-center justify-center'>
                <div className='relative onstage-committee overflow-hidden'>
                  <img src={Fayis} alt='main1' className='w-full h-full object-cover ' />
                  <div className='absolute h-full w-2 top-0 bottom-0 left-0  background-custom-color '></div>
                  <div className='absolute h-20 w-8 -top-8 -left-5 rotate-[55deg] background-custom-color'></div>
                  <div className='absolute background-custom-color h-[70px] w-10 -bottom-8 -right-5  rotate-[55deg]'></div>
                </div>
                <div className='flex items-center justify-start  w-full'>
                  <h3 className='font-semibold text-gray-800 text-xl mt-2 capitalize text-wrap onstage-committee-name'>Fayis</h3>
                </div>
              </div>
              </motion.div>
            </div>
        </section>

      

      </main>
    </div>

  )
}

export default Committe