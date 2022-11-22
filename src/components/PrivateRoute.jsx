import React from 'react'
import { Outlet, Navigate } from 'react-router';
import { useAuthStatus } from '../hooks/useAuthStatus';

export const PrivateRoute = () => {
    const {loggedIn, checkingStatus} = useAuthStatus();
    if(checkingStatus){
        return <h3>Loading ...</h3>
    }
    // もしログイン時に、firebaseにサインインデータがなければ、サインインページへ遷移する設定。URLを叩いてプロフィールページに行く時などに機能する
  return loggedIn ? <Outlet /> : <Navigate to= "/sign-in" />
}

