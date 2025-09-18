import React from 'react'
import { VscRobot } from "react-icons/vsc";

const Project = ({ project }) => {

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
            <label className="inline-flex mb-1 items-center justify-between text-gray-900 w-full  peer-checked:border-green-400  peer-checked:text-green-400  ">
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
    return (
        <label className="inline-flex items-center pt-4 justify-between text-gray-900 w-full pb-5 ">
            <div class="block">
                <div className='flex'>
                    <div class="w-full">
                        <div>
                            <p class="text-3xl mb-2 pr-16">{project.title} </p>
                            <h4 className="text-base text-blue-700">{project.acronym}</h4>
                            <h4 className="text-base mt-6 text-blue-900">Statuse: {project.status}</h4>
                            <h4 className="text-base text-blue-900">Remaining Days: {project.remaining_days}</h4>
                        </div>

                        <ul className="grid gap-x-10 gap-y-2 grid-cols-2 mt-4">
                            <Li elem="Topics" value={project.topics} />
                            <Li elem="Signature Date" value={project.ecSignatureDate} />
                            <Li elem="Programme" value={project.frameworkProgramme} />
                            <Li elem="Start Date" value={project.startDate} />
                            <Li elem="Legal Basis" value={project.legalBasis} />
                            <Li elem="End Date" value={project.endDate} />

                        </ul>

                        <div className='my-9'>
                            <LabelBox elem="Total Cost" value={project.totalCost} />
                            <LabelBox elem="EU Contribution" value={project.ecMaxContribution + " €"} />
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
    )
}

export default Project
