import React from 'react';
import Container from '@/components/Container';
import Link from 'next/link';



const Navbar = () => {
  return (
    <div className='flex navbar w-100 h-[50px] items-center'>
      <Container className='flex justify-between items-center'>
        <div className="left">
          <Link href="/"><p>tripia</p></Link>
        </div>

        <div className="right flex gap-5">
          <Link href="/mytrips"><p>My Trips</p></Link>
          <Link href="/mygroups"><p>My Groups</p></Link>
          <Link href="/myprofile"><p>My Profile</p></Link>
          <Link href="/login"><p>Log in</p></Link>
        </div>
      </Container>
    </div>
  )
}

export default Navbar