import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Nav from './components/Nav';

const Layout = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    return (
        <>
            <div className='w-9/12 m-auto mt-2'>
                {!isHomePage && <Nav />}

                <Outlet />
            </div>
        </>
    )
}

export default Layout
