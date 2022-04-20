import React from 'react';
import {useState, useEffect} from "react";
import {getAuth, updateProfile} from 'firebase/auth';

import {updateDoc, doc, getDoc} from 'firebase/firestore';
import {db} from '../firebase.config';
import {useNavigate, Link, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import Spinner from "../components/Spinner";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate;
    const params = useParams();
    const auth = getAuth();
    const [changeDetails, setChangeDetails] = useState(false);
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
    });
    const {name} = formData;


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


    const onSubmit = async () => {
        // try {
        //     if(auth.currentUser.displayName !== name){
        //         // Update display name in fb
        //         await updateProfile(auth.currentUser, {
        //             displayName: name
        //         })
        //
        //         // Update in firestore
        //         const userRef = doc(db, 'users', auth.currentUser.uid);
        //         await updateDoc(userRef, {
        //             name: name
        //         })
        //
        //         toast.success('Name changed successfully!')
        //     }
        //
        // }catch (error){
        //     toast.error('Could not update profile')
        // }
    }

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }



    if(loading){
        return <Spinner />
    }


    return (
        <>
            <h3>User Profile</h3>

            <div>Profile Details</div>
            <div>Personal Details</div>
            <div className='btn'
                 onClick={()=>{changeDetails && onSubmit()
                        setChangeDetails((prevState) => !prevState)}
                 }>
                {changeDetails ? 'done' : 'change name'}
            </div>
            <br/>
            <div>
                <form>
                    <input type="text"
                           id='name'
                           className={!changeDetails ? 'profileName' : 'profileNameActive'}
                           disabled={!changeDetails}
                           value={name}
                           onChange={onChange}
                    />
                </form>
            </div>
            <div>
                <h3>User details</h3>
                <div>{user.category}</div>
            </div>

            <div>
                <Link to={"/edit-profile"}>
                    <button>Edit Profile</button>
                </Link>
            </div>
        </>
    )
};

export default Profile;