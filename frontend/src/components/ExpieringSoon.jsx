import React, { useEffect, useState } from 'react';
import Cards from './Cards';
import Speed from '@mui/icons-material/Speed';
import { ExpiredProjects } from '../services/api';

const ExpieringSoon = () => {

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
            <h1 className='text-3xl mb-2'><Speed className='mr-3' /> Expiering Soon:</h1>
            <p className="max-w-2xl font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl 400"> The projects ending in up comming months</p>
            <div className="grid gap-x-8 gap-y-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {expiredProjetcts.map((project) => (
                    <Cards key={project.id} {...project} link={`/project/${project.id}`} pState={{ project: project }} />
                ))}
            </div>
        </div>
    )
}

export default ExpieringSoon
