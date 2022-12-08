import { doc, getDoc } from 'firebase/firestore';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner } from '../components/Spinner';
import { db } from '../firebase';
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { EffectFade, Autoplay, Navigation, Pagination} from "swiper";
import "swiper/css/bundle";
import { IoCopySharp,IoBed } from 'react-icons/io5';
import { ImLocation } from 'react-icons/im';
import { FaBath, FaParking } from 'react-icons/fa' ;
import { GiSofa } from 'react-icons/gi';
 
export const Listing = () => {
     const params = useParams(); //パラメータ取得
     const [listing, setListing] = useState(null);
     const [loading, setLoading] = useState(true);
     const [shareLinkCopy, setShareLinkCopy] = useState(false);
     SwiperCore.use([Autoplay, Navigation, Pagination]);
     useEffect(() => {
          const fetchListing = async()=> {
            const docRef = doc(db, "listings", params.listingId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setListing(docSnap.data());
              setLoading(false);
            }
          }
          fetchListing();
        }, [params.listingId]);
        if(loading){
          return <Spinner />
     }
  return (
    <main>
     <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        modules={[EffectFade]}
        autoplay={{ delay: 3000 }}>
          {listing.imgUrls.map((url, index) => (
                <SwiperSlide key={index}>
                    <div
                         className="relative w-full overflow-hidden h-[500px]"
                         style={{ background: `url(${listing.imgUrls[index]}) center no-repeat`, backgroundSize: "cover"}}>
                    </div>
               </SwiperSlide>
          ))}
     </Swiper>
     <div className='fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center'
          onClick={() => {
               navigator.clipboard.writeText(window.location.href);  //ドメインをコピーする
               setShareLinkCopy(true);
               setTimeout(() => {
                    setShareLinkCopy(false)
               },2000)
          }}>
          <IoCopySharp className='text-lg text-slate-500' />
     </div>
     {shareLinkCopy && (
          <p className='fixed top-[23%] right-[5%] font-semibold border-2 border-gray-400 rounded-md bg-white z-10 p-2'>
               リンクをコピーしました
          </p>
     )}
     <div className=' m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg shadow-lg bg-white lg:space-x-5'>
          <div className='w-full h-[250px] lg-[400px]'>
               <p className='text-2xl font-bold mb-3 text-blue-900 '>
                    {listing.name} - {listing.offer ? 
                         listing.discountedPrice
                         .toString()
                         .replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 
                         listing.regularPrice
                         .toString()
                         .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    {listing.type === "rent" && " / 月 "}
               </p>
               <p className='flex items-center mt-6 mb-3 font-bold'>
                    <ImLocation className='h-4 w-4 text-green-600 mr-1'/>
                    {listing.address}
               </p>
               <div className='flex justify-start items-center space-x-4 w-[75%]'>
                    <p className='bg-red-800 w-full max-w-[150px] rounded-md p-2 text-white text-center font-semibold shadow-md'>
                         {listing.type === "rent" ? "Rent" : "Sale" }
                    </p>
                    {listing.offer && (
                         <p className='w-full max-w-[300px] bg-green-800 rounded-md p-2 text-white text-center font-semibold shadow-md'>
                              今なら
                              {+listing.regularPrice - +listing.discountedPrice}
                              万円で提供中！
                         </p>
                    )}
               </div>
               <p className='mt-3 mb-3'>
                    <p className='font-semibold'>物件概要 - </p>
                    {listing.description}
               </p>
               <ul className='flex items-center space-x-2 lg:space-x-10 text-sm font-semibold'>
                    <li className=' flex items-center whitespace-nowrap'>
                         <IoBed className='text-lg mr-1' />
                         {+listing.bedrooms > 1 ? 
                              `${listing.bedrooms} beds` : "1 bed"
                         }
                    </li>
                    <li className=' flex items-center whitespace-nowrap'>
                         <FaBath className='text-lg mr-1' />
                         {+listing.bathrooms > 1 ? 
                              `${listing.bathrooms} baths` : "1 bath"
                         }
                    </li>
                    <li className=' flex items-center whitespace-nowrap'>
                         <FaParking className='text-lg mr-1' />
                         {+listing.parking  ? `Parking Spot` : "No Parking" }
                    </li>
                    <li className=' flex items-center whitespace-nowrap'>
                         <GiSofa className='text-lg mr-1' />
                         {+listing.furnished  ? `Furnished` : "Not Furnished" }
                    </li>
               </ul>
          </div>
          <div className='bg-blue-300 w-full h-[250px] lg-[400px] z-10 overflow-x-hidden'>

          </div>
     </div>
    </main>
  )
}

// export default Listing