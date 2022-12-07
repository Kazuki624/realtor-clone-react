import { getAuth, updateProfile } from "firebase/auth";
import { collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import { useState } from "react"
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { db } from "../firebase";
import {FcHome} from "react-icons/fc"
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { ListingItem } from "../components/ListingItem";

export const Profile = () => {
    // inputに出力されるデータをAuthから取得し、変更するとsetFromDateに格納される
    const auth = getAuth()
    const navigate = useNavigate()
    const [changeDetail, setChangeDetail] = useState(false)
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        name : auth.currentUser.displayName,
        email : auth.currentUser.email,
    });
    const {name, email} = formData;
    const onLogout = () => {
        auth.signOut()
        navigate("/")
    }
    // onChangeイベント。useStateで登録されたユーザネームを持ってきて、onChangeイベントでセットされた新たなユーザ名を表示
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id] : e.target.value,
        }))
    }
    // 非同期処理で、新たにセットされたユーザ名が元のユーザ名と違う場合に、firebaseのユーザ名(元のユーザ名)をアップデートし、新たなユーザ名に変更する
    const onSubmit = async () => {
          try {
               if(auth.currentUser.displayName !== name) {
                    await updateProfile(auth.currentUser, {
                         displayName : name
                    })
                    const docRef = doc(db, "users", auth.currentUser.uid);
                    await updateDoc(docRef, {
                         name : name
                    })
               }
               toast.success("Profile details updated")
          }catch(error){
               toast.error("Could not update the profile details")
          }
     }
     useEffect(() => {   //useEffectで一度だけ情報を呼び出す。呼び出す情報は自分でDBに登録したデータ情報
          const fetchUserListings = async() => {
               const listingRef = collection(db, "listings");
               const q = query(
                    listingRef, 
                    where("userRef", "==", auth.currentUser.uid), 
                    orderBy("timestamp", "desc")
               );
               const querySnap = await getDocs(q);  //ユーザ情報をもとに取得したすべてのデータを含む
               let listings = [];
               querySnap.forEach((doc) => {
                    return listings.push({
                         id : doc.id,
                         data : doc.data(),
                    });
               });
               setListings(listings);
               setLoading(false);
          }
          fetchUserListings();
     }, [auth.currentUser.uid]);
     const onDelete = async (listingID) => {    //propsで該当の情報を受け取る
          if(window.confirm("本当に削除しますか？")){
               await deleteDoc(doc(db, "listings", listingID));   //非同期処理で該当のデータベースを指定する
               const updatedListings = listings.filter(        //自分の投稿が格納してある変数「listing」をアップデートする。
                    (listing) => listing.id !== listingID
               );
               setListings(updatedListings);
               toast.success("該当の物件を削除しました");
          }
     }
     const onEdit = (listingID) => {
          // propsで受け取ったデータIDをもとに編集ページに飛ばす
          navigate(`/edit-listing/${listingID}`)
     }
    return(
        <>
        <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
            <h1 className="text-3xl text-center mt-6 font-bold">プロフィール</h1>
            <div className="w-full md:w-[50%] mt-6 px-3">
                <form>
                    {/* name input */}
                    <input type="text" id="name" value={name} disabled={!changeDetail} onChange={onChange} className={`w-full px-4 py-2 mb-6 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${changeDetail && "bg-red-200 focus:bg-red-200"}`}/>
                    {/* email input */}
                    <input type="text" id="email" value={email} disabled className="w-full px-4 py-2 mb-6 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out"/>

                    <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6">
                        <p className="flex items-center">
                            ユーザ名の変更はこちらから
                            <span 
                                onClick={() => {
                                  changeDetail && onSubmit()
                                  setChangeDetail((prevState) => !prevState)
                                }} 
                                className="text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer">
                                {changeDetail ? "変更を適用する" : "編集する"}</span>
                        </p>
                        <p onClick={onLogout} className="text-blue-600 hover:text-blue-800 transition ease-in-out duration-200 cursor-pointer">
                            サインアウト
                        </p>
                    </div>
                </form>
                <button type="submit" 
                        className="w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800">
                    <Link to="/create-listing" 
                          className="flex justify-center items-center ">
                         <FcHome className="mr-2 text-3xl bg-red-200 rounded-full p-1 border-2 "/>
                         物件を提供する
                    </Link>
                </button>
            </div>
        </section>
        <div className="max-w-6xl px-3 mt-6 mx-auto">
          {!loading && listings.length > 0 && (
               <>
                    <h2 className="text-2xl text-center font-semibold mb-6 mt-6">自分の提供している物件</h2>
                    <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-6"> 
                         {listings.map((listing) => (
                              <ListingItem 
                                   key={listing.id} 
                                   id={listing.id} 
                                   listing={listing.data}
                                   onDelete={() => onDelete(listing.id)} 
                                   onEdit={() => onEdit(listing.id)} 
                              />
                         ))}
                    </ul>
               </>
          )}
        </div>
        </>
    )
}