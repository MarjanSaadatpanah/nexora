import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Test = () => {
    const [activeTab, setActiveTab] = useState("tab1");

    return (

        <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Tab headers */}
            <div className="flex border-b border-gray-200">
                <button
                    className={`flex-1 py-4 px-6 text-center font-medium transition-colors duration-300 ${activeTab === "tab1"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                    onClick={() => setActiveTab("tab1")}
                >
                    Project Overview
                </button>
                <button
                    className={`flex-1 py-4 px-6 text-center font-medium transition-colors duration-300 ${activeTab === "tab2"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                    onClick={() => setActiveTab("tab2")}
                >
                    Financial Details
                </button>
            </div>

            {/* Tab content */}
            <div className="p-6 h-96 overflow-hidden relative">
                <AnimatePresence mode="wait">
                    {activeTab === "tab1" && (
                        <motion.div
                            key="tab1"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 p-6"
                        >
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">Project Overview</h3>
                            <p className="text-gray-600 mb-4">
                                This project focuses on developing innovative solutions for sustainable energy
                                management across European communities.
                            </p>
                            <div className="bg-blue-50 p-4 rounded-lg mb-4">
                                <h4 className="font-medium text-blue-800 mb-2">Key Objectives</h4>
                                <ul className="list-disc list-inside text-gray-700 space-y-1">
                                    <li>Reduce carbon emissions by 25% in target communities</li>
                                    <li>Implement smart grid technology in 5 pilot cities</li>
                                    <li>Develop new standards for renewable energy integration</li>
                                </ul>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                <span>Project Duration: 36 months</span>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "tab2" && (
                        <motion.div
                            key="tab2"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 p-6"
                        >
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">Financial Details</h3>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <p className="text-sm text-green-600 mb-1">Total Budget</p>
                                    <p className="text-2xl font-bold text-green-700">€4,850,000</p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <p className="text-sm text-purple-600 mb-1">EU Contribution</p>
                                    <p className="text-2xl font-bold text-purple-700">€3,720,000</p>
                                </div>
                            </div>
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-700 mb-3">Funding Distribution</h4>
                                <div className="space-y-2">
                                    <div>
                                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                                            <span>Personnel Costs</span>
                                            <span>42%</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full">
                                            <div className="h-2 bg-blue-500 rounded-full" style={{ width: "42%" }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                                            <span>Equipment</span>
                                            <span>28%</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full">
                                            <div className="h-2 bg-green-500 rounded-full" style={{ width: "28%" }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                                            <span>Travel & Conferences</span>
                                            <span>15%</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full">
                                            <div className="h-2 bg-purple-500 rounded-full" style={{ width: "15%" }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-sm text-gray-500">
                                <span className="font-medium">Next payment scheduled:</span> September 30, 2023
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>

    );
};

export default Test;