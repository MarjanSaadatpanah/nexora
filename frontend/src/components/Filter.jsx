
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { getName, getCodes } from "country-list";
import Select from "react-select";
import ContributionSlider from './filter/ContributionSlider';
import { IoMdClose } from "react-icons/io";

const EU_COUNTRIES = [
    'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
    'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
    'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
];

const Filter = ({ setFilterVisible, filterVisible, onApply, currentFilters }) => {
    const [filters, setFilters] = useState({
        programme: "",
        status: "",
        startDate: "",
        endDate: "",
        selectedCountries: [],
        minContribution: 0,
        maxContribution: 0,
        minTotalCost: 0,
        maxTotalCost: 0,
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
                maxContribution: currentFilters.max_contribution || 1000000000,
                minTotalCost: currentFilters.min_total_cost || 0,
                maxTotalCost: currentFilters.max_total_cost || 1000000000,
            });
        }
    }, [currentFilters, filterVisible]);

    // Create country options with EU Countries as first option
    const countryOptions = [
        {
            value: 'EU_COUNTRIES',
            label: '🇪🇺 EU Countries',
            isEUOption: true
        },
        ...getCodes().map(code => ({
            value: code,
            label: getName(code),
            isEUOption: false
        }))
    ];

    const selectedOptions = countryOptions.filter(opt => {
        if (opt.value === 'EU_COUNTRIES') {
            // Show EU Countries option if all EU countries are selected
            return EU_COUNTRIES.every(euCountry => filters.selectedCountries.includes(euCountry));
        }
        // For individual countries, only show them if EU Countries option is not being displayed
        // OR if there are additional non-EU countries selected
        const allEUSelected = EU_COUNTRIES.every(euCountry => filters.selectedCountries.includes(euCountry));
        const hasNonEUCountries = filters.selectedCountries.some(country => !EU_COUNTRIES.includes(country));

        if (allEUSelected && !hasNonEUCountries) {
            // If only EU countries are selected, don't show individual EU countries
            return false;
        }

        return filters.selectedCountries.includes(opt.value);
    });

    const handleCountryChange = (selected) => {
        if (!selected) {
            setFilters({
                ...filters,
                selectedCountries: []
            });
            return;
        }

        let newCountries = [];

        selected.forEach(option => {
            if (option.value === 'EU_COUNTRIES') {
                // Add all EU countries
                newCountries = [...new Set([...newCountries, ...EU_COUNTRIES])];
            } else if (!option.isEUOption) {
                // Add individual country
                newCountries = [...new Set([...newCountries, option.value])];
            }
        });

        setFilters({
            ...filters,
            selectedCountries: newCountries
        });
    };

    const handleContributionChange = ({ min_contribution, max_contribution }) => {
        setFilters(prev => ({
            ...prev,
            minContribution: min_contribution,
            maxContribution: max_contribution
        }));
    };

    const handleTotalCostChange = ({ min_total_cost, max_total_cost }) => {
        setFilters(prev => ({
            ...prev,
            minTotalCost: min_total_cost,
            maxTotalCost: max_total_cost
        }));
    };

    const handleFiltering = () => {
        onApply({
            programme: filters.programme,
            status: filters.status,
            min_contribution: filters.minContribution,
            max_contribution: filters.maxContribution,
            min_total_cost: filters.minTotalCost,
            max_total_cost: filters.maxTotalCost,
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
            maxContribution: 1000000000,
            minTotalCost: 0,
            maxTotalCost: 1000000000,
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
                                onChange={handleCountryChange}
                                placeholder="Select countries..."
                                className="react-select-container"
                                classNamePrefix="react-select"
                                components={{}}
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        minHeight: '42px',
                                        borderColor: '#d1d5db',
                                        '&:hover': {
                                            borderColor: '#3b82f6'
                                        }
                                    }),
                                    menu: (base) => ({
                                        ...base,
                                        zIndex: 9999
                                    }),
                                    option: (base, { data }) => ({
                                        ...base,
                                        backgroundColor: data.isEUOption ? '#eff6ff' : base.backgroundColor,
                                        fontWeight: data.isEUOption ? 'bold' : base.fontWeight,
                                        borderBottom: data.isEUOption ? '1px solid #e5e7eb' : 'none',
                                        '&:hover': {
                                            backgroundColor: data.isEUOption ? '#dbeafe' : '#f3f4f6'
                                        }
                                    })
                                }}
                            />
                        </div>

                        {/* EU Contribution Range  */}
                        <div className="mb-4">
                            <ContributionSlider
                                title="EU Contribution Range"
                                min={0}
                                max={1000000000}
                                value={[filters.minContribution, filters.maxContribution]}
                                onChange={handleContributionChange}
                                type="contribution"
                            />
                        </div>

                        {/* Total cost Range  */}
                        <div className="mb-4">
                            <ContributionSlider
                                title="Total Cost Range"
                                min={0}
                                max={1000000000}
                                value={[filters.minTotalCost, filters.maxTotalCost]}
                                onChange={handleTotalCostChange}
                                type="total_cost"
                            />
                        </div>

                        {/* Date Range */}
                        <div className="mb-4">
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
        </div>
    );
};

export default Filter;