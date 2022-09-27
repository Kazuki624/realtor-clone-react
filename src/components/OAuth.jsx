import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export const OAuth = () => {
  const navigate = useNavigate("");
  async function onClickGoogle() {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider); //googleでの登録を上記で行っている
      const user = result.user;

      const docRef = doc(db, "users", user.uid); //登録済みユーザの分別
      const docSnap = await getDoc(docRef); //
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          Timestamp: serverTimestamp(),
        });
      }
      navigate("/");
    } catch (error) {
      toast.error("Could not authorize with Google");
    }
  }
  return (
    <button
      type="button"
      onClick={onClickGoogle}
      className="flex items-center justify-center bg-red-700 text-white px-7 py-3 uppercase text-sm font-medium w-full hover:bg-red-800 active:bg-red-900 shadow-md hover:shadow-lg active:shadow-lg transition duration-200 ease-in-out rounded"
    >
      <FcGoogle className="text-2xl bg-white rounded-full mr-2" />
      Continue with Google
    </button>
  );
};
