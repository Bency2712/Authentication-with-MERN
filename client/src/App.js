import './App.css';
import {BrowserRouter, Routes, Route, Link} from "react-router-dom" ;
import Register from './Register';
import Login from './Login';
import UserContext from './UserContext';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [email,setEmail] = useState('');

 { /*After refreshing, it will not show the logged in user, hence we will have to check if there is a cookie, if yes, then we have to get the user for the json web token
//to do this we need to make a callback to api to check if we can retrieve a user from jwt
To use it we will call a function only once when the app starts
We will use useEffect
*/}

 useEffect (()=>{
  axios.get('http://localhost:4000/user', {withCredentials: true})
  .then(response =>{
    setEmail(response.data.email);
  });
 },[]);

 function logout(){
  axios.post('http://localhost:4000/logout', {}, {withCredentials:true})
  .then(() => setEmail(''));
 }

  return (
    <UserContext.Provider value={{email, setEmail}}>
    <BrowserRouter>
   {/*If we have another email Then we will say logged in as email, Otherwise not logged in*/}
      <div>
        {!!email && (
          <div>Logged in as {email}
          <button onClick={() => logout()}>Logout</button>
          </div>
        )}
        {!email && (
          <div>Not logged in</div>
        )}
      </div>

      <hr/>
      
      <div>
        <Link to={'/'}>Home </Link>
        <Link to={'/login'}>|Login </Link>
        <Link to={'/register'}>|Register</Link>
      </div>
      <Routes>
        <Route exact path={'/register'} element={<Register />} />
        <Route exact path={'/login'} element={<Login />} />
      </Routes>
      <hr/> {/* to show thematic change in the content */}
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
