import { useState } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { getName, getCodes } from "country-list";
import Select from "react-select";
import ContributionSlider from './filter/ContributionSlider';
import { IoMdClose } from "react-icons/io";


const Filter = ({ setFilterVisible, filterVisible, onApply, currentFilters }) => {

    const initialCountries = currentFilters?.countries
        ? currentFilters.countries.split(",")
        : [];

    const [programme, setProgramme] = useState(currentFilters?.programme || "");
    const [status, setStatus] = useState(currentFilters?.status || "");
    const [startDate, setStartDate] = useState(currentFilters?.start_date || "");
    const [endDate, setEndDate] = useState(currentFilters?.end_date || "");
    const [selectedCountries, setSelectedCountries] = useState(initialCountries);

    const [minContribution, setMinContribution] = useState(
        currentFilters?.min_contribution || 0
    );
    const [maxContribution, setMaxContribution] = useState(
        currentFilters?.max_contribution || 1000000000
    );

    const countryOptions = getCodes().map(code => ({
        value: code,
        label: getName(code)
    }));
    const selectedOptions = countryOptions.filter(opt => selectedCountries.includes(opt.value));

    const handleContributionChange = ({ min_contribution, max_contribution }) => {
        setMinContribution(min_contribution);
        setMaxContribution(max_contribution);
    };

    const handleFiltering = () => {
        onApply({
            ...currentFilters,
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
                        className="bg-white px-11 p-5 fixed border-l-1 border-black top-0 right-0 lg:w-3/12 w-full h-screen m-auto z-[9999]"
                        key="box"
                    >
                        <div className='flex justify-between  mb-11'>
                            <label className="hidden sm:block text-lg font-medium">Filter By</label>
                            <button
                                className="cursor-pointer"
                                onClick={() => setFilterVisible(false)}
                            >
                                <IoMdClose />
                            </button>
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
                                <option value="CLOSED">CLOSED</option>
                                <option value="SIGNED">SIGNED</option>
                                <option value="TERMINATED">TERMINATED</option>
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
                                className='border rounded'
                            />
                        </div>

                        {/* EU Contribution Range */}
                        <ContributionSlider min={0}
                            max={1000000000}
                            value={[Number(minContribution), Number(maxContribution)]}
                            onChange={handleContributionChange}
                        />

                        {/* Date Range */}
                        <div className="mb-6 gap-2">
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
                        <div className="mt-12">
                            <button
                                className="py-2 px-4 bg-green-500 text-white rounded w-full mt-2 cursor-pointer"
                                onClick={handleFiltering}
                            >
                                Apply
                            </button>
                            <button
                                className="py-2 px-4 bg-gray-500 text-white rounded w-full mt-2 cursor-pointer"
                                onClick={handleResetFiltering}
                            >
                                Reset
                            </button>
                            <button
                                className="py-2 px-4 bg-red-500 text-white rounded w-full mt-2 cursor-pointer"
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
