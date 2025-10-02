import { Suspense } from 'react';
import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { GetProjectById } from '../services/api';
import { SearchContext } from '../contexts/SearchContext';

import { FaArrowLeftLong } from "react-icons/fa6";
import { FaCrown, FaHandshake, FaGlobe } from "react-icons/fa6";
import { BsPeopleFill } from "react-icons/bs";

import Organization from '../components/project-details/Organization';
import Project from '../components/project-details/Project';
import SimilarProjects from '../components/SimilarProjects';

const ProjectDetails = () => {
    const { isLoading, setIsLoading } = useContext(SearchContext);
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
                } catch (err) {
                    console.error('Error fetching project:', err);
                    setError('Failed to fetch project details');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchProject();
        }
    }, [id, location.state, setIsLoading]);

    const handleBack = () => {
        if (location.state?.projectList && location.state?.searchTerm) {
            navigate('/', { state: location.state });
        } else {
            navigate(-1);
        }
    };

    // Helper function to normalize role names for comparison
    const normalizeRole = (role) => {
        if (!role) return '';
        return role.toLowerCase()
            .replace(/[\s_-]+/g, '') // Remove spaces, underscores, hyphens
            .trim();
    };

    // Helper function to check if a role matches any of the expected variations
    const isRoleMatch = (role, expectedRoles) => {
        const normalizedRole = normalizeRole(role);
        return expectedRoles.some(expectedRole =>
            normalizedRole === normalizeRole(expectedRole) ||
            normalizedRole.includes(normalizeRole(expectedRole)) ||
            normalizeRole(expectedRole).includes(normalizedRole)
        );
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!project) return <p>No project found</p>;


    // Filter organizations for each specific role with more flexible matching
    const participants = project.organizations?.filter(org =>
        isRoleMatch(org.role, ['participant', 'participants'])
    );

    const associatedPartners = project.organizations?.filter(org =>
        isRoleMatch(org.role, [
            'associatedPartner',
            'associated partner',
            'associatedpartner',
            'associated_partner',
            'associated-partner'
        ])
    );

    const thirdParties = project.organizations?.filter(org =>
        isRoleMatch(org.role, [
            'thirdParty',
            'third party',
            'thirdparty',
            'third_party',
            'third-party'
        ])
    );

    // Find the coordinator from the organizations array
    const coordinator = project.coordinator;


    // console.log(project.objective_data.summary)

    return (
        <>
            <Suspense fullback={<h1>Loading project details...</h1>}>
                <div className="lg:flex py-5 pt-25 rounded space-y-3 border-t-2 border-gray-300">
                    <button
                        onClick={handleBack}
                        className="hidden sm:block fixed pt-20 h-96 text-gray-800 dark:text-gray-300 hover:text-blue-500 cursor-pointer focus:ring-4 focus:outline-none focus:ring-black font-medium text-base px-7">
                        <span className='text-sm'>Back</span>
                        <FaArrowLeftLong className="text-lg" />
                    </button>

                    <div className='lg:pl-24 min-h-screen'>
                        {/* project information */}
                        <Project project={project} />


                        {/* coordinator (conditionally rendered) */}
                        {coordinator && (
                            <div className="pb-2 mb-3 mt-20">
                                <div className="flex text-lg text-gray-700 dark:text-gray-200">
                                    <FaCrown className='mt-1 mr-3' />
                                    <h3>Coordinated by:</h3>
                                </div>

                                <Organization organization={coordinator} />
                            </div>
                        )}

                        {/* Participant(s): (conditionally rendered) */}
                        {participants && participants.length > 0 && (
                            <div className="pb-2 mb-3 mt-20 ">
                                <div className="flex text-lg text-gray-700 dark:text-gray-200">
                                    <FaHandshake className='mt-1 mr-3' />
                                    <h3>Participant(s):</h3>
                                </div>

                                <ul className="grid w-full gap-2 grid-cols-1">
                                    {participants.map((participant, index) => (
                                        <li key={participant.id || index}>
                                            <Organization organization={participant} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* thirdParty(s): (conditionally rendered) */}
                        {thirdParties && thirdParties.length > 0 && (
                            <div className="pb-2 mb-3 mt-20">
                                <div className="flex text-lg text-gray-700">
                                    <FaGlobe className='mt-1 mr-3' />
                                    <h3>Third Party(s):</h3>
                                </div>

                                <ul className="grid w-full gap-2 grid-cols-1">
                                    {thirdParties.map((thirdParty, index) => (
                                        <li key={thirdParty.id || index}>
                                            <Organization organization={thirdParty} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* associatedPartner(s): (conditionally rendered) */}
                        {associatedPartners && associatedPartners.length > 0 && (
                            <div className="pb-2 mb-3 mt-20">
                                <div className="flex text-lg text-gray-700">
                                    <BsPeopleFill className='mt-1 mr-3' />
                                    <h3>Partner(s):</h3>
                                </div>

                                <ul className="grid w-full gap-2 grid-cols-1">
                                    {associatedPartners.map((associatedPartner, index) => (
                                        <li key={associatedPartner.id || index}>
                                            <Organization organization={associatedPartner} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className='mt-40'>
                            <SimilarProjects />
                        </div>
                    </div>
                </div >
            </Suspense>
        </>
    );
}

export default ProjectDetails;