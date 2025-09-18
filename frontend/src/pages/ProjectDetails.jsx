import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { GetProjectById } from '../services/api';

import { SearchContext } from '../contexts/SearchContext';

import RecentlyAdded from '../components/RecentlyAdded';
import ExpieringSoon from '../components/ExpieringSoon';
import TopProjects from '../components/TopProjects';

import { FaArrowLeftLong } from "react-icons/fa6";

import Organization from '../components/project-details/Organization';
import Project from '../components/project-details/Project';

const ProjectDetails = () => {

    const { isLoading, setIsLoading } = useContext(SearchContext);

    // from project details
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);

    const [error, setError] = useState(null);

    useEffect(() => {
        if (location.state?.project) {
            setProject(location.state.project);
            setIsLoading(false);
        } else {
            const fetchProject = async () => {
                try {
                    setIsLoading(true);
                    const data = await GetProjectById(id);
                    setProject(data);
                    console.log('single project: ', data);
                } catch (err) {
                    console.error(err);
                    setError('Failed to fetch project details');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchProject();
        }
    }, [id, location.state]);

    const handleBack = () => {
        if (location.state?.projectList && location.state?.searchTerm) {
            navigate('/', { state: location.state });
        } else {
            navigate('/');
        }
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!project) return <p>No project found</p>;

    console.log('project.start_date: ', project)

    return (
        <div className="lg:flex py-5 rounded space-y-3 border-t-2 border-gray-300">
            <button
                onClick={handleBack}
                className="hidden sm:block fixed pt-20 h-96 text-gray-800 hover:text-blue-500 cursor-pointer focus:ring-4 focus:outline-none focus:ring-black font-medium text-base px-7">
                <span className='text-sm'>Back</span>
                <FaArrowLeftLong className="text-lg" />
            </button>

            <div className='lg:pl-24'>

                {/* project information */}
                <Project project={project} />

                {/* coordinator */}
                <div className="pb-2 mb-3 mt-5">
                    <h3 className="text-lg">Coordinated by:</h3>
                    <Organization organization={project.coordinator} />
                </div>

                {/* Participant(s): */}
                <div className="pb-2 mb-3 mt-5">
                    <h3 className="text-lg">Participant(s):</h3>
                    <ul className="grid w-full gap-2 grid-cols-1">
                        {project.organizations?.map((participant, index) => (
                            <li key={participant.id || index}>
                                <Organization organization={participant} />
                            </li>
                        ))}
                    </ul>
                </div>

                <div className='mt-40'>
                    <RecentlyAdded />
                    <TopProjects />
                    <ExpieringSoon />
                </div>
            </div>
        </div >
    );
}
export default ProjectDetails;