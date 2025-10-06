import React, { useEffect, useState } from 'react';
import Cards from './Cards';
import NewReleases from '@mui/icons-material/NewReleases';
import { RecentProjects } from '../services/api';

const RecentlyAdded = ({ all }) => {
    const [recentProjects, setRecentProjects] = useState([]);

    useEffect(() => {
        RecentProjects().then(data => {
            setRecentProjects(data);
        });
    }, [])

    return (
        <div className='mt-16'>
            <h1 className='text-3xl mb-2 dark:text-gray-200 text-gray-800'><NewReleases className='mr-3' /> Recently Added:</h1>
            <p className="max-w-2xl mb-2 font-light text-gray-500 dark:text-gray-300 lg:mb-8 md:text-lg lg:text-xl 400">
                The latest projects entered in the database
            </p>
            <div className="grid gap-x-8 gap-y-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

                {all ?
                    recentProjects.map((project) => (
                        <Cards key={project.id} {...project} link={`/project/${project.id}`} pState={{ project: project }} />
                    ))
                    :
                    recentProjects.slice(0, 3).map((project) => (
                        <Cards key={project.id} {...project} link={`/project/${project.id}`} pState={{ project: project }} />
                    ))
                }

            </div>

        </div>
    )
}

export default RecentlyAdded
