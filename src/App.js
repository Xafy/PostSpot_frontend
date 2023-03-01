import React, { Suspense } from 'react';
import {BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";

// import Users  from './users/pages/Users';
// import Auth from './users/pages/Auth';
// import UsersPlaces from './places/pages/UsersPlaces';
// import NewPlace from './places/pages/NewPlace';
// import UpdatePlace from './places/pages/UpdatePlace';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';

const Users = React.lazy(() => import('./users/pages/Users'))
const Auth = React.lazy(() => import('./users/pages/Auth'))
const NewPlace = React.lazy(() => import('./places/pages/NewPlace'))
const UsersPlaces = React.lazy(() => import('./places/pages/UsersPlaces'))
const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace'))

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
      <Suspense fallback={
            <div className='center'>
              <LoadingSpinner/>
            </div>
      }>
        <Routes>
            {routes}
        </Routes>
      </Suspense>
      </main>
    </Router>
    </AuthContext.Provider>
  );
}

export default App;