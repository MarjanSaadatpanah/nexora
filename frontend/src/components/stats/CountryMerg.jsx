import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EUContributionPerCountry from "./EUContributionPerCountry";
import EUCountriesPerProject from "./EUCountriesPerProject";

const Test = () => {
    const [activeTab, setActiveTab] = useState("tab1");

    return (

        <div className="w-full max-w-6xl bg-white rounded-xl shadow overflow-hidden mt-32">
            {/* Tab headers */}
            <div className="flex border-b border-gray-200">
                <button
                    className={`flex-1 py-4 px-6 text-center font-medium transition-colors duration-300 ${activeTab === "tab1"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                    onClick={() => setActiveTab("tab1")}
                >
                    EU Contribution per Country

                </button>
                <button
                    className={`flex-1 py-4 px-6 text-center font-medium transition-colors duration-300 ${activeTab === "tab2"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                    onClick={() => setActiveTab("tab2")}
                >
                    Projects per Country
                </button>
            </div>

            {/* Tab content */}
            <div className="h-[500px] overflow-hidden relative">
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
                            <EUContributionPerCountry />

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
                            <EUCountriesPerProject />

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>

    );
};

export default Test;