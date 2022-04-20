import React from 'react';
import { useState, useEffect, useRef } from 'react'
import {getAuth, onAuthStateChanged, updateProfile} from 'firebase/auth'
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from 'firebase/storage'
import { doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import {v4 as uuidv4} from 'uuid'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'

const EditProfile = () => {
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(false)
    const [formData, setFormData] = useState({
        category: '',
        on_map: false,
        name: '',
        phone: '',
        description: '',
        images: {},
    })

    const {
        category,
        name,
        phone,
        description,
    } = formData


    const auth = getAuth()
    const navigate = useNavigate()
    const isMounted = useRef(true)


    // Fetch listing to edit
    useEffect(() => {
        setLoading(true);

        const fetchUser = async () => {
            const docRef = doc(db, 'users', auth.currentUser.uid)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()){
                setUser(docSnap.data())
                setFormData({ ...docSnap.data() })
                setLoading(false)
            }else{
                navigate('/')
                toast.error('User does not exist.')
            }
        }
        fetchUser()

    }, [])



    const onSubmit = async (e) =>{
        e.preventDefault()

        setLoading(true)

        try {
            if(auth.currentUser.displayName !== name){
                // Update display name in fb
                await updateProfile(auth.currentUser, {
                    displayName: name
                })
            }
        }catch (error){
            toast.error('Could not update profile')
        }

        const formDataCopy = {
            ...formData,
            timestamp: serverTimestamp(),
        }

        //Update listing
        const docRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(docRef, formDataCopy)


        setLoading(false)

        toast.success('User saved')
        navigate(`/profile`)
    }

    const onMutate = (e) => {
        let boolean = null

        if (e.target.value === 'true') {
            boolean = true
        }
        if (e.target.value === 'false') {
            boolean = false
        }

        // Text/Booleans/Numbers
        if (!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value,
            }))
        }
    }

    return (
        <div>
            <header>
                <p>Edit Profile</p>
            </header>

            <main>
                <form onSubmit={onSubmit}>

                    <label className='formLabel'>Name</label>
                    <input
                        className='formInputName'
                        type='text'
                        id='name'
                        value={name}
                        onChange={onMutate}
                        required
                    />

                    <div className='formRooms flex'>
                        <div>
                            <label className='formLabel'>Phone</label>
                            <input
                                className='formInputSmall'
                                type='number'
                                id='phone'
                                value={phone}
                                onChange={onMutate}
                                // min='1'
                                // max='50'
                                required
                            />
                        </div>
                        <div>
                            <label className='formLabel'>Category</label>
                            <input
                                className='formInputSmall'
                                type='text'
                                id='category'
                                value={category}
                                onChange={onMutate}
                                min='1'
                                max='50'
                                required
                            />
                        </div>
                    </div>

                    <label className='formLabel'>Description</label>
                    <textarea
                        className='formInputAddress'
                        id='description'
                        value={description}
                        onChange={onMutate}
                        required
                    />


                    <button type='submit'>
                        SAVE
                    </button>
                </form>
            </main>
        </div>
    );
};

export default EditProfile;