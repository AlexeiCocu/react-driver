import React, {useEffect, useState} from 'react';
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import * as L from "leaflet";
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

    const greenIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const redIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });


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
            // const q = query(usersRef, where('email', '!=',  auth.currentUser.email))
            const q = query(usersRef, where('active', '==',  true))


            // const q = query(usersRef)

            // Execute query
            const querySnap = await getDocs(q);
            const allUsers = [];

            console.log(allUsers)

            querySnap.forEach((doc) => {
                return allUsers.push({
                    id: doc.id,
                    data: doc.data(),
                    lat: doc.data().geolocation.lat,
                    lng: doc.data().geolocation.lng
                })
            })

            setUsers(allUsers);
            setLoading(false);
        } catch (error) {
            toast.error('Could not fetch users!')
        }
    }

    useEffect(()=>{
        setUser(auth.currentUser)
        navigator.geolocation.getCurrentPosition(function(position) {
            setUserLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            })
        });

        fetchAllUsers()
        fetchUsers();

    },[])


    if(loading){
        return <Spinner />
    }

    return (
       <>
           <button className='btn btn-info' onClick={()=>fetchAllUsers()}>Refresh</button>
           <MapContainer style={{height: '90vh', width: '100vw'}}
                         center={[userLocation.lat, userLocation.lng]}
                         zoom={13} scrollWheelZoom={true}>
               <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />


               {users.map((user) => (
                   <Marker position={[user.lat, user.lng]} key={user.id}>
                       <Popup>{user.data.name}</Popup>
                   </Marker>
               ))}

               <Marker position={[userLocation.lat, userLocation.lng]} icon={user.active ? greenIcon : redIcon} >
                   <Popup>{user.name} / {user.active ? 'Visible' : 'Not Visible'}</Popup>
               </Marker>

           </MapContainer>
       </>
    )
};

export default Map;