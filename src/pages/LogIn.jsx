import React, {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import { getAuth,signInWithEmailAndPassword  } from 'firebase/auth';
import {toast} from "react-toastify";
import OAuth from "../components/OAuth";
import { FaEyeSlash } from 'react-icons/fa'


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

            <div className="center">
                {/*<h1>Login</h1>*/}
                <div className='oauth_container'>
                    <OAuth/>
                </div>
                <hr/>

                <form onSubmit={onSubmit}>

                    <div className="txt_field">
                        <label>Email</label>
                        <input type="email" id='email' value={email} onChange={onChange} required />
                        <span></span>
                    </div>
                    <div className="txt_field">
                        <label>Password</label>
                        <input type={showPassword ? 'text' : 'password'} id='password' value={password} onChange={onChange} required />
                        <span></span>
                        <FaEyeSlash onClick={()=>setShowPassword((prevState => !prevState))} className='showPassword'/>
                    </div>

                    {/*<Link to='/forgot-password' className="pass">Forgot Password</Link>*/}
                    <input type="submit" value="Login" />
                        <div className="signup_link">
                            Not a member? <Link to='/register' ><button className='btn btn__red'>Register</button></Link>
                        </div>
                </form>
            </div>

        </div>
    );
};

export default LogIn;