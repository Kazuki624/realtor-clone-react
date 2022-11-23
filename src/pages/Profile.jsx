import { async } from "@firebase/util";
import { getAuth, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react"
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { db } from "../firebase";

export const Profile = () => {
    // inputに出力されるデータをAuthから取得し、変更するとsetFromDateに格納される
    const auth = getAuth()
    const navigate = useNavigate()
    const [changeDetail, setChangeDetail] = useState(false)
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
    const  onSubmit = async() => {
     try{
      if(auth.currentUser.displayName !== name){
       // update display name in firebase auth
       await updateProfile(auth.currentUser, {
        displayName : name
       })
       // update name in the firestore
       const docRef = doc(db, "users", auth.currentUser.uid)
       await updateDoc(docRef, {
        name : name
       })
      }
      toast.success("Profile details updated")
     }catch(error){
      toast.error("Could not update the profile details")
     }
    }
    return(
        <>
        <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
            <h1 className="text-3xl text-center mt-6 font-bold">MY Profile</h1>
            <div className="w-full md:w-[50%] mt-6 px-3">
                <form>
                    {/* name input */}
                    <input type="text" id="name" value={name} disabled={!changeDetail} onChange={onChange} className={`w-full px-4 py-2 mb-6 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${changeDetail && "bg-red-200 focus:bg-red-200"}`}/>
                    {/* email input */}
                    <input type="text" id="email" value={email} disabled className="w-full px-4 py-2 mb-6 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out"/>

                    <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6">
                        <p className="flex items-center">
                            Do you want change your name ?
                            <span 
                                onClick={() => {
                                  changeDetail && onSubmit()
                                  setChangeDetail((prevState) => !prevState)
                                }} 
                                className="text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer">
                                {changeDetail ? "Apply change" : "Edit"}</span>
                        </p>
                        <p onClick={onLogout} className="text-blue-600 hover:text-blue-800 transition ease-in-out duration-200 cursor-pointer">
                            Sign out
                        </p>
                    </div>
                </form>
            </div>
        </section>
        </>
    )
}