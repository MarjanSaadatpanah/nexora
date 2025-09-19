
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoFilter } from "react-icons/io5";

import Filter from './Filter';
import { SearchProjects } from '../services/api';
import { SearchContext } from '../contexts/SearchContext';
import { ClockLoader } from 'react-spinners';

import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const SearchAndFilter = () => {
    const { searchTerm, setSearchTerm, projectList, setProjectList, setSearchActive, filters, setFilters, isLoading, setIsLoading } = useContext(SearchContext);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const location = useLocation();
    const isHomePage = location.pathname === '/';

    const [filterVisible, setFilterVisible] = useState(false);

    const debounceRef = useRef(null);

    const navigate = useNavigate();

    // --- FETCH PROJECTS ---
    const fetchProjects = async (query, pageNumber = 1, append = false) => {
        if (append) setLoadingMore(true);
        else setIsLoading(true);

        try {
            const response = await SearchProjects(query, pageNumber, 10, filters); // pass filters
            setProjectList(prev =>
                append ? [...prev, ...response.projects] : response.projects
            );
            setHasMore(pageNumber < response.pages);
            setPage(pageNumber);
        } catch (error) {
            console.error('Search error:', error);
            setProjectList([]);
        } finally {
            if (append) setLoadingMore(false);
            else setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!searchTerm.trim()) {
            if (debounceRef.current) clearTimeout(debounceRef.current);
            setProjectList([]);
            setHasMore(false);
            setSearchActive(false);
            return;
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            fetchProjects(searchTerm, 1, false);
            setSearchActive(true);
        }, 300);

        return () => clearTimeout(debounceRef.current);
    }, [searchTerm, filters]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        navigate('/')
    };

    const handleApplyFilters = (newFilters) => {
        setFilters(newFilters);
        setFilterVisible(false);
    };

    const handleLoadMore = () => {
        fetchProjects(searchTerm, page + 1, true);
    };

    return (
        <>
            <div className="flex items-center mx-auto md:w-full">
                <div className="relative w-full">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        {isLoading && (
                            <ClockLoader className="w-4 h-4 text-gray-500" color="gray" size="30" />
                        )}
                    </div>
                    <input
                        onChange={handleSearchChange}
                        value={searchTerm}
                        type="text"
                        placeholder="Search Projects, Acronyms, Organizations..."
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 ml-1"
                    />
                </div>

                <button
                    onClick={() => setFilterVisible(true)}
                    className="inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium bg-gray-50 border border-gray-300 text-gray-900 rounded-lg hover:bg-blue-500"
                >
                    <IoFilter className="w-4 h-4 me-2" />
                    Filter
                </button>
            </div>

            {/* Filter Box */}
            <Filter
                setFilterVisible={setFilterVisible}
                filterVisible={filterVisible}
                onApply={handleApplyFilters}
                currentFilters={filters}
            />

            {/* Active Filter Summary */}
            {Object.entries(filters)
                .filter(([_, value]) => value !== undefined && value !== null && value !== "")
                .length > 0 && (
                    <div className="flex flex-wrap gap-2 m-2">
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

            {/* Search Results */}
            {isHomePage && (
                <ul>
                    {projectList.map((proj) => (
                        <li key={proj.id} className='my-4 ml-1 shadow-lg'>
                            <Link
                                to={`/project/${proj.id}`}
                                state={{ project: proj }}
                            >
                                <Card variant="outlined">
                                    <Box sx={{ p: 2 }}>
                                        <Stack
                                            direction="row"
                                            sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                                        >
                                            <Typography gutterBottom variant="h5" component="div">
                                                {proj.acronym}
                                                {proj.status === "SIGNED" ? (
                                                    <span className='text-base ml-5 text-green-500'>{proj.status}</span>
                                                ) : proj.status === "CLOSED" ? (
                                                    <span className='text-base ml-5 text-red-500'>{proj.status}</span>
                                                ) : (
                                                    <span className='text-base ml-5 text-gray-500'>{proj.status}</span>
                                                )}
                                            </Typography>
                                            <Typography gutterBottom variant="body2" component="div">
                                                ID: {proj.id}
                                            </Typography>
                                        </Stack>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            {proj.title}
                                        </Typography>
                                    </Box>
                                    <Divider />
                                    {proj.keywords && (
                                        <Box sx={{ p: 1 }}>
                                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                                {proj.keywords?.split(", ").map((keyw, index) => (
                                                    <Chip key={index} color="primary" label={keyw} size="small" sx={{ fontSize: '0.6rem' }} />
                                                ))}
                                            </Stack>
                                        </Box>
                                    )}
                                </Card>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}

            {/* Pagination / Load More */}
            {hasMore && (
                <div className="flex justify-center my-4">
                    <Button
                        variant="contained"
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                    >
                        {loadingMore ? "Loading..." : "Load More"}
                    </Button>
                </div>
            )}
        </>
    );
};

export default SearchAndFilter;
