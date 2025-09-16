import { SearchContext } from '../contexts/SearchContext'
import Nav from '../components/Nav'
import ExpieringSoon from '../components/ExpieringSoon'
import Hero from '../components/Hero'
import RecentlyAdded from '../components/RecentlyAdded'
import SearchAndFilter from '../components/SearchAndFilter'
import TopProjects from '../components/TopProjects';
import { useContext } from 'react';
// import Stats from '../components/stats/Stats'




const Home = () => {
    const { searchActive } = useContext(SearchContext);

    return (
        <div className='w-full m-auto '>
            {!searchActive && <Hero />}
            <Nav />
            <SearchAndFilter />
            {/* {!searchActive && <Stats />} */}
            {!searchActive && <RecentlyAdded />}
            {!searchActive && <TopProjects />}
            {!searchActive && <ExpieringSoon />}

        </div>
    )
}

export default Home


