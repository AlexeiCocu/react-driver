import React, {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import OAuth from "../components/OAuth";


const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })

    const {name, email, password} = formData;

    const navigate = useNavigate();

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            updateProfile(auth.currentUser, {
                displayName: name
            })

            const formDataCopy = {...formData};
            delete formDataCopy.password;
            formDataCopy.timestamp = serverTimestamp();

            await setDoc(doc(db, 'users', user.uid), formDataCopy)

            navigate('/map')

        }catch (error) {
            toast.error('Something went wrong!')
        }

    }

    return (
        <div className='page'>
            <form onSubmit={onSubmit}>
                <input type="text" className='' placeholder='Name' id='name' value={name} onChange={onChange}/>
                <input type="email" className='' placeholder='Email' id='email' value={email} onChange={onChange}/>
                <input type={showPassword ? 'text' : 'password'} placeholder='Password' id='password' value={password} onChange={onChange}/>
                <div className='btn' onClick={()=>setShowPassword((prevState => !prevState))}>Show Password</div>


                <button className='btn btn__green'>Register</button>

                <OAuth/>


            </form>

            <Link to='/' ><button className='btn btn__red'>Log In</button></Link>
        </div>
    );
};

export default Register;