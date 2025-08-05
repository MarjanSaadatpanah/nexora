import React, { createContext, useState } from "react";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [searchActive, setSearchActive] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [projectList, setProjectList] = useState([]);
    const [filters, setFilters] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    return (
        <SearchContext.Provider
            value={{
                searchActive,
                setSearchActive,
                searchTerm,
                setSearchTerm,
                projectList,
                setProjectList,
                filters,
                setFilters,
                isLoading,
                setIsLoading
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};
