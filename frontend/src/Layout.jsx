import React from 'react';
import { Outlet } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';

const Layout = () => {

    return (
        <>
            <div>
                <Nav />
                <div className='lg:w-9/12 w-full m-auto mt-5 '>
                    <Outlet />
                </div>
                <Footer />
            </div>
        </>
    )
}

export default Layout
