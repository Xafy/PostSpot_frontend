import React from 'react';
import {BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";

import Auth from './users/pages/Auth';
import Users  from './users/pages/Users';
import NewPlace from './places/pages/NewPlace';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UsersPlaces from './places/pages/UsersPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';

function App() {
  const {token, login, logout, userId} = useAuth()

  let routes;

  if(token){
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
    value={{
    isLoggedIn: !!token,
    token: token,
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