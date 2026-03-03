"use client";
import Image from 'next/image';
import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import React, {useEffect} from 'react';
 function Header(){
        const path=usePathname();
        useEffect(()=>{
            console.log(path)
        },[])

  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-sm'>
        <Image src={'/logo.svg'} height={100} width={160} alt='logo'/>
        <ul className='hidden md:flex gap-6'>
            <li className={`hover:text-blue-500 hover:font-bold transition-all cursor-pointer
                ${path=='/dashboard'&&'text-blue-500 font-bold'}`}>Dashboard</li>
            <li className={`hover:text-blue-500 hover:font-bold transition-all cursor-pointer
                ${path=='/dashboard/Questions'&&'text-blue-500 font-bold'}`}>Question</li>
            <li className={`hover:text-blue-500 hover:font-bold transition-all cursor-pointer
                ${path=='/dashboard/upgrade'&&'text-blue-500 font-bold'}`}>upgrade</li>
            <li className={`hover:text-blue-500 hover:font-bold transition-all cursor-pointer
                ${path=='/dashboard/how'&&'text-blue-500 font-bold'}`}>how it works?</li>
        </ul>
        <UserButton/>
    </div>
  )
}

export default Header