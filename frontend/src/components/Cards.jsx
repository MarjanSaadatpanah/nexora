import React from 'react';
import { Link } from 'react-router-dom';

const Cards = ({ status, title, acronym, id, eu_contribution, link, project }) => {

    return (
        <Link to={link} state={{ project }} >
            <div className="relative flex flex-col my-3 hover:my-2 bg-white dark:bg-gray-900 shadow-sm border border-slate-200 hover:border-slate-400 rounded-lg">
                {status === "SIGNED" ? (
                    <div className='text-xs mb-2 rounded-tl-lg rounded-br-lg shadow text-white w-20 text-center py-1 bg-green-500'>{status}</div>
                ) : status === "CLOSED" ? (
                    <div className='text-xs mb-2 rounded-tl-lg rounded-br-lg shadow text-white w-20 text-center py-1 bg-red-500'>{status}</div>
                ) : (
                    <div className='text-xs mb-2 rounded-tl-lg rounded-br-lg shadow text-white w-20 text-center py-1 bg-gray-500'>{status}</div>
                )}
                <div className="p-4">




                    <span className="text-slate-800 dark:text-slate-200 font-semibold">{acronym}</span>

                    <p className="text-slate-800 dark:text-slate-200 leading-normal font-light line-clamp-4 h-24">
                        {title}
                    </p>
                </div>

                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                        <div className="flex flex-col text-sm">
                            <div className="mb-2 text-slate-800 dark:text-slate-200 text-base">
                                EU Contribution: <span className='text-slate-800 dark:text-slate-200 font-semibold'>{eu_contribution?.toLocaleString('en-US', { style: 'currency', currency: 'EUR' })}</span>
                            </div>
                            <span className="text-slate-600 dark:text-slate-100">
                                ID:  {id}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default Cards

