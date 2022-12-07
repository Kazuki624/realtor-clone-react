import React from 'react' ;
import { useState } from 'react' ;
import { toast } from 'react-toastify' ;
import { Spinner } from '../components/Spinner' ;
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getAuth } from 'firebase/auth';
import { v4 as uuidv4 } from "uuid" ;
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';


export const CreateListing = () => {
     const navigate = useNavigate();
     const auth = getAuth();
     const [geolocationEnabled, setGeoLocationEnabled] = useState(true);   //inputのaddressにAPiによる入力簡素化をする
     const [loading, setLoading] = useState(false);
     const [formData, setFormData] = useState({
          type : "rent",
          name : "",
          bedrooms : 1,
          bathrooms : 1,
          parking : false,
          furnished : false,
          address : "",
          description : "",
          offer : false,
          regularPrice : 0,
          discountedPrice : 0,
          latitude : 0,
          longitude : 0,
          images : {}
     })
     const {type, name, bedrooms, bathrooms, parking, furnished, address, description, offer, regularPrice, discountedPrice, latitude, longitude, images} = formData
     const onChange = (e) => {
          let boolean = null   //input情報に基づき、「true」か「false」を出す
          if(e.target.value === 'true'){    //input情報のvalue値が「true」の時に、valueが文字列のため、booleanで「true」にする
               boolean = true
          }
          if(e.target.value === 'false'){    //input情報のvalue値が「false」の時に、valueが文字列のため、booleanで「true」にする
               boolean = false
          }
          // files
          if(e.target.files){  //inputのfileタイプ
               setFormData((prevState) => ({    //初期情報を取得する
                    ...prevState,               //初期情報をそのまま保持する
                    images : e.target.files    //オブジェクトのimagesに画像がある場合に追加する
               }))   
          }
          // text/boolean/number
          if(!e.target.files){                //画像アップロードがない場合
               setFormData((prevState) => ({
                    ...prevState,
                    [e.target.id] : boolean ?? e.target.value,   //booleanでtrueかfalseを返す、テキスト or 番号で返す
               }))
          }
     }
     const onSubmit =  async(e) => {
          e.preventDefault();
          setLoading(true);  //スピナー
          if(+discountedPrice >= +regularPrice){      //価格の値段によるエラー表示
               setLoading(false);
               toast.error("Discounted Price needs to be less than regular Price") ;
               return ;
          }
          if(images.length > 6){
               setLoading(false);
               toast.error("Maximum 6 images are allowed");
               return ;
          }
          let geolocation = {};
          let location;
          if (geolocationEnabled) {
               const response = await fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
                    ); //「.env.local」ファイルから変数代入したAPIコードを非同期処理で格納
               const data = await response.json();
               geolocation.latitude = data.results[0]?.geometry.location.lat ?? 0;   //入力されたaddress情報からAPI結果の情報をオブジェクトで取得
               geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;
               location = data.status === "ZERO_RESULTS" && undefined;     //取得したオブジェクトの変数結果に基づいた情報を確認
               // if(location === undefined || location.includes("undefined")){
               if (location === undefined) {
                    setLoading(false);
                    toast.error("Please enter correct address");
               }
          }else{    //正しい情報の場合は、データとして変数に格納する
               geolocation.lat = latitude ;    
               geolocation.lng = longitude ;
          }
          const storeImage = async(image) => {
               return new Promise((resolve, reject) => {
                 const storage = getStorage();
                 const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
                 const storageRef = ref(storage, filename);
                 const uploadTask = uploadBytesResumable(storageRef, image);
                 uploadTask.on(
                   "state_changed",
                   (snapshot) => {
                     const progress =
                       (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                     console.log("Upload is " + progress + "% done");
                     switch (snapshot.state) {
                       case "paused":
                         console.log("Upload is paused");
                         break;
                       case "running":
                         console.log("Upload is running");
                         break;
                     }
                   },
                   (error) => {
                     reject(error);
                   },
                   () => {
                     // Handle successful uploads on complete
                     // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                       resolve(downloadURL);
                     });
                   }
                 );
               });
          }
          const imgUrls = await Promise.all(   //アップロードする画像をループで回し、storeImageに格納する
               [...images].map((image) => storeImage(image)) 
          ).catch((error) => {
               setLoading(false);
               toast.error("Images not Uploaded");
               return;
          });
          // フォームデータのコピーを取る
          const formDateCopy = {
               ...formData,
               imgUrls,
               geolocation,
               timestamp : serverTimestamp(), //制作日を明記する
               userRef : auth.currentUser.uid,  //制作者情報を明記する
          };
          // firebaseのfirestoreDBのコレクションに投稿内容を入れる
          delete formDateCopy.images;
          !formDateCopy.offer && delete formDateCopy.discountedPrice;
          delete formDateCopy.latitude;
          delete formDateCopy.longitude;
          const docRef = await addDoc(collection(db, "listings"), formDateCopy);
          setLoading(false)
          toast.success("Listing Created");
          navigate(`/category/${formDateCopy.type}/${docRef.id}`);
     }

     if(loading){
          return <Spinner />
     }
  return (
    <main className='max-w-md px-2 mx-auto'>
          <h1 className='text-3xl text-center mt-6 font-bold'>Create a Listing</h1>
          <form onSubmit={onSubmit}>
               <p className="text-lg mt-6 font-semibold">Sell / Rent</p>
               <div className='flex'>
                    <button type='button' id='type' value="sale" onClick={onChange}
                            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full 
                                      ${ type === "rent" ? "bg-white text-black" : "bg-slate-600 text-white" }`}>
                         sell
                    </button>
                    <button type='button' id='type' value="rent" onClick={onChange}
                            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full 
                                      ${ type === "sale" ? "bg-white text-black" : "bg-slate-600 text-white" }`}>
                         rent
                    </button>
               </div>
               <p className="text-lg mt-6 font-semibold">Name</p>
               <input type="text" id='name' value={name} onChange={onChange} placeholder='Name' maxLength='32' minLength='10' required
                      className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6" />
               <div className='flex space-x-6 justify-start mb-6'>
                    <div>
                         <p className='text-lg font-semibold'>Beds</p>
                         <input type="number" id='bedrooms' value={bedrooms} onChange={onChange} min='1' max='50' required 
                                 className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-l-slate-600 text-center'/>
                    </div>
                    <div>
                         <p className='text-lg font-semibold'>Bath</p>
                         <input type="number" id='bathrooms' value={bathrooms} onChange={onChange} min='1' max='50' required 
                                 className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-l-slate-600 text-center'/>
                    </div>
               </div>
               <p className="text-lg mt-6 font-semibold">Parking spot</p>
               <div className='flex'>
                    <button type='button' id='parking' value={true} onClick={onChange}
                            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full 
                                      ${ !parking ? "bg-white text-black" : "bg-slate-600 text-white" }`}>
                         Yes
                    </button>
                    <button type='button' id='parking' value={false} onClick={onChange}
                            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full 
                                      ${ parking ? "bg-white text-black" : "bg-slate-600 text-white" }`}>
                         No
                    </button>
               </div>
               <p className="text-lg mt-6 font-semibold">Furnished</p>
               <div className='flex'>
                    <button type='button' id='furnished' value={true} onClick={onChange}
                            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full 
                                      ${ !furnished ? "bg-white text-black" : "bg-slate-600 text-white" }`}>
                         Yes
                    </button>
                    <button type='button' id='furnished' value={false} onClick={onChange}
                            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full 
                                      ${ furnished ? "bg-white text-black" : "bg-slate-600 text-white" }`}>
                         No
                    </button>
               </div>
               <p className="text-lg mt-6 font-semibold">Address</p>
               <textarea type="text" id='address' value={address} onChange={onChange} placeholder='Address' required
                      className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6" />
               {!geolocationEnabled && (
                    <div className='flex space-x-6 justify-start mb-6'>
                         <div>
                              <p className='text-le font-semibold'>Latitude</p>
                              <input type="number" id='latitude' value={latitude} onChange={onChange} required min="-90" max="90"
                                     className='w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center'/>
                         </div>
                         <div>
                              <p className='text-le font-semibold'>Longitude</p>
                              <input type="number" id='longitude' value={longitude} onChange={onChange} required min="-180" max="180"
                                     className='w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center'/>
                         </div>
                    </div>
               )}
               <p className="text-lg font-semibold">Description</p>
               <textarea type="text" id='description' value={description} onChange={onChange} placeholder='Description' required
                      className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6" />
               <p className="text-lg font-semibold">Offer</p>
               <div className='flex mb-6'>
                    <button type='button' id='offer' value={true} onClick={onChange}
                            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full 
                                      ${ !offer ? "bg-white text-black" : "bg-slate-600 text-white" }`}>
                         Yes
                    </button>
                    <button type='button' id='offer' value={false} onClick={onChange}
                            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full 
                                      ${ offer ? "bg-white text-black" : "bg-slate-600 text-white" }`}>
                         No
                    </button>
               </div>
               <div className='flex items-center mb-6'>
                    <div>
                         <p className='text-lg font-semibold'>Regular price</p>
                         <div className='flex w-full justify-center items-center space-x-6'>
                              <input type="number" id="regularPrice" value={regularPrice} onChange={onChange} min="50" max="400000000" required 
                                     className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-l-slate-600 text-center' />
                              {type === "rent" && (
                                   <div className=''>
                                        <p className='text-md w-full whitespace-nowrap'>$ / Month</p>
                                   </div>
                              )}
                         </div>
                    </div>
               </div>
               {offer === true && (
                    <div className='flex items-center mb-6'>
                         <div>
                              <p className='text-lg font-semibold'>Discount price</p>
                              <div className='flex w-full justify-center items-center space-x-6'>
                                   <input type="number" id="discountedPrice" value={discountedPrice} onChange={onChange} min='50' max='999999999' required={offer}
                                        className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-l-slate-600 text-center' />
                                   {type === "rent" && (
                                        <div className=''>
                                             <p className='text-md w-full whitespace-nowrap'>$ / Month</p>
                                        </div>
                                   )}
                              </div>
                         </div>
                    </div>
               )}
               <div className='mb-6'>
                    <p className='text-lg font-semibold'>Images</p>
                    <p className='text-gray-600'>The first image will be cover (max 6)</p>
                    <input type="file" id='images' onChange={onChange} accept='.jpg, .png, .jpeg' multiple required 
                           className='w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600'/>
               </div>
               <button type="submit"
                       className='w-full mb-6 px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'>
                         Create Listing
               </button>
          </form>
    </main>
  )
}

// export default CreateListing