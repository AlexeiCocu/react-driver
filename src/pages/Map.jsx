import React, {useEffect, useState} from 'react';
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {getAuth} from "firebase/auth";
import {updateDoc, doc, getDoc, collection, getDocs, query, where, orderBy, limit, startAfter} from 'firebase/firestore';
import {db} from "../firebase.config";
import {toast} from "react-toastify";
import Spinner from "../components/Spinner";


const Map = () => {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState(null);

    const [userLocation, setUserLocation] = useState(null)

    const [loading, setLoading] = useState(true);

    const auth = getAuth();

    useEffect(()=>{
        setUser(auth.currentUser)

        navigator.geolocation.getCurrentPosition(function(position) {

            setUserLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            })

            console.log("Latitude is :", position.coords.latitude);
            console.log("Longitude is :", position.coords.longitude);
        });

    },[])


    useEffect(()=>{
        const fetchUsers = async () => {
            const docRef = doc(db, 'users', auth.currentUser.uid)
            const docSnap = await getDoc(docRef)

            if(docSnap.exists()){
                setUser(docSnap.data())
                setLoading(false)
            }
        }


        const fetchAllUsers = async () => {

            try {
                // Get reference
                const usersRef = collection(db, 'users')

                // Create a query
                const q = query(usersRef)

                // Execute query
                const querySnap = await getDocs(q);

                const allUsers = [];

                querySnap.forEach((doc) => {
                    return allUsers.push({
                        id: doc.id,
                        data: doc.data(),
                        lat: doc.data().geolocation.lat,
                        lng: doc.data().geolocation.lng
                    })
                })

                console.log(allUsers)

                setUsers(allUsers);
                setLoading(false);
            } catch (error) {
                toast.error('Could not fetch users!')
            }

        }


        fetchAllUsers()
        fetchUsers();

    }, [])

    // return user ? <h1>{user.displayName}, in map</h1> : 'Not logged in'

    if(loading){
        return <Spinner />
    }

    return (
       <>
           <MapContainer style={{height: '90vh', width: '100vw'}}
                         center={[userLocation.lat, userLocation.lng]}
                         zoom={13} scrollWheelZoom={true}>
               <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
               {/*<Marker position={[userLocation.lat, userLocation.lng]}/>*/}



               {users.map((user) => (
                   <Marker position={[user.lat, user.lng]} key={user.id}/>
               ))}

           </MapContainer>
       </>
    )
};

export default Map;