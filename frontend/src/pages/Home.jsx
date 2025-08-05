import { SearchContext } from '../contexts/SearchContext'
import Category from '../components/Category'
import ExpieringSoon from '../components/ExpieringSoon'
import Hero from '../components/Hero'
import RecentlyAdded from '../components/RecentlyAdded'
import SearchAndFilter from '../components/SearchAndFilter'
import TopProjects from '../components/TopProjects';
import { useContext } from 'react';



const Home = () => {
    const { searchActive } = useContext(SearchContext);
    console.log("Home rendered");

    return (
        <div className='w-full m-auto pt-5 '>
            {!searchActive && <Hero />}
            <Category />
            <SearchAndFilter />
            {!searchActive && <RecentlyAdded />}
            {!searchActive && <TopProjects />}
            {!searchActive && <ExpieringSoon />}

        </div>
    )
}

export default Home


