import React from 'react'
import { BiSolidCategory } from "react-icons/bi";
import { Link } from 'react-router-dom';


const SimilarProjects = () => {
    return (
        <div className='mt-16'>
            <div className='flex text-3xl mb-2'>
                <BiSolidCategory className='mr-3' />
                <h1> Similar Projects:</h1>
            </div>
            <p className="max-w-2xl mb-2 font-light text-gray-500 dark:text-gray-300 lg:mb-8 md:text-lg lg:text-xl 400">
                Similar Projects in terms of topics and keywords
            </p>
            <div className="grid gap-x-8 gap-y-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

                <Link to='/'>
                    <div className="relative flex flex-col my-3 hover:my-2 bg-white shadow-sm border border-slate-200 hover:border-slate-400 rounded-lg">
                        <div className='text-xs mb-2 rounded-tl rounded-br-lg shadow text-white w-20 text-center py-1 bg-green-500'>SIGNED</div>
                        <div className="p-4">
                            <span className="text-slate-800 font-semibold">Acronym 1</span>
                            <p className="text-slate-800 leading-normal font-light line-clamp-4 h-24">
                                Title 1
                            </p>
                        </div>
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center">
                                <div className="flex flex-col text-sm">
                                    <div className="mb-2 text-slate-800 text-base">
                                        EU Contribution: <span className='text-slate-800 font-semibold'>88888888</span>
                                    </div>
                                    <span className="text-slate-600">
                                        ID:  8888888
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
                <Link to='/'>
                    <div className="relative flex flex-col my-3 hover:my-2 bg-white shadow-sm border border-slate-200 hover:border-slate-400 rounded-lg">
                        <div className='text-xs mb-2 rounded-tl rounded-br-lg shadow text-white w-20 text-center py-1 bg-green-500'>SIGNED</div>
                        <div className="p-4">
                            <span className="text-slate-800 font-semibold">Acronym 2</span>
                            <p className="text-slate-800 leading-normal font-light line-clamp-4 h-24">
                                Title 2
                            </p>
                        </div>
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center">
                                <div className="flex flex-col text-sm">
                                    <div className="mb-2 text-slate-800 text-base">
                                        EU Contribution: <span className='text-slate-800 font-semibold'>88888888</span>
                                    </div>
                                    <span className="text-slate-600">
                                        ID:  8888888
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
                <Link to='/'>
                    <div className="relative flex flex-col my-3 hover:my-2 bg-white shadow-sm border border-slate-200 hover:border-slate-400 rounded-lg">
                        <div className='text-xs mb-2 rounded-tl rounded-br-lg shadow text-white w-20 text-center py-1 bg-green-500'>SIGNED</div>
                        <div className="p-4">
                            <span className="text-slate-800 font-semibold">Acronym 3</span>
                            <p className="text-slate-800 leading-normal font-light line-clamp-4 h-24">
                                Title 3
                            </p>
                        </div>
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center">
                                <div className="flex flex-col text-sm">
                                    <div className="mb-2 text-slate-800 text-base">
                                        EU Contribution: <span className='text-slate-800 font-semibold'>88888888</span>
                                    </div>
                                    <span className="text-slate-600">
                                        ID:  8888888
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>

            </div>

        </div>
    )
}

export default SimilarProjects
