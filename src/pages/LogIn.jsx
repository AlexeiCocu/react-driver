import React, {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import { getAuth,signInWithEmailAndPassword  } from 'firebase/auth';
import {toast} from "react-toastify";
import OAuth from "../components/OAuth";

const LogIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const {email, password} = formData;

    const navigate = useNavigate();

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        try{
            const auth = getAuth();

            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            if(userCredential.user){
                navigate('/map')
            }

        }catch (error){
            toast.error('Incorrect User Credentials')
        }

    }

    return (
        <div className='page'>
            <form onSubmit={onSubmit}>
                <input type="email" className='' placeholder='Email' id='email' value={email} onChange={onChange}/>
                <input type={showPassword ? 'text' : 'password'} placeholder='Password' id='password' value={password} onChange={onChange}/>
                <div className='btn' onClick={()=>setShowPassword((prevState => !prevState))}>Show Password</div>

                <button className='btn btn__green'>Sign In</button>

                <OAuth/>
            </form>

            <Link to='/forgot-password'>Forgot Password</Link>

            <Link to='/register' ><button className='btn btn__red'>Register</button></Link>
        </div>
    );
};

export default LogIn;