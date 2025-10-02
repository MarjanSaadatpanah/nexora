import React, { useEffect, useState } from 'react';
import Cards from './Cards';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import { ExpiredProjects } from '../services/api';

const ClosedProjectsCompo = ({ all }) => {

    const [expiredProjetcts, setExpiredProjetcts] = useState([]);

    useEffect(() => {
        ExpiredProjects().then(data => {
            const updated = data.map(p => ({
                ...p,
                isExpired: new Date(p.end_date) < new Date()
            }));
            setExpiredProjetcts(updated);
        });
    }, []);

    return (
        <div className='mt-20'>
            <h1 className='text-3xl mb-2 dark:text-gray-200 text-gray-800'><EventBusyIcon className='mr-3 mb-1' /> Closed Projects:</h1>
            <p className="max-w-2xl font-light text-gray-500 dark:text-gray-300 lg:mb-8 md:text-lg lg:text-xl 400"> List of closed projects </p>
            <div className="grid gap-x-8 gap-y-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {all ?
                    expiredProjetcts.map((project) => (
                        <Cards key={project.id} {...project} link={`/project/${project.id}`} pState={{ project: project }} />
                    ))
                    :
                    expiredProjetcts.slice(0, 3).map((project) => (
                        <Cards key={project.id} {...project} link={`/project/${project.id}`} pState={{ project: project }} />
                    ))
                }
            </div>
        </div>
    )
}

export default ClosedProjectsCompo
