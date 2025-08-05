import React from 'react';
import logo from '../assets/images/euf.png'
import { Link } from 'react-router-dom';
import Category from './Category';
import SearchAndFilter from './SearchAndFilter';

const Nav = () => {
    return (
        <>
            <div className='flex'>
                <Link to='/'><img src={logo} alt="Your Company" className="h-11 w-auto" /></Link>
                <Category />
            </div>
            <SearchAndFilter />
        </>
    )
}

export default Nav
