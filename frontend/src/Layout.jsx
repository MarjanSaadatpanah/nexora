import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Nav from './components/Nav';

const Layout = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    return (
        <>
            <div className='lg:w-9/12 w-11/12 m-auto mt-5'>
                {!isHomePage && <Nav />}

                <Outlet />
            </div>
        </>
    )
}

export default Layout
