import React from 'react';
import {useNavigate, useLocation, Link} from 'react-router-dom';

import {getAuth} from 'firebase/auth';

const Menu = () => {
    const auth = getAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const pathMatchRoute = (route) => {
        if(route === location.pathname){
            return true
        }
    }

    const onLogout = () => {
        auth.signOut();
        navigate('/')
    }

    return (
        <div>
            <button className={pathMatchRoute('/') ? 'btn__red btn' : 'btn'}  onClick={() => navigate('/') }>
                Log In
            </button>

            <button className={pathMatchRoute('/register') ? 'btn__red btn' : 'btn'}  onClick={() => navigate('/register') }>
                Register
            </button>

            <button className={pathMatchRoute('/map') ? 'btn__red btn' : 'btn'}  onClick={() => navigate('/map') }>
                Map
            </button>

            <button className={pathMatchRoute('/profile') ? 'btn__red btn' : 'btn'}  onClick={() => navigate('/profile') }>
                Profile
            </button>

            <button className='btn btn__red' onClick={onLogout}>Log Out</button>
        </div>
    );
};

export default Menu;