import React from 'react';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import {ImLocation, ImOpt} from 'react-icons/im';
import { FaTrash } from 'react-icons/fa';
import { RiEdit2Fill } from 'react-icons/ri'


export const ListingItem = ({listing, id, onEdit, onDelete}) => {
  return (
     <li className='relative bg-white flex flex-col justify-between items-center shadow-md hover:shadow-lg rounded-md overflow-hidden transition-shadow duration-150 m-[10px]'>
          <Link to={`/category${listing.type}/${id}`}>
               <img src={listing.imgUrls[0]} className='w-full object-cover hover:scale-110 transition-scale duration-200 ease-in' loading='lazy'/>
               <Moment fromNow className='absolute top-2 left-2 bg-[#3377cc] text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg'>{listing.timestamp?.toDate()}</Moment>
               <div className='w-full p-[10px]'>
                    <div className='flex items-center space-x-1 '>
                         <ImLocation className='h-4 w-4 text-green-600'/>
                         <p className='font-semibold text-sm md-[2px] text-gray-600 truncate'>{listing.address}</p>
                    </div>
                    <p className='font-semibold mt-6 text-xl m-0 truncate'>{listing.name}</p>
                    <p className='text-[#457b9d] mt-2 font-semibold'>${listing.offer ? listing.discountedPrice
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",") :
                         listing.regularPrice
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                         {listing.type === "rent" && " / 月 "}
                    </p>
                    <div className='flex items-center mt-[10px] space-x-3'>
                         <div className='flex items-center space-x-1'>
                              <p className='font-bold text-xs'>{listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}</p>
                         </div>
                         <div className='flex items-center space-x-3'>
                              <p className='font-bold text-xs'>{listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}</p>
                         </div>
                    </div>
               </div>
          </Link>
          {onDelete && (
               <FaTrash className='absolute bottom-2 right-2 h-[14px] cursor-pointer text-red-500'
                        onClick={() => onDelete(listing.id)}
               />
          )}
          {onEdit && (
               <RiEdit2Fill className='absolute bottom-2 right-9 h-4 cursor-pointer text-blue-500'
                        onClick={() => onEdit(listing.id)}
               />
          )}
     </li>
  )
}

// export default ListingItem