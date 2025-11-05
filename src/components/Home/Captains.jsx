import { motion } from "framer-motion"
import '../../styles/Responsive.css'
import Fathima_Asela_M from '../../assets/arts/Fathima_Asela_M.png'
import Subeena from  '../../assets/arts/Subeena.png'
import Jabeera_Sherin from '../../assets/arts/Jabeera_Sherin.png'
import Shahira from  '../../assets/arts/Shahira.png'
import Arathi from  '../../assets/arts/Arathi.png'
import Misha_Manoj from  '../../assets/arts/Misha_Manoj.png'
import Muhammed_Fahad from  '../../assets/arts/Muhammed_Fahad.png'
import Fathima_Rabeeha from  '../../assets/arts/Fathima_Rabeeha.png'
import Munavvar from  '../../assets/arts/munnavar.png'
import Shamil from  '../../assets/arts/shamil.png'
import Saleel from  '../../assets/arts/saleel.png'

function Captains() {


    return (
        <div id='captains' className='my-16 '>
            <div className='flex flex-col gap-16 p-4 mx-auto items-center max-w-[900px]'>
               <section className='flex flex-col gap-2 items-center '>
              
                        <div className='text-center flex items-center gap-6  relative  mb-3 overflow-hidden w-full'>
                          <span className='h-0 w-0 border-b-[15px] border-t-[15px] border-l-[30px] border-l-[#73052F] border-transparent absolute -left-4'></span>
                          <hr className='border-[2px] border-[#73052F] w-1/2 mx-auto' />
                          <span className='text-3xl font-bold  uppercase text-[#73052F] text-nowrap onstage-committee-heading'>Captains</span>
                          <hr className='border-[2px] border-[#73052F] w-1/2 mx-auto' />
                          <span className='h-0 w-0 border-b-[15px] border-t-[15px] border-r-[30px] border-r-[#73052F] border-transparent absolute -right-4'></span>
                        </div>
                      
                          {/* OnStage Commiite */}
              
                          <div className='flex gap-4 w-full mx-auto onstage-committee-parent'>
                            <div>
                            <div className="flex flex-col mb-6">
                                <h1 className="font-bold flex justify-center text-[#88011A] align-center text-xl mb-4">RED</h1>
                            <div className="flex gap-4 w-full mx-auto">

                          <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          whileInView={{ opacity: 1, scale: 1, transition: { duration: 1, delay: 0.2 } }}
                          viewport={{ once: true }}
                        >
                            <div className='flex flex-col items-center justify-center '>
                              <div className='relative onstage-committee overflow-hidden'>
                                <img src={Fathima_Asela_M} alt='main1' className='w-full h-full object-cover' />
                                <div className='absolute h-20 w-8 -top-8 -left-5 rotate-[55deg]  background-custom-color'></div>
                                <div className='absolute background-custom-color h-[70px] w-10 -bottom-8 -right-5  rotate-[55deg]'></div>
                              </div>
                              <div className='flex items-center justify-start  w-full'>
                                <h3 className='font-semibold text-gray-800 text-xl mt-2 capitalize text-wrap onstage-committee-name'>Fathima Asela M</h3>
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
                                <img src={Subeena} alt='main1' className='w-full h-full object-cover' />
                                <div className='absolute h-20 w-8 -top-8 -left-5 rotate-[55deg] background-custom-color'></div>
                                <div className='absolute background-custom-color h-[70px] w-10 -bottom-8 -right-5  rotate-[55deg]'></div>
                              </div>
                              <div className='flex items-center justify-start  w-full'>
                                <h3 className='font-semibold text-gray-800 text-xl mt-2 capitalize text-wrap onstage-committee-name'>Subeena</h3>
                              </div>
                            </div>
                            </motion.div>
                            </div>
                            </div>

                            {/* team 2 */}
                            <div className="flex flex-col ">
                                <h1 className="font-bold flex justify-center align-center text-xl mb-4 text-[#88011A]">BLUE</h1>
                            <div className="flex gap-4 w-full mx-auto">

                          <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          whileInView={{ opacity: 1, scale: 1, transition: { duration: 1, delay: 0.2 } }}
                          viewport={{ once: true }}
                        >
                            <div className='flex flex-col items-center justify-center '>
                              <div className='relative onstage-committee overflow-hidden'>
                                <img src={Arathi} alt='main1' className='w-full h-full object-cover' />
                                <div className='absolute h-20 w-8 -top-8 -left-5 rotate-[55deg]  background-custom-color'></div>
                                <div className='absolute background-custom-color h-[70px] w-10 -bottom-8 -right-5  rotate-[55deg]'></div>
                              </div>
                              <div className='flex items-center justify-start  w-full'>
                                <h3 className='font-semibold text-gray-800 text-xl mt-2 capitalize text-wrap onstage-committee-name'>Arathi K</h3>
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
                                <img src={Misha_Manoj} alt='main1' className='w-full h-full object-cover' />
                                <div className='absolute h-20 w-8 -top-8 -left-5 rotate-[55deg] background-custom-color'></div>
                                <div className='absolute background-custom-color h-[70px] w-10 -bottom-8 -right-5  rotate-[55deg]'></div>
                              </div>
                              <div className='flex items-center justify-start  w-full'>
                                <h3 className='font-semibold text-gray-800 text-xl mt-2 capitalize text-wrap onstage-committee-name'>Misha Manoj</h3>
                              </div>
                            </div>
                            </motion.div>
                            </div>
                            </div>
                            </div>
                            <div>


                            {/* team 3 */}

                            <div className="flex flex-col mb-6">
                                <h1 className="font-bold text-[#88011A] flex justify-center align-center text-xl mb-4">GREEN</h1>
                            <div className="flex gap-4 w-full mx-auto">

                          <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          whileInView={{ opacity: 1, scale: 1, transition: { duration: 1, delay: 0.2 } }}
                          viewport={{ once: true }}
                        >
                            <div className='flex flex-col items-center justify-center '>
                              <div className='relative onstage-committee overflow-hidden'>
                                <img src={Jabeera_Sherin} alt='main1' className='w-full h-full object-cover' />
                                <div className='absolute h-20 w-8 -top-8 -left-5 rotate-[55deg]  background-custom-color'></div>
                                <div className='absolute background-custom-color h-[70px] w-10 -bottom-8 -right-5  rotate-[55deg]'></div>
                              </div>
                              <div className='flex items-center justify-start  w-full'>
                                <h3 className='font-semibold text-gray-800 text-xl mt-2 capitalize text-wrap onstage-committee-name'>Jabeera Sherin. P</h3>
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
                                <img src={Shahira} alt='main1' className='w-full h-full object-cover' />
                                <div className='absolute h-20 w-8 -top-8 -left-5 rotate-[55deg] background-custom-color'></div>
                                <div className='absolute background-custom-color h-[70px] w-10 -bottom-8 -right-5  rotate-[55deg]'></div>
                              </div>
                              <div className='flex items-center justify-start  w-full'>
                                <h3 className='font-semibold text-gray-800 text-xl mt-2 capitalize text-wrap onstage-committee-name'>Shahira A                                </h3>
                              </div>
                            </div>
                            </motion.div>
                            </div>
                            </div>

                            {/* team 4  */}

                            <div className="flex flex-col">
                                <h1 className="font-bold text-[#88011A] flex justify-center align-center text-xl mb-4">YELLOW</h1>
                            <div className="flex gap-4 w-full mx-auto">

                          <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          whileInView={{ opacity: 1, scale: 1, transition: { duration: 1, delay: 0.2 } }}
                          viewport={{ once: true }}
                        >
                            <div className='flex flex-col items-center justify-center '>
                              <div className='relative onstage-committee overflow-hidden'>
                                <img src={Muhammed_Fahad} alt='main1' className='w-full h-full object-cover' />
                                <div className='absolute h-20 w-8 -top-8 -left-5 rotate-[55deg]  background-custom-color'></div>
                                <div className='absolute background-custom-color h-[70px] w-10 -bottom-8 -right-5  rotate-[55deg]'></div>
                              </div>
                              <div className='flex items-center justify-start  w-full'>
                                <h3 className='font-semibold text-gray-800 text-xl mt-2 capitalize text-wrap onstage-committee-name'>Muhammed Fahad</h3>
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
                                <img src={Fathima_Rabeeha} alt='main1' className='w-full h-full object-cover' />
                                <div className='absolute h-20 w-8 -top-8 -left-5 rotate-[55deg] background-custom-color'></div>
                                <div className='absolute background-custom-color h-[70px] w-10 -bottom-8 -right-5  rotate-[55deg]'></div>
                              </div>
                              <div className='flex items-center justify-start  w-full'>
                                <h3 className='font-semibold text-gray-800 text-xl mt-2 capitalize text-wrap onstage-committee-name'>Fathima Rabeeha</h3>
                              </div>
                            </div>
                            </motion.div>
                            </div>
                            </div>
                            </div>
                            </div>
                      </section>

                       <section className='flex flex-col gap-2 items-center '>
                      
                                <div className='text-center flex items-center gap-6  relative  mb-3 overflow-hidden w-full'>
                                  <span className='h-0 w-0 border-b-[15px] border-t-[15px] border-l-[30px] border-l-[#73052F] border-transparent absolute -left-4'></span>
                                  <hr className='border-[2px] border-[#73052F] w-1/2 mx-auto' />
                                  <span className='text-3xl font-bold  uppercase text-[#73052F] text-nowrap onstage-committee-heading'>TECHNICAL TEAM</span>
                                  <hr className='border-[2px] border-[#73052F] w-1/2 mx-auto' />
                                  <span className='h-0 w-0 border-b-[15px] border-t-[15px] border-r-[30px] border-r-[#73052F] border-transparent absolute -right-4'></span>
                                </div>
                              
                                  {/* Technical Commiite */}
                      
                                  <div className='flex gap-4 w-full mx-auto onstage-committee-parent'>
                                 
                                    <motion.div
                                  initial={{ opacity: 0, scale: 0.5 }}
                                  whileInView={{ opacity: 1, scale: 1, transition: { duration: 1, delay: 0.4 } }}
                                  viewport={{ once: true }}
                                >
                                    <div className='flex flex-col items-center justify-center'>
                                      <div className='relative onstage-committee overflow-hidden'>
                                        <img src={Saleel} alt='main1' className='w-full h-full object-cover' />
                                        <div className='absolute h-20 w-8 -top-8 -left-5 rotate-[55deg] background-custom-color'></div>
                                        <div className='absolute background-custom-color h-[70px] w-10 -bottom-8 -right-5  rotate-[55deg]'></div>
                                      </div>
                                      <div className='flex items-center justify-start  w-full'>
                                        <h3 className='font-semibold text-gray-800 text-xl mt-2 capitalize text-wrap onstage-committee-name'>Saleel</h3>
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
                                        <img src={Shamil} alt='main1' className='w-full h-full object-cover' />
                                        <div className='absolute h-20 w-8 -top-8 -left-5 rotate-[55deg]  background-custom-color'></div>
                                        <div className='absolute background-custom-color h-[70px] w-10 -bottom-8 -right-5  rotate-[55deg]'></div>
                                      </div>
                                      <div className='flex items-center justify-start  w-full'>
                                        <h3 className='font-semibold text-gray-800 text-xl mt-2 capitalize text-wrap onstage-committee-name'>Shamil KP</h3>
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
                                        <img src={Munavvar} alt='main1' className='w-full h-full object-cover ' />
                                        <div className='absolute h-full w-2 top-0 bottom-0 left-0  background-custom-color '></div>
                                        <div className='absolute h-20 w-8 -top-8 -left-5 rotate-[55deg] background-custom-color'></div>
                                        <div className='absolute background-custom-color h-[70px] w-10 -bottom-8 -right-5  rotate-[55deg]'></div>
                                      </div>
                                      <div className='flex items-center justify-start  w-full'>
                                        <h3 className='font-semibold text-gray-800 text-xl mt-2 capitalize text-wrap onstage-committee-name'>Munavvar</h3>
                                      </div>
                                    </div>
                                    </motion.div>
                                  </div>
                              </section>
            </div>

            

        </div>
    )
}
export default Captains