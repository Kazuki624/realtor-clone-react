import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';

export const Contact = ({userRef, listing}) => {
     const [landLoad, setLandLoad] = useState(null)
     const [message, setMessage] = useState("")
     useEffect(() => {
          const getLandLoad = async() => {
               const docRef = doc(db, "users", userRef)   //propsでuserRefを受け取る
               const docSnap = await getDoc(docRef);
               if(docSnap.exists()){
                    setLandLoad(docSnap.data())
               }else{
                    toast.error("提供者情報を取得できませんでした")
               }
          }
          getLandLoad();
     },[userRef])
     const onChange = (e) => {
          setMessage(e.target.value)
     }
  return (
    <>
          {landLoad !== null && (
               <div className='flex flex-col w-full'>
                    <p>
                         提供者に{listing.name.toLowerCase()}について連絡する
                    </p>
                    <div className='mt-3 mb-6'>
                         <textarea name="message" id="message" rows="2" value={message}
                                   className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600'
                                   onChange={onChange}></textarea>
                    </div>
                    <a href={`mailto:${landLoad.email}?Subject=${listing.name}&body=${message}`}>
                         <button type='button' className='px-7 py-3 bg-blue-600 text-white text-center rounded text-sm uppercase shadow-md hover:shadow-lg hover:bg-blue-700 active:shadow-lg active:bg-blue-800 transition duration-150 ease-in-out w-full mb-6'>連絡する</button>
                    </a>
               </div>
          )}
    </>
  )
}

// export default Contact