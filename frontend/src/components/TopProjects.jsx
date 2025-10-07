import React, { useEffect, useState } from 'react';
import Cards from './Cards';
import MonetizationOn from '@mui/icons-material/MonetizationOn';
import { TopTenProjects } from '../services/api';

const TopProjects = () => {
    const [topTenProjects, setTopTenProjects] = useState([]);

    useEffect(() => {
        TopTenProjects().then(data => {
            const updated = data.map(p => ({
                ...p,
                isExpired: new Date(p.end_date) < new Date()
            }));
            setTopTenProjects(updated);
        });
    }, []);

    return (
        <div className='mt-20'>
            <h1 className='text-3xl mb-2 dark:text-gray-200 text-gray-800'><MonetizationOn className='mr-3' /> Top Projects:</h1>
            <p className="max-w-2xl font-light text-gray-500 dark:text-gray-300 lg:mb-8 md:text-lg lg:text-xl 400"> The projects with the largest budgets</p>
            <div className="grid gap-x-8 gap-y-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {topTenProjects.map((project) => (
                    <Cards key={project.id} {...project} link={`/project/${project.id}`} pState={{ project: project }} />
                ))}
            </div>

        </div>
    )
}

export default TopProjects
