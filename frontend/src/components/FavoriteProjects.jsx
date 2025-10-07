import React, { useEffect, useState } from 'react';
import Cards from './Cards';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { getFavorites } from '../services/userApi';
import { GetProjectById } from '../services/api';
import { useAuth } from '@clerk/clerk-react';

const FavoriteProjects = () => {
    const { getToken, isSignedIn } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isSignedIn) {
            setFavorites([]);
            setLoading(false);
            return;
        }

        const fetchFavoriteProjects = async () => {
            try {
                setLoading(true);

                // Step 1: Get favorite project IDs
                const favoriteIds = await getFavorites(getToken);

                if (favoriteIds.length === 0) {
                    setFavorites([]);
                    setLoading(false);
                    return;
                }

                // Step 2: Fetch full project data for each ID
                const projectPromises = favoriteIds.map(id => GetProjectById(id));
                const projects = await Promise.all(projectPromises);

                // Step 3: Add isExpired flag to each project
                const updatedProjects = projects.map(p => ({
                    ...p,
                    isExpired: new Date(p.endDate) < new Date()
                }));

                setFavorites(updatedProjects);
            } catch (err) {
                console.error('Failed to fetch favorite projects:', err);
                setError('Failed to load favorite projects');
            } finally {
                setLoading(false);
            }
        };

        fetchFavoriteProjects();
    }, [getToken, isSignedIn]);

    if (!isSignedIn) {
        return (
            <div className='pt-32 min-h-screen'>
                <h1 className='text-3xl mb-2 dark:text-gray-200 text-gray-800'>
                    <FavoriteIcon className='mr-3 mb-1' /> Your Favorite Projects
                </h1>
                <p className="max-w-2xl font-light text-gray-500 dark:text-gray-300 lg:mb-8 md:text-lg lg:text-xl">
                    Please sign in to view your favorite projects
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className='pt-32 min-h-screen'>
                <h1 className='text-3xl mb-2 dark:text-gray-200 text-gray-800'>
                    <FavoriteIcon className='mr-3 mb-1' /> Your Favorite Projects
                </h1>
                <p className="max-w-2xl font-light text-gray-500 dark:text-gray-300 lg:mb-8 md:text-lg lg:text-xl">
                    Loading your favorites...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className='pt-32 min-h-screen'>
                <h1 className='text-3xl mb-2 dark:text-gray-200 text-gray-800'>
                    <FavoriteIcon className='mr-3 mb-1' /> Your Favorite Projects
                </h1>
                <p className="max-w-2xl font-light text-red-500 lg:mb-8 md:text-lg lg:text-xl">
                    {error}
                </p>
            </div>
        );
    }

    if (favorites.length === 0) {
        return (
            <div className='pt-32 min-h-screen'>
                <h1 className='text-3xl mb-2 dark:text-gray-200 text-gray-800'>
                    <FavoriteIcon className='mr-3 mb-1' /> Your Favorite Projects
                </h1>
                <p className="max-w-2xl font-light text-gray-500 dark:text-gray-300 lg:mb-8 md:text-lg lg:text-xl">
                    You haven't added any favorite projects yet
                </p>
            </div>
        );
    }

    return (
        <div className='pt-32 min-h-screen'>
            <h1 className='text-3xl mb-2 dark:text-gray-200 text-gray-800'>
                <FavoriteIcon className='mr-3 mb-1' /> Your Favorite Projects
            </h1>
            <p className="max-w-2xl font-light text-gray-500 dark:text-gray-300 lg:mb-8 md:text-lg lg:text-xl">
                Explore your {favorites.length} favorite project{favorites.length !== 1 ? 's' : ''}
            </p>
            <div className="grid gap-x-8 gap-y-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {favorites.map((project) => (
                    <Cards
                        key={project.id}
                        {...project}
                        link={`/project/${project.id}`}
                        pState={{ project: project }}
                    />
                ))}
            </div>
        </div>
    );
};

export default FavoriteProjects;