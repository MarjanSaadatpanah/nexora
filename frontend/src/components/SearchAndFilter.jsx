import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoFilter } from "react-icons/io5";
import Filter from './Filter';
import { SearchProjects } from '../services/api';
import { SearchContext } from '../contexts/SearchContext';
import { ClockLoader } from 'react-spinners';
// import ProjectDetails from '../pages/ProjectDetails';

const SearchAndFilter = () => {
    const { searchTerm, setSearchTerm, projectList, setProjectList, setSearchActive, filters, setFilters, isLoading, setIsLoading } = useContext(SearchContext);

    // const [page, setPage] = useState(1);
    // const [hasMore, setHasMore] = useState(false);

    const location = useLocation();
    const isHomePage = location.pathname === '/';

    const [filterVisible, setFilterVisible] = useState(false);

    const debounceRef = useRef(null);

    const navigate = useNavigate();

    // --- FETCH PROJECTS ---
    const fetchProjects = async (query, pageNumber = 1, append = false) => {
        setIsLoading(true);
        console.log('🚀 Fetching projects with query:', query, 'page:', pageNumber, 'filters:', filters);
        try {
            const response = await SearchProjects(query, pageNumber, 10, filters); // pass filters
            setProjectList(prev =>
                append ? [...prev, ...response.projects] : response.projects
            );
            // setHasMore(pageNumber < response.pages);
            // setPage(pageNumber);
        } catch (error) {
            console.error('Search error:', error);
            setProjectList([]);
        } finally {
            setIsLoading(false);
        }
    };

    // --- SEARCH EFFECT (Debounce) ---
    useEffect(() => {
        if (!searchTerm.trim()) {
            if (debounceRef.current) clearTimeout(debounceRef.current);
            setProjectList([]);
            // setHasMore(false);
            setSearchActive(false);
            return;
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            fetchProjects(searchTerm, 1, false);
            setSearchActive(true);
        }, 300);

        return () => clearTimeout(debounceRef.current);
    }, [searchTerm, filters]); // NEW: re-run when filters change

    // --- HANDLERS ---
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        navigate('/')
    };



    // const handleLoadMore = () => {
    //     fetchProjects(searchTerm, page + 1, true);
    // };

    const handleApplyFilters = (newFilters) => {
        setFilters(newFilters); // update filters
        setFilterVisible(false);
    };

    console.log("Search input value:", searchTerm);


    return (
        <>
            {/* Search Input */}
            <div className="flex items-center mx-auto md:w-full">

                {/* <input
                    
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
                /> */}

                <div class="relative w-full">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        {/* Loading Spinner */}
                        {isLoading && (
                            <ClockLoader class="w-4 h-4 text-gray-500" color="gray" size="30" />
                        )}
                    </div>
                    <input
                        onChange={handleSearchChange}
                        value={searchTerm}
                        type="text"
                        placeholder="Search Projects, Acronyms, Organizations..."
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 ml-2" />
                </div>



                <button
                    onClick={() => setFilterVisible(true)}
                    className="inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium bg-gray-50 border border-gray-300 text-gray-900 rounded hover:bg-blue-500"
                >
                    <IoFilter className="w-4 h-4 me-2" />
                    Filter
                </button>
            </div>

            {/* Filter Box */}
            <Filter
                setFilterVisible={setFilterVisible}
                filterVisible={filterVisible}
                onApply={handleApplyFilters} // NEW: pass callback to Filter
                currentFilters={filters} // optionally pass current filters
            />

            {/* Active Filter Summary */}
            {Object.entries(filters)
                .filter(([_, value]) => value !== undefined && value !== null && value !== "") // show only active filters
                .length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {Object.entries(filters)
                            .filter(([_, value]) => value !== undefined && value !== null && value !== "")
                            .map(([key, value]) => (
                                <span
                                    key={key}
                                    className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded border border-blue-200 flex items-center gap-1"
                                >
                                    {key}: {value}
                                    <button
                                        onClick={() => setFilters(prev => {
                                            const newFilters = { ...prev };
                                            delete newFilters[key];
                                            return newFilters;
                                        })}
                                        className="text-red-500 font-bold text-xs"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        <button
                            onClick={() => setFilters({})}
                            className="text-red-500 text-xs underline"
                        >
                            Clear All
                        </button>
                    </div>
                )}


            {/* content to show as result */}
            {/* <div className='flex'> */}
            {/* Search Results */}
            {isHomePage && (
                <ul>
                    {projectList.map((proj) => (
                        <li key={proj.id} >
                            <Link
                                to={`/project/${proj.id}`}
                                state={{ project: proj }}
                            >
                                <div className="relative flex flex-col my-3 bg-blue-200 shadow-sm border border-slate-200 rounded-lg">
                                    <div className="p-4">
                                        <h6 className="mb-2 text-slate-800 text-base font-semibold">
                                            {proj.topic}
                                        </h6>
                                        <p className="text-slate-800 leading-normal font-light">
                                            {proj.acronym}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between p-4">
                                        <div className="flex items-center">
                                            <div className="flex flex-col text-sm">
                                                <span className="text-slate-800 font-semibold">
                                                    EU Contribution: {proj.eu_contribution?.toLocaleString('en-US', { style: 'currency', currency: 'EUR' })}
                                                </span>
                                                <span className="text-slate-600">{proj.id}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}

            {/* <div>
                    <ProjectDetails />
                </div>
            </div> */}
        </>
    );
};

export default SearchAndFilter;
