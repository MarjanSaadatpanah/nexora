import { useContext } from 'react';
import logo from '../assets/images/euf.png'
import { Link } from 'react-router-dom';
import Category from './Category';
import { SearchContext } from '../contexts/SearchContext';
// import SearchAndFilter from './SearchAndFilter';

const Nav = () => {
    const { setSearchTerm } = useContext(SearchContext);

    return (
        <>
            <div className='flex pb-4'>
                <Link
                    to='/'
                    onClick={() => { setSearchTerm('') }}>
                    <img src={logo} alt="Your Company" className="h-11 mr-2.5 w-auto" />
                </Link>
                <Category className="mb-11" />
            </div>
            {/* <SearchAndFilter /> */}
        </>
    )
}

export default Nav

