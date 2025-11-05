import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import LogoClg from '../../assets/arts/logoClg.png';
import Union40 from '../../assets/unionlogo.png';
import LogoF from '../../assets/arts/logoF.png';
import { NavLink  } from 'react-router-dom';

function Footer() {
  const navigate = (url) => () => {
    window.open(url, '_blank');
  };
    return (
    <div >
      <footer className='h-fit w-full  text-2xl text-center bg-[#06094C] text-white p-8 rounded-t-2xl flex flex-col justify-between pb-3 ' >
        <div className='flex justify-between flex-1 flex-row  gap-10 items-center responsive-footer'>

          {/* left section */}
          <div className=' flex flex-col justify-start gap-4 responsive-footer-child-1'>
            <div>
              <img src={LogoF} alt='Union40 Logo' />
            </div>
           
          </div>
          {/* right section */}
          <div className=' flex flex-col justify-end gap-2 responsive-footer-child-2'>
            <div className='flex gap-4 justify-end'>
              <img src={LogoClg} alt='EMEA Logo' className='h-20' />

            </div>
            <div className='flex flex-col text-right items-end text-[18px]  responsive-footer-child '>
              <p className='font-bold'>HIO ITE OLAVATTUR</p>
              <p>
              Olavattur PO, Kondotty Via,<br/> Malappuram, 673635
              </p>
              <p>
              8281285824 
              </p>
              <p>
              lioti2010@gmail.com
              </p>
              {/* <p>Re-accredited with’A’ Grade by NAAC</p> */}
            </div>
        

          </div>
        </div>

        <div className='text-stone-400 text-[16px] mt-4 pt-2 border-t border-t-stone-500 flex items-center justify-center gap-1'>
          Designed by
          <NavLink to='https://www.linkedin.com/in/muhammed-saleel-cp-84064524b/' target="_blank" className='navlink-designer'>
            <p className='designer-1 text-stone-400'>
              Saleel,

            </p>
          </NavLink>
          <NavLink to='https://zamil.vercel.app/' target="_blank" className='navlink-designer'>
            <p className="designer-2 text-stone-400">
           Shamil,
            </p>
          </NavLink>
         
          <NavLink to='https://www.instagram.com/munavvar_manu_?igsh=MXZhbGcxcGhpMmdlMA==' target="_blank" className='navlink-designer'>
            <p className="designer-3 text-stone-400">
              Munavvar
            </p>
          </NavLink>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
