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
    const [active, setActive] = useState(false)
    const [geolocation, setGeolocation] = useState(null)
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        description: '',
        images: {},
    })

    const {
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



        const setActiveStatus = async () => {

            const formDataCopy = {
                ...formData,
                geolocation,
                active
            }

            //Update listing
            const docRef = doc(db, 'users', auth.currentUser.uid);
            await updateDoc(docRef, {
                geolocation
            })

        }


        fetchUser()

        setActiveStatus()

        fetchUser()

    }, [active])



    const handleActive = async () => {

        setActive((prevState => !prevState))

        navigator.geolocation.getCurrentPosition(function(position) {
            setGeolocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            })
        });

        //Update listing
        const docRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(docRef, {
            active: active,
            geolocation,
        })

        if(active){
            toast.error('Removed from map')

        }else {
            toast.success('Posted on map')
        }

    }





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
        <div className='page mt-4'>


            <form className='card col-10 col-md-6' onSubmit={onSubmit}>

                <div className='mt-2  d-flex flex-column align-items-center justify-content-between'>
                    <h5 className='m-1'>Edit Profile</h5>
                    <div className={ user.active ? 'btn btn-success mt-1' : 'btn btn-danger mt-1' } onClick={()=>handleActive()} >{ user.active ? 'Online' : 'Offline'}</div>
                </div>
                <hr/>


                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text"
                           className="form-control"
                           id="name"
                           value={name}
                           onChange={onMutate}
                           required />
                </div>

                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone</label>
                    <input type="tel"
                           className="form-control"
                           id="phone"
                           value={phone}
                           onChange={onMutate}
                           required />
                </div>

                <div className="mb-3">
                    <label htmlFor="category" className="form-label">Category</label>

                    <select className="form-control" name="category" id="category" onChange={onMutate}>
                        <option >Select</option>
                        <option value="client">Client</option>
                        <option value="driver">Driver</option>
                        <option value="seller">Seller</option>
                        <option value="buyer">Buyer</option>
                    </select>

                </div>

                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                        style={{height: '100px'}}
                           className="form-control"
                           id="description"
                           value={description}
                           onChange={onMutate}
                           required />
                </div>

                <button type="submit" className="btn btn-primary">Save</button>
            </form>

        </div>
    );
};

export default EditProfile;