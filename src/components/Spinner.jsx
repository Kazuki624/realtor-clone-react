import React from 'react'
import spinner from "../assets/svg/spinner.svg"

export const Spinner = () => {
  return (
    <div className='bg-white bg-opacity-100 flex items-center justify-center fixed left-0 right-0 bottom-0 top-0'>
          <div>
               <img src={spinner} alt="Loading" className='h-28'/>
          </div>
    </div>
  )
}
