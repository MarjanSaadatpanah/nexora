import React from 'react';
import { Link } from 'react-router-dom';

const Cards = ({ isExpired, topic, acronym, id, eu_contribution, link }) => {

    return (
        <Link to={link}>
            <div className="relative flex flex-col my-3 bg-white shadow-sm border border-slate-200 rounded-lg">
                <div className="p-4">
                    {isExpired ? (
                        <div className="mb-4 rounded-lg bg-orange-500 py-0.5 px-2.5 border border-transparent text-xs text-white transition-all shadow-sm w-20 text-center">Expired</div>
                    ) : (
                        <div className="mb-4 rounded-lg bg-green-500 py-0.5 px-2.5 border border-transparent text-xs text-white transition-all shadow-sm w-20 text-center">On Going</div>
                    )}
                    <h6 className="mb-2 text-slate-800 text-base font-semibold">
                        EU Contribution: {eu_contribution?.toLocaleString('en-US', { style: 'currency', currency: 'EUR' })}
                    </h6>
                    <p className="text-slate-800 leading-normal font-light">
                        {topic}
                    </p>
                </div>

                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                        {/* <img
                            alt="Tania Andrew"
                            src="https://wallpapercave.com/wp/wp4071633.jpg"
                            className="relative inline-block h-8 w-8 rounded-full"
                        /> */}
                        <div className="flex flex-col text-sm">
                            <span className="text-slate-800 font-semibold">{acronym}</span>
                            <span className="text-slate-600">
                                {id}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default Cards
