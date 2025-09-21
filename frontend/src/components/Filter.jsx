import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { getName, getCodes } from "country-list";
import Select from "react-select";
import ContributionSlider from './filter/ContributionSlider';
import { IoMdClose } from "react-icons/io";

const Filter = ({ setFilterVisible, filterVisible, onApply, currentFilters }) => {
    const [filters, setFilters] = useState({
        programme: "",
        status: "",
        startDate: "",
        endDate: "",
        selectedCountries: [],
        minContribution: 0,
        maxContribution: 0
    });

    // Initialize with current filters or defaults
    useEffect(() => {
        if (currentFilters) {
            setFilters({
                programme: currentFilters.programme || "",
                status: currentFilters.status || "",
                startDate: currentFilters.start_date || "",
                endDate: currentFilters.end_date || "",
                selectedCountries: currentFilters.countries
                    ? currentFilters.countries.split(",")
                    : [],
                minContribution: currentFilters.min_contribution || 0,
                maxContribution: currentFilters.max_contribution || 1000000000
            });
        }
    }, [currentFilters, filterVisible]);

    const countryOptions = getCodes().map(code => ({
        value: code,
        label: getName(code)
    }));

    const selectedOptions = countryOptions.filter(opt =>
        filters.selectedCountries.includes(opt.value)
    );

    const handleContributionChange = ({ min_contribution, max_contribution }) => {
        setFilters(prev => ({
            ...prev,
            minContribution: min_contribution,
            maxContribution: max_contribution
        }));
    };

    const handleFiltering = () => {
        onApply({
            programme: filters.programme,
            status: filters.status,
            min_contribution: filters.minContribution,
            max_contribution: filters.maxContribution,
            start_date: filters.startDate,
            end_date: filters.endDate,
            countries: filters.selectedCountries.join(",")
        });
    };

    const handleResetFiltering = () => {
        setFilters({
            programme: "",
            status: "",
            startDate: "",
            endDate: "",
            selectedCountries: [],
            minContribution: 0,
            maxContribution: 1000000000
        });
        onApply({});
    };

    return (
        <div>
            <AnimatePresence initial={false}>
                {filterVisible && (
                    <motion.div
                        initial={{ opacity: 0, x: 300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 300 }}
                        transition={{ type: "spring", damping: 25 }}
                        className="bg-white px-5 py-5 fixed border-l border-gray-200 top-0 right-0 lg:w-[420px] w-full h-screen m-auto z-50 overflow-y-auto shadow-xl"
                        key="box"
                    >
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className="text-xl font-semibold text-gray-800"></h2>
                            <button
                                className="text-gray-500 hover:text-gray-700  rounded-full hover:bg-gray-100"
                                onClick={() => setFilterVisible(false)}
                            >
                                <IoMdClose size={20} />
                            </button>
                        </div>

                        {/* Status */}
                        <div className="mb-4">
                            <label className="block text-xs text-gray-500 mb-1">Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Statuses</option>
                                <option value="CLOSED">CLOSED</option>
                                <option value="SIGNED">SIGNED</option>
                                <option value="TERMINATED">TERMINATED</option>

                            </select>
                        </div>

                        {/* Countries */}
                        <div className="mb-4">
                            <label className="block text-xs text-gray-500 mb-1">Countries</label>
                            <Select
                                isMulti
                                options={countryOptions}
                                value={selectedOptions}
                                onChange={(selected) => setFilters({
                                    ...filters,
                                    selectedCountries: selected ? selected.map(s => s.value) : []
                                })}
                                placeholder="Select countries..."
                                className="react-select-container"
                                classNamePrefix="react-select"
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        minHeight: '42px',
                                        borderColor: '#d1d5db',
                                        '&:hover': {
                                            borderColor: '#3b82f6'
                                        }
                                    })
                                }}
                            />
                        </div>

                        {/* EU Contribution Range */}
                        <div className="mb-4">
                            <ContributionSlider
                                min={0}
                                max={1000000000}
                                value={[filters.minContribution, filters.maxContribution]}
                                onChange={handleContributionChange}
                            />
                        </div>

                        {/* Date Range */}
                        <div className="mb-4">
                            {/* <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label> */}
                            <div className="space-y-2">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        value={filters.startDate}
                                        onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        value={filters.endDate}
                                        onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="mt-8 space-y-2">
                            <button
                                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                                onClick={handleFiltering}
                            >
                                Apply Filters
                            </button>
                            <button
                                className="w-full py-2.5 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-md transition-colors"
                                onClick={handleResetFiltering}
                            >
                                Reset Filters
                            </button>
                            <button
                                className="w-full py-2.5 border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium rounded-md transition-colors"
                                onClick={() => setFilterVisible(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Backdrop */}
            {/* {filterVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setFilterVisible(false)}
                />
            )} */}
        </div>
    );
};

export default Filter;