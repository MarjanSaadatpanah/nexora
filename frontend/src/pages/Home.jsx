import { SearchContext } from '../contexts/SearchContext'
import Nav from '../components/Nav'
import ExpieringSoon from '../components/ExpieringSoon'
import Hero from '../components/Hero'
import RecentlyAdded from '../components/RecentlyAdded'
import SearchAndFilter from '../components/SearchAndFilter'
import { useContext } from 'react';
import Stats from '../components/stats/Stats'
// import ProjectsPerProgrammeChart from '../components/stats/ProjectsPerProgrammeChart'
import ClosedProjectsCompo from '../components/ClosedProjectsCompo'

const Home = () => {
    const { searchActive } = useContext(SearchContext);

    return (
        <div className='w-full m-auto pt-20 min-h-screen '>

            {!searchActive && <Hero />}
            <SearchAndFilter />
            {!searchActive && <Stats />}
            {/* {!searchActive && <ProjectsPerProgrammeChart />} */}
            {!searchActive && <RecentlyAdded all={false} />}
            {!searchActive && <ExpieringSoon all={false} />}
            {!searchActive && <ClosedProjectsCompo all={false} />}
        </div>
    )
}

export default Home


