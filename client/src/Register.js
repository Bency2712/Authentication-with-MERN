import { useState, useContext } from "react";
import axios from 'axios';
import UserContext from "./UserContext";


function Register(){

    const[email,setEmail]=useState('');
    const[password,setPassword]=useState('');
    const user = useContext(UserContext);

    function registerUser(e) {
        //this form won't be sent to this action using the default http request, but only with our ajax call, hence we use preventDefault
        e.preventDefault();

        const data = {email,password};
        //send a post request to api (express app), to do this we will use this
        axios.post('http://localhost:4000/register', data,{withCredentials:true})
        .then(response => {
            user.setEmail(response.data.email);
            setEmail('');
            setPassword('');
        console.log('Registration successful');
    })
    .catch(error => {
        console.error('Registration failed:', error);
    });
    }
    return(
        <form action="" onSubmit={e =>registerUser(e)}>
            <input type="email" placeholder="email" value={email} onChange={e => setEmail(e.target.value)}/> <br/>
            <input type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)}/> <br/>
            <button type="submit"> Register</button><br/>

        </form>
    );
}

export default Register;


