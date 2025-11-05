import React from 'react'
import Lauch from '../assets/Poster/launch.jpg'
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import { useNavigate } from 'react-router-dom'
function Launch() {
  const navigate = useNavigate()

  const Launch = () => {
    navigate('/')
  }
  return (
    <div>
      <div className='overflow-hidden relative flex items-center justify-center h-screen bg-gray-800'>
        <img src={Lauch} alt='logo' className='object-cover w-full h-full overflow-hidden absolute top-0 bottom-0 left-0 right-0 z-20' />
        <button className='z-40 bg-white/80 py-2 px-8 rounded-lg font-bold text-xl cursor-pointer' onClick={Launch}>
        <Fireworks autorun={{ speed: 3 }} />
          Launch 
        </button>
      </div>
    </div>
  )
}

export default Launch