import { useCallback, useEffect, useState } from 'react';

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(false)
    const [tokenExpirationTime, setTokenExpirationTime] = useState()
    const [userId, setUserId] = useState(null)

    const login = useCallback((uid, token, expirationDate) => {
        setToken(token);
        setUserId(uid);
        const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60)
        setTokenExpirationTime(tokenExpirationDate)
        localStorage.setItem(
            'userData', JSON.stringify({
            userId: uid, token: token, expiration: tokenExpirationDate.toISOString()
            })
        )
    }, [])

    const logout = useCallback(()=>{
        setToken(null);
        setTokenExpirationTime(null)
        setUserId(null);
        localStorage.removeItem('userData')
    }, [])

    useEffect(()=>{
        if(token && tokenExpirationTime){
            const remainingTime = tokenExpirationTime.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime)
        } else { 
            clearTimeout(logoutTimer);
        }
    },[token, logout, tokenExpirationTime])

    useEffect(()=>{
        const userData = JSON.parse(localStorage.getItem('userData'))
        if(userData && userData.token && new Date(userData.expiration) > new Date()){
            login(userData.userId, userData.token, new Date(userData.expiration))
        }
    },[login])

    return {token, login, logout, userId}
}

