import React from 'react';
import Container from '@/components/Container';
import Link from 'next/link';
import { FaCarAlt, FaSignInAlt } from 'react-icons/fa';
import NavbarSigninButton from './NavbarSigninButton';
import { CgProfile } from "react-icons/cg";
import { BiSolidMessageRoundedAdd } from "react-icons/bi";

const Navbar = () => {
  return (
    <nav className='flex navbar w-[100vw] h-[50px] items-center absolute top-0 left-0 bg-white' style={{zIndex: 3}}>
      <Container className='flex justify-between items-center px-5'>
        <div className="left">
          <Link href="/"><p>tripia</p></Link>
        </div>

        <ul className="right flex gap-5">
          <Link href="/trips">
            <li className="flex items-center">
              <FaCarAlt className="block xs:hidden" />  {/* Icon visible on xs */}
              <span className="hidden xs:block">Trips</span>  {/* Text visible on larger screens */}
            </li>
          </Link>
          <Link href="/trips/post">
            <li className="flex items-center">
              <BiSolidMessageRoundedAdd className="block xs:hidden" />  {/* Icon visible on xs */}
              <span className="hidden xs:block">Post Trip</span>  {/* Text visible on larger screens */}
            </li>
          </Link>
          <Link href="/myprofile">
            <li className="flex items-center">
              <CgProfile className="block xs:hidden" />  {/* Icon visible on xs */}
              <span className="hidden xs:block">My Profile</span>  {/* Text visible on larger screens */}
            </li>
          </Link>
          <NavbarSigninButton />
        </ul>
      </Container>
    </nav>
  )
}

export default Navbar;
