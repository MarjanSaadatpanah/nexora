import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { GetProjectById } from '../services/api';
import { SearchContext } from '../contexts/SearchContext';

import RecentlyAdded from '../components/RecentlyAdded';
import ExpieringSoon from '../components/ExpieringSoon';
import TopProjects from '../components/TopProjects';

import { motion } from 'framer-motion';
import { BsCaretDownFill } from "react-icons/bs";
import { IoPersonCircleOutline } from "react-icons/io5";
import { HiOutlineMail } from "react-icons/hi";
import { MdOutlineLocalPhone } from "react-icons/md";
import { CiLinkedin } from "react-icons/ci";
import { FaArrowLeftLong } from "react-icons/fa6";

import { getName, getCode } from 'country-list';
import ReactCountryFlag from "react-country-flag";


const ProjectDetails = () => {

    // just for test
    console.log("ProjectDetails rendered");
    const { isLoading, setIsLoading } = useContext(SearchContext);

    const [coordinatorExpanded, setcoordinatorExpanded] = useState(false);
    const cordinatorView = () => {
        setcoordinatorExpanded(!coordinatorExpanded);
    };
    const [expandedParticipants, setExpandedParticipants] = useState({});
    const toggleParticipant = (index) => {
        setExpandedParticipants(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };


    function Li({ elem, value }) {
        return (
            <li>
                <label className="inline-flex items-center justify-between text-gray-900 w-full   rounded  peer-checked:border-green-400  peer-checked:text-green-400  ">
                    <div className="block">
                        <div className='flex'>
                            <div class="w-full">
                                <div class="text-sm">
                                    <p>{elem}: <span className='font-medium'>{value}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </label>
            </li>
        )
    }
    function LabelBox({ elem, value }) {
        return (
            <label className="inline-flex mb-3 items-center justify-between text-gray-900 w-full  peer-checked:border-green-400  peer-checked:text-green-400  ">
                <div className="block">
                    <div className='flex'>
                        <div class="w-full">
                            <div class="text-base">
                                <p>
                                    <span className='text-sm'>{elem}: </span> <br />{value}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </label>
        )
    }

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

    return (
        <div className=" py-5 rounded space-y-3">
            <button
                onClick={handleBack}
                className="text-gray-800 flex hover:text-white border border-gray-300 bg-gray-200 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-black font-medium rounded text-base px-7 py-2 text-center">
                <FaArrowLeftLong className="mr-3 text-lg " />
                <span className='text-sm'>Back</span>
            </button>


            <label className="inline-flex items-center pt-4 justify-between text-gray-900 w-full pb-5 ">
                <div class="block">
                    <div className='flex'>
                        <div class="w-full">
                            <div>
                                <p class="text-3xl mb-2 pr-16">{project.topic} </p>
                                <h4 className="text-sm text-blue-700">{project.acronym}</h4>
                                <h4 className="text-base text-blue-900">Statuse: {project.status}</h4>
                                <h4 className="text-base text-blue-900">Remaining Days: {project.remaining_days}</h4>
                            </div>

                            <ul className="grid gap-x-10 gap-y-2 grid-cols-2 mt-4">
                                <Li elem="Project ID" value={project.id} />
                                <Li elem="Start Date" value={project.start_date} />
                                <Li elem="Total Cost" value={project.total_cost} />
                                <Li elem="End Date" value={project.end_date} />
                                <Li elem="Funded Under" value={project.funded_under} />
                                <Li elem="EU Contribution" value={project.eu_contribution} />
                            </ul>

                            <div className='mt-11'>
                                <LabelBox elem="EU Programme" value={project.program} />
                                {/* <LabelBox elem="Topic" value={project.id} /> */}
                                <LabelBox elem="Call for Proposal" value={project.call_for_proposal} />
                                {/* <LabelBox elem="Project Contacts" value={project.id} /> */}
                                <LabelBox elem="Objective" value={project.objective} />
                            </div>

                        </div>
                    </div>
                </div >
            </label >

            {/* coordinator */}
            <div className="pb-2 mb-3 mt-5">
                <h3 className="text-lg">Coordinated by:</h3>
                <label className="inline-flex items-center justify-between text-gray-900 w-full py-3 border-t-2 border-t-gray-200 cursor-pointer hover:bg-slate-300">
                    <div className="block w-full">
                        <div className='flex w-full'>
                            <div className="w-3/5 ml-4 pr-3">
                                <div className="text-base font-semibold">
                                    <span>{project.coordinator ? project.coordinator.name : 'Not Defined'}</span>
                                </div>
                                <div className="mt-1 flex">

                                    {project.coordinator ? (
                                        <ReactCountryFlag
                                            countryCode={getCode(project.coordinator.country) || project.coordinator.country}
                                            svg
                                            style={{
                                                width: '1.5em',
                                                height: '1.5em',
                                            }}
                                            title={getName(project.coordinator.country) || project.coordinator.country}
                                        />
                                    ) : (
                                        <p className="text-xs">Coordinator Country: {project.coordinator ? getName(project.coordinator.country) || project.coordinator.country : 'Not Defined'}</p>
                                    )}
                                </div>
                            </div>
                            <div className="w-1/5">
                                <p>Net EU Contribution: <br />Not Defined</p>
                            </div>
                            <div className="w-1/5 ml-2">
                                <p>Total Contributions: <br />Not Defined</p>
                            </div>
                            <div className="ml-2">
                                <button onClick={cordinatorView} className="hover:font-bold px-5 inline-flex items-center">
                                    <motion.span animate={{ rotate: coordinatorExpanded ? 180 : 0 }}>
                                        <BsCaretDownFill className="ml-3" />
                                    </motion.span>
                                </button>
                            </div>
                        </div>

                        {/* show details of coordinator */}
                        {coordinatorExpanded && project.coordinator && (
                            <motion.div>
                                <div className="ml-5 mt-5">
                                    <div className='flex'>
                                        <IoPersonCircleOutline className='mt-1 mr-2' />
                                        <p>
                                            <span className='font-bold'>{project.coordinator.coordinatorContact}</span> / {project.coordinator.coordinatorRole}
                                        </p>
                                    </div>
                                    <div className='flex'><HiOutlineMail className='mt-1 mr-2' /><p>{project.coordinator.coordinatorEmail}</p></div>
                                    <div className='flex'><MdOutlineLocalPhone className='mt-1 mr-2' /><p>{project.coordinator.coordinatorPhone}</p></div>
                                    <div className='flex'><CiLinkedin className='mt-1 mr-2' /><p>{project.coordinator.coordinatorLinkedin}</p></div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </label>
            </div>


            {/* Participant(s): */}
            <div className="pb-2 mb-3 mt-5">
                <h3 className="text-lg">Participant(s):</h3>
                <ul className="grid w-full gap-2 grid-cols-1">
                    {project.participants?.map((participant, index) => (
                        <li key={participant.id || index}>
                            <label className="inline-flex items-center justify-between text-gray-900 w-full py-3 border-t-2 border-t-gray-200 cursor-pointer hover:bg-slate-300">
                                <div className="block w-full">
                                    <div className='flex w-full'>
                                        <div className="flex w-3/5 ml-4 pr-3">
                                            <div>
                                                <p>
                                                    <span>{participant.name || 'No Name'}</span>
                                                    <span className='ml-5 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full'>{participant.project_count}</span>
                                                </p>
                                                <div className="mt-1 flex">
                                                    {/* <p className="text-xs">{getName(participant.country) || participant.country || 'No Country'}</p> */}
                                                    <ReactCountryFlag
                                                        countryCode={getCode(participant.country) || participant.country}
                                                        svg
                                                        style={{
                                                            width: '1.5em',
                                                            height: '1.5em',
                                                        }}
                                                        title={getName(participant.country) || participant.country}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-1/5">
                                            <p>Net EU Contribution: <br />{participant.net_eu_contribution || 'Not Defined'}</p>
                                        </div>
                                        <div className="w-1/5 ml-2">
                                            <p>Total Contributions: <br />{participant.correct_contribution || 'Not Defined'}</p>
                                        </div>
                                        <div className="ml-2">
                                            <button onClick={() => toggleParticipant(index)} className="hover:font-bold px-5 inline-flex items-center">
                                                <motion.span animate={{ rotate: expandedParticipants[index] ? 180 : 0 }}>
                                                    <BsCaretDownFill className="ml-3" />
                                                </motion.span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* show details of participant */}
                                    {expandedParticipants[index] && (
                                        <motion.div>
                                            <div className="ml-5 mt-5">
                                                <div className='flex'>
                                                    <IoPersonCircleOutline className='mt-1 mr-2' />
                                                    <p>
                                                        <span className='font-bold'>{participant.participantContact}</span> / {participant.participantRole}
                                                    </p>
                                                </div>
                                                <div className='flex'><HiOutlineMail className='mt-1 mr-2' /><p>{participant.participantEmail}</p></div>
                                                <div className='flex'><MdOutlineLocalPhone className='mt-1 mr-2' /><p>{participant.participantPhone}</p></div>
                                                <div className='flex'><CiLinkedin className='mt-1 mr-2' /><p>{participant.participantLinkedin}</p></div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </label>
                        </li>
                    ))}
                </ul>
            </div>


            <div className='mt-40'>
                <RecentlyAdded />
                <TopProjects />
                <ExpieringSoon />
            </div>
        </div >
    );
}
export default ProjectDetails;