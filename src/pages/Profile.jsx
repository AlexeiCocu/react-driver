import React from 'react';
import {useState, useEffect} from "react";
import {getAuth, updateProfile} from 'firebase/auth';

import { doc, getDoc} from 'firebase/firestore';
import {db} from '../firebase.config';
import { Link } from "react-router-dom";
import {toast} from "react-toastify";
import Spinner from "../components/Spinner";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const auth = getAuth();


    useEffect(()=>{
        const fetchUsers = async () => {
            const docRef = doc(db, 'users', auth.currentUser.uid)
            const docSnap = await getDoc(docRef)

            if(docSnap.exists()){
                setUser(docSnap.data())
                setLoading(false)
            }
        }

        fetchUsers();

    }, [])


    if(loading){
        return <Spinner />
    }


    return (

        <div className='d-flex justify-content-center align-items-center mt-4'>
            <div className='card m-3'>
                <h3 className='mt-4 text-center'>User Profile</h3>
                <hr/>
                <div>
                    <h5>Name:</h5>
                    <p>{user.name}</p>
                </div>
                <div>
                    <h5>Category:</h5>
                    <p>{user.category.charAt(0).toUpperCase() + user.category.slice(1)}</p>
                </div>
                <div>
                    <h5>Phone:</h5>
                    <p>{user.phone ? user.phone : 'not set'}</p>
                </div>
                <div>
                    <h5>Description:</h5>
                    <p>{user.description ? user.description : 'not set'}</p>
                </div>

                <hr/>

                <div className='center_element'>
                    <Link to={"/edit-profile"}>
                        <button className='btn btn__red'>Edit Profile</button>
                    </Link>
                </div>
            </div>
        </div>



    )
};

export default Profile;