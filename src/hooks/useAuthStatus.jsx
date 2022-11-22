import { getAuth, onAuthStateChanged } from 'firebase/auth'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

export const useAuthStatus = () => {
    // useStateを用いて、閲覧者が登録者ならfalseにする。その後、authenticateで確認し、照合されたらtrueにする
    const [loggedIn, setLoggedIn] = useState(false)
    const [checkingStatus, setCheckingStatus] = useState(true)

    // firebaseでsingInでユーザかどうかを確認する
    useEffect(() => {
        const auth = getAuth()
        // signInで登録されたユーザかどうかを確認し、データがある場合はhooksのstateで、falseをtrueにする
        onAuthStateChanged(auth, (user) => {
            if(user){
                setLoggedIn(true)
            }
            setCheckingStatus(false)
        })
    },[])

  return {loggedIn,checkingStatus}
}

// export default useAuthStatus