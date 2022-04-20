import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import {doc, setDoc, getDoc, serverTimestamp} from 'firebase/firestore';
import {db} from "../firebase.config";
import {toast} from "react-toastify";
import googleIcon from '../assets/svg/googleIcon.svg'

import {FcGoogle} from 'react-icons/fc'
import {FaFacebook} from 'react-icons/fa'

const OAuth = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const onGoogleClick = async () => {
        try{
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // check for user
            const decRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(decRef);

            // if user doesn't exist - create user
            if(!docSnap.exists()){
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName,
                    email: user.email,
                    geolocation: {
                        lat: 1,
                        lng:1
                    },
                    category: 'client',
                    description: '',
                    phone: '',
                    timeStamp: serverTimestamp()
                })
            }
            navigate('/map');

        }catch (error){
            toast.error('Could not authorize wit Google!')
        }
    }

    const onFacebookClick = async () => {
        try{
            const auth = getAuth();
            const provider = new FacebookAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // check for user
            const decRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(decRef);

            // if user doesn't exist - create user
            if(!docSnap.exists()){
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName,
                    email: user.email,
                    geolocation: {
                        lat: 1,
                        lng:1
                    },
                    category: 'client',
                    description: '',
                    phone: '',
                    timeStamp: serverTimestamp()
                })
            }
            navigate('/map');

        }catch (error){
            toast.error('Could not authorize wit Facebook!')
        }
    }

    return (
        <>
            <FcGoogle onClick={onGoogleClick} className='social_icon'/>
            <FaFacebook onClick={onFacebookClick} className='social_icon facebook'/>
        </>
    );
};

export default OAuth;