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
import { IoCopySharp } from 'react-icons/io5'

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
          <p className='fixed top-[23%] right-[5%] font-semibold border-2 border-gray-400 rounded-md bg-white z-10 p-2'>リンクをコピーしました</p>
     )}
    </main>
  )
}

// export default Listing