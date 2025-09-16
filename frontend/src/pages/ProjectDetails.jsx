import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { GetProjectById } from '../services/api';

import { SearchContext } from '../contexts/SearchContext';

import RecentlyAdded from '../components/RecentlyAdded';
import ExpieringSoon from '../components/ExpieringSoon';
import TopProjects from '../components/TopProjects';

import { motion } from 'framer-motion';
import { BsCaretDownFill } from "react-icons/bs";
import { MdLocationPin } from "react-icons/md";
import { TbWorldWww } from "react-icons/tb";
import { FaArrowLeftLong } from "react-icons/fa6";
import { VscRobot } from "react-icons/vsc";
import { FaPercent, FaAdn } from "react-icons/fa";

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';

import { getName, getCode } from 'country-list';
import ReactCountryFlag from "react-country-flag";


const ProjectDetails = () => {

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
                                    <span className='text-sm'>{elem}: </span>
                                    {value}
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
        <div className="lg:flex py-5 rounded space-y-3">
            <button
                onClick={handleBack}
                className="hidden sm:block fixed h-96 text-gray-800 hover:text-blue-500 cursor-pointer focus:ring-4 focus:outline-none focus:ring-black font-medium text-base px-7">
                <span className='text-sm'>Back</span>
                <FaArrowLeftLong className="text-lg" />
            </button>

            <div className='lg:pl-24'>

                {/* project information */}
                <label className="inline-flex items-center pt-4 justify-between text-gray-900 w-full pb-5 ">
                    <div class="block">
                        <div className='flex'>
                            <div class="w-full">
                                <div>
                                    <p class="text-3xl mb-2 pr-16">{project.title} </p>
                                    <h4 className="text-base text-blue-700">{project.acronym}</h4>
                                    <h4 className="text-base mt-3 text-blue-900">Statuse: {project.status}</h4>
                                    <h4 className="text-base text-blue-900">Remaining Days: {project.remaining_days}</h4>
                                </div>

                                <ul className="grid gap-x-10 gap-y-2 grid-cols-2 mt-4">
                                    <Li elem="Topics" value={project.topics} />
                                    <Li elem="Signature Date" value={project.signature_date} />
                                    <Li elem="Programme" value={project.programme} />
                                    <Li elem="Start Date" value={project.start_date} />
                                    <Li elem="Legal Basis" value={project.legal_basis} />
                                    <Li elem="End Date" value={project.end_date} />

                                </ul>

                                <div className='mt-11'>
                                    <LabelBox elem="Total Cost" value={project.total_cost} />
                                    <LabelBox elem="EU Contribution" value={project.eu_contribution} />
                                </div>

                                <div class="flex items-center space-x-4">
                                    <h4 className='text-sm'>Objective:</h4>
                                    <button
                                        className="flex text-blue-500 hover:text-blue-700 cursor-pointer">
                                        <VscRobot className="text-lg mr-1" />
                                        <span className='text-sm'>Make a Summary with AI</span>
                                    </button>
                                </div>
                                <p>{project.objective}</p>
                            </div>
                        </div>
                    </div >
                </label >

                {/* coordinator */}
                <div className="pb-2 mb-3 mt-5">
                    <h3 className="text-lg">Coordinated by:</h3>
                    <label className="inline-flex items-center justify-between text-gray-900 w-full py-3 border-t-2 border-t-gray-200 cursor-pointer hover:bg-slate-100">
                        <div className="block w-full">
                            <div className='flex w-full'>
                                <div className="w-3/5 ml-4 pr-3">
                                    <div className="text-base font-semibold">
                                        <span>{project.coordinator ? project.coordinator.name : 'Not Defined'}</span>
                                        {project.coordinator.SME === "true" && <span className='bg-green-600 text-white ml-3 rounded-full text-sm py-1'>SME</span>}
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
                                    <p>Net EU Contribution: <br /> {project.coordinator.netEcContribution} </p>
                                </div>
                                <div className="w-1/5 ml-2">
                                    <p>Total Contributions: <br /> {project.coordinator.ecContribution}</p>
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
                                    <div class="grid gap-4 mt-6 mx-2 sm:grid-cols-2 bg-gray-200 p-4 rounded-2xl">
                                        <div className='flex'>
                                            <label class="flex text-sm  text-gray-900 w-28">
                                                <MdLocationPin className='mr-1 mt-1' />
                                                Address:
                                            </label>
                                            <div class="block text-sm font-medium text-gray-900">
                                                {project.coordinator.street + ", " + project.coordinator.postCode + ", " + project.coordinator.city}
                                            </div>
                                        </div>
                                        <div className='flex'>
                                            <label class="flex text-sm  text-gray-900 w-28">
                                                <FaPercent className='mr-1 mt-1' />
                                                Vat Number: </label>
                                            <div class="block text-sm font-medium text-gray-900">{project.coordinator.vatNumber}</div>
                                        </div>
                                        <div className='flex'>
                                            <label class="flex text-sm  text-gray-900 w-28">
                                                <TbWorldWww className='mr-1 mt-1' />
                                                Website:
                                            </label>
                                            <div class="block text-sm font-medium text-gray-900">{project.coordinator.organizationURL}</div>
                                        </div>
                                        <div className='flex'>
                                            <label class="flex text-sm  text-gray-900 w-28">
                                                <FaAdn className='mr-1 mt-1' />
                                                Short Name:
                                            </label>
                                            <div class="block text-sm font-medium text-gray-900">{project.coordinator.shortName}</div>
                                        </div>
                                        <div className='flex'>
                                            <label class="flex text-sm  text-gray-900 w-28">
                                                <TbWorldWww className='mr-1 mt-1' />
                                                RCN:
                                            </label>
                                            <div class="block text-sm font-medium text-gray-900">{project.coordinator.rcn}</div>
                                        </div>
                                        <div className='flex'>
                                            <label class="flex text-sm  text-gray-900 w-28">
                                                <TbWorldWww className='mr-1 mt-1' />
                                                NUTS Code:
                                            </label>
                                            <div class="block text-sm font-medium text-gray-900">{project.coordinator.nutsCode}</div>
                                        </div>
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
                        {project.organizations?.map((participant, index) => (
                            <li key={participant.id || index}>
                                <label className="inline-flex items-center justify-between text-gray-900 w-full py-3 border-t-2 border-t-gray-200 cursor-pointer hover:bg-slate-100">
                                    <div className="block w-full">
                                        <div className='flex w-full'>
                                            <div className="flex w-3/5 ml-4 pr-3">
                                                <div>
                                                    <p>
                                                        <span>{participant.name || 'No Name'}</span>
                                                        <Tooltip
                                                            title="Number of the Involving Project"
                                                            placement="right-start"
                                                            arrow
                                                            slots={{
                                                                transition: Fade,
                                                            }}
                                                            slotProps={{
                                                                transition: { timeout: 600 },
                                                            }}
                                                        >
                                                            <IconButton>
                                                                <span className='ml-5 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-red-500 border-2 border-red-500 rounded-full'>
                                                                    {participant.project_count} 4
                                                                </span>
                                                            </IconButton>
                                                        </Tooltip>

                                                    </p>
                                                    <div className="mt-1 flex">
                                                        <ReactCountryFlag
                                                            countryCode={getCode(participant.country) || participant.country}
                                                            svg
                                                            style={{ width: '1.5em', height: '1.5em' }}
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
                                                <div class="grid gap-4 mt-6 mx-2 sm:grid-cols-2 bg-gray-200 p-4 rounded-2xl">
                                                    <div className='flex'>
                                                        <label for="name" class="block text-sm  text-gray-900 w-20">Address:</label>
                                                        <div for="name" class="block text-sm font-medium text-gray-900">
                                                            {participant.street + ", " + participant.postCode + ", " + participant.city}
                                                        </div>
                                                    </div>
                                                    <div className='flex'>
                                                        <label for="brand" class="block text-sm  text-gray-900 w-20">Vat Number: </label>
                                                        <div for="brand" class="block text-sm font-medium text-gray-900">{participant.vatNumber}</div>
                                                    </div>
                                                    <div className='flex'>
                                                        <label for="price" class="block text-sm  text-gray-900 w-20">Website:</label>
                                                        <div for="price" class="block text-sm font-medium text-gray-900">{participant.organizationURL}</div>
                                                    </div>
                                                    <div className='flex'>
                                                        <label for="category" class="block text-sm  text-gray-900 w-20">Short Name:</label>
                                                        <div for="category" class="block text-sm font-medium text-gray-900">{participant.shortName}</div>
                                                    </div>
                                                    <div className='flex'>
                                                        <label for="price" class="block text-sm  text-gray-900 w-20">RCN:</label>
                                                        <div for="price" class="block text-sm font-medium text-gray-900">{participant.rcn}</div>
                                                    </div>
                                                    <div className='flex'>
                                                        <label for="category" class="block text-sm  text-gray-900 w-20">NUTS Code:</label>
                                                        <div for="category" class="block text-sm font-medium text-gray-900">{participant.nutsCode}</div>
                                                    </div>
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
            </div>
        </div >
    );
}
export default ProjectDetails;