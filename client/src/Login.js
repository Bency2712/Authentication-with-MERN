import { useState, useContext } from "react";
import axios from 'axios';
import UserContext from "./UserContext";


function Login(){

    const[email,setEmail] = useState('');
    const[password,setPassword] = useState('');
    const [loginError, setLoginError] = useState(false);
    const user = useContext(UserContext);


    function loginUser(e) {
        //this form won't be sent to this action using the default http request, but only with our ajax call, hence we use preventDefault
        e.preventDefault();

        const data = {email,password};
        //send a post request to api (express app), to do this we will use this
        axios.post('http://localhost:4000/login', data,{withCredentials:true})
        .then(response => {
            user.setEmail(response.data.email);
            setEmail('');
            setPassword('');
            setLoginError(false);
            console.log('Login successful');
    })
    .catch(() => {
        setLoginError(true);
    });
    }
    return(
        <form action="" onSubmit={e =>loginUser(e)}>
            {/*We will check if there is any login error and if it is there then we will give out Login Error*/}
            {loginError &&(
                <div>LOGIN ERROR ! WRONG EMAIL OR PASSWORD!</div>
            )}
            <input type="email" placeholder="email" value={email} onChange={e => setEmail(e.target.value)}/> <br/>
            <input type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)}/> <br/>
            <button type="submit"> Log in</button><br/>

        </form>
    );
}

export default Login;


