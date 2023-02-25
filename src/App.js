import React, { useCallback, useState } from 'react';
import {BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";

import Auth from './users/pages/Auth';
import Users  from './users/pages/Users';
import NewPlace from './places/pages/NewPlace';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UsersPlaces from './places/pages/UsersPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import { AuthContext } from './shared/context/auth-context';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState(null)

  const login = useCallback((uid) => {
    setIsLoggedIn(true);
    setUserId(uid)
  }, [])

  const logout = useCallback(()=>{
    setIsLoggedIn(false);
    setUserId(null)
  }, [])

  let routes;

  if(isLoggedIn){
    routes = (
      <>
      <Route path='/' element={<Users />} />
      <Route path='/:userId/places' element={<UsersPlaces/>}></Route>
      <Route path='/places/new' element={<NewPlace/>}/>
      <Route path='/places/:placeId' element={<UpdatePlace/>}/>
      <Route path='*' element={<Navigate replace to="/" />}/>
      </>
    ) ;
  }
  else{
    routes = (
      <>
      <Route path='/' element={<Users />} />
      <Route path='/auth' element={<Auth />} />
      <Route path='/:userId/places' element={<UsersPlaces/>}></Route>
      <Route path='*' element={<Navigate replace to="/auth" />}/>
      </>
    );
  }

  return (
    <AuthContext.Provider
    value={{ isLoggedIn: isLoggedIn,
    userId:userId,
    login: login,
    logout: logout }}
    >
    <Router>
      <MainNavigation/>
      <main>
        <Routes>
          {routes}
        </Routes>
      </main>
    </Router>
    </AuthContext.Provider>
  );
}

export default App;