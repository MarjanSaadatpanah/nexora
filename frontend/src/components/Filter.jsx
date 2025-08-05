import React, { useState } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { getName, getCodes } from "country-list";
import Select from "react-select";

const Filter = ({ setFilterVisible, filterVisible, onApply, currentFilters }) => {
    // Initialize countries from currentFilters (ISO codes as comma string)
    const initialCountries = currentFilters?.countries
        ? currentFilters.countries.split(",")
        : [];

    const [programme, setProgramme] = useState(currentFilters?.programme || "");
    const [status, setStatus] = useState(currentFilters?.status || "");
    const [minContribution, setMinContribution] = useState(currentFilters?.min_contribution || "");
    const [maxContribution, setMaxContribution] = useState(currentFilters?.max_contribution || "");
    const [startDate, setStartDate] = useState(currentFilters?.start_date || "");
    const [endDate, setEndDate] = useState(currentFilters?.end_date || "");
    const [selectedCountries, setSelectedCountries] = useState(initialCountries);

    // Build options: array of { value: ISO_code, label: country_name }
    const countryOptions = getCodes().map(code => ({
        value: code,
        label: getName(code)
    }));

    // Map selected ISO codes to react-select option objects for controlled value
    const selectedOptions = countryOptions.filter(opt => selectedCountries.includes(opt.value));

    const handleFiltering = () => {
        onApply({
            programme,
            status,
            min_contribution: minContribution,
            max_contribution: maxContribution,
            start_date: startDate,
            end_date: endDate,
            countries: selectedCountries.join(",")
        });
    };

    const handleResetFiltering = () => {
        setProgramme("");
        setStatus("");
        setMinContribution("");
        setMaxContribution("");
        setStartDate("");
        setEndDate("");
        setSelectedCountries([]);
        onApply({});
    };

    return (
        <div>
            <AnimatePresence initial={false}>
                {filterVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="bg-blue-100 my-4 p-5 absolute top-15 right-56 w-6/12 m-auto z-[9999]"
                        key="box"
                    >
                        {/* Programme */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Programme</label>
                            <input
                                type="text"
                                value={programme}
                                onChange={(e) => setProgramme(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        {/* Status */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full p-2 border rounded"
                            >
                                <option value="">All</option>
                                <option value="ongoing">Ongoing</option>
                                <option value="expired">Expired</option>
                            </select>
                        </div>

                        {/* Countries */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Country</label>
                            <Select
                                isMulti
                                options={countryOptions}
                                value={selectedOptions}
                                onChange={(selected) => setSelectedCountries(selected ? selected.map(s => s.value) : [])}
                                placeholder="Search and select countries..."
                            />
                        </div>

                        {/* EU Contribution Range */}
                        <div className="mb-4 flex gap-2">
                            <div className="flex-1">
                                <label className="block text-sm font-medium">Min Contribution (€)</label>
                                <input
                                    type="number"
                                    value={minContribution}
                                    onChange={(e) => setMinContribution(e.target.value)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium">Max Contribution (€)</label>
                                <input
                                    type="number"
                                    value={maxContribution}
                                    onChange={(e) => setMaxContribution(e.target.value)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        </div>

                        {/* Date Range */}
                        <div className="mb-4 flex gap-2">
                            <div className="flex-1">
                                <label className="block text-sm font-medium">Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium">End Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-2 mt-9">
                            <motion.button
                                className="py-2 px-4 bg-green-500 text-white rounded"
                                onClick={handleFiltering}
                                whileTap={{ y: 1 }}
                            >
                                Apply
                            </motion.button>
                            <motion.button
                                className="py-2 px-4 bg-gray-500 text-white rounded"
                                onClick={handleResetFiltering}
                                whileTap={{ y: 1 }}
                            >
                                Reset
                            </motion.button>
                            <motion.button
                                className="py-2 px-4 bg-red-500 text-white rounded"
                                onClick={() => setFilterVisible(false)}
                                whileTap={{ y: 1 }}
                            >
                                Cancel
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Filter;
