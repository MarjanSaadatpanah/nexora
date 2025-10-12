
import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { getHistory, deleteAllHistory, deleteHistoryItem, addFavorite } from '../../services/userApi';
import { GetProjectById } from '../../services/api';
import HistoryIcon from '@mui/icons-material/History';
import { useTheme } from '../../contexts/ThemeContext';

import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { FaClock } from 'react-icons/fa';
import AlertComp from '../AlertComp';
import AlertDialog from '../AlertDialog';



const HistoryPage = () => {
    const { getToken, isSignedIn } = useAuth();
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const [historyProjects, setHistoryProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('recent'); // recent or oldest
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);

    const [alertInfo, setAlertInfo] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        if (!isSignedIn) {
            setLoading(false);
            return;
        }

        fetchHistory();
    }, [isSignedIn]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const historyData = await getHistory(getToken, 50);

            if (historyData.length === 0) {
                setHistoryProjects([]);
                setLoading(false);
                return;
            }

            // Fetch full project data for each history item
            const projectPromises = historyData.map(async (item) => {
                try {
                    const project = await GetProjectById(item.projectId);
                    return {
                        ...project,
                        openedAt: item.openedAt
                    };
                } catch (err) {
                    console.error(`Failed to fetch project ${item.projectId}:`, err);
                    return null;
                }
            });

            const projects = await Promise.all(projectPromises);
            setHistoryProjects(projects.filter(p => p !== null));
        } catch (err) {
            console.error('Failed to fetch history:', err);
        } finally {
            setLoading(false);
        }
    };

    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    };

    const handleDialogAlert = () => {
        setOpen(true);
    };

    const handleDeleteAll = async () => {
        // if (!window.confirm('Are you sure you want to delete all history?')) return;

        try {
            await deleteAllHistory(getToken);
            setHistoryProjects([]);
            handleClose()
            setAlertInfo({ open: true, message: 'All history deleted' });
        } catch (err) {
            console.error('Failed to delete history:', err);
            setAlertInfo({ open: true, message: 'Failed to delete history', severity: 'warning' });
        }
    };

    const handleDeleteItem = async (projectId) => {
        try {
            await deleteHistoryItem(getToken, projectId);
            setHistoryProjects(prev => prev.filter(p => p.id !== projectId));
            handleCloseMenu();
            setAlertInfo({ open: true, message: 'Removed from history' });
        } catch (err) {
            console.error('Failed to delete history item:', err);
            setAlertInfo({ open: true, message: 'Failed to remove from history', severity: 'warning' });
        }
    };

    const handleAddToFavorite = async (projectId) => {
        try {
            await addFavorite(getToken, projectId);
            handleCloseMenu();
            setAlertInfo({ open: true, message: 'Added to favorites' });
        } catch (err) {
            console.error('Failed to add to favorites:', err);
            setAlertInfo({ open: true, message: 'Failed to add to favorites', severity: 'warning' });
        }
    };

    const handleShare = (project) => {
        const url = `${window.location.origin}/project/${project.id}`;
        navigator.clipboard.writeText(url);
        handleCloseMenu();
        setAlertInfo({ open: true, message: 'Link copied to clipboard!' });
    };

    const handleOpenMenu = (event, project) => {
        setAnchorEl(event.currentTarget);
        setSelectedProject(project);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setSelectedProject(null);
    };

    const handleProjectClick = (projectId) => {
        navigate(`/project/${projectId}`);
    };

    // Filter and sort history
    const filteredHistory = historyProjects
        .filter(project => {
            if (!searchTerm) return true;
            const search = searchTerm.toLowerCase();
            return (
                project.title?.toLowerCase().includes(search) ||
                project.acronym?.toLowerCase().includes(search) ||
                project.id?.toLowerCase().includes(search)
            );
        })
        .sort((a, b) => {
            if (sortOrder === 'recent') {
                return new Date(b.openedAt) - new Date(a.openedAt);
            } else {
                return new Date(a.openedAt) - new Date(b.openedAt);
            }
        });

    if (!isSignedIn) {
        return (
            <div className='pt-32 min-h-screen'>
                <h1 className='text-3xl mb-2 dark:text-gray-200 text-gray-800'>
                    <HistoryIcon className='mr-3 mb-1' /> Project History
                </h1>
                <p className="max-w-2xl font-light text-gray-500 dark:text-gray-300">
                    Please sign in to view your project history
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className='pt-32 min-h-screen'>
                <h1 className='text-3xl mb-2 dark:text-gray-200 text-gray-800'>
                    <HistoryIcon className='mr-3 mb-1' /> Project History
                </h1>
                <p className="max-w-2xl font-light text-gray-500 dark:text-gray-300">
                    Loading your history...
                </p>
            </div>
        );
    }

    return (
        <div className='pt-32 min-h-screen px-4'>
            <AlertComp alertInfo={alertInfo} setAlertInfo={setAlertInfo} />
            <AlertDialog handleDeleteAll={handleDeleteAll} open={open} handleClose={handleClose} />
            <div className='mb-6'>
                <h1 className='text-3xl mb-2 dark:text-gray-200 text-gray-800'>
                    <HistoryIcon className='mr-3 mb-1' /> Project History
                </h1>
                <p className="max-w-2xl font-light text-gray-500 dark:text-gray-300 mb-4">
                    {historyProjects.length} project{historyProjects.length !== 1 ? 's' : ''} viewed
                </p>

                {/* Header Controls */}
                <div className='flex flex-wrap gap-4 items-center mb-4'>
                    <input
                        type="text"
                        placeholder="Search by title, acronym, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='flex-1 min-w-[250px] px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600'
                    />
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className='px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600'
                    >
                        <option value="recent">Most Recent</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                    <button
                        onClick={handleDialogAlert}
                        disabled={historyProjects.length === 0}
                        className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2'
                    >
                        <DeleteIcon fontSize='small' />
                        Delete All
                    </button>
                </div>
            </div>

            {/* Table */}
            {filteredHistory.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                    {searchTerm ? 'No projects match your search' : 'No history yet'}
                </p>
            ) : (
                <div className='overflow-x-auto'>
                    {filteredHistory.map((project) => (
                        <div className="flex justify-between items-start lg:px-6 py-10 border-b-2 border-gray-500" key={project.id}>
                            <div className="flex-1">
                                <span className="inline-flex items-center px-3 py-1 rounded mr-2 text-sm font-medium bg-blue-100 text-blue-800">
                                    {project.acronym}
                                </span>
                                <div className="flex justify-between">
                                    <h1 onClick={() => handleProjectClick(project.id)} className="text-xl w-8/10 text-gray-900 dark:text-gray-300 hover:text-blue-500 cursor-pointer mb-2">{project.title}</h1>
                                    <IconButton onClick={(e) => handleOpenMenu(e, project)} size='small'>
                                        <MoreVertIcon className='dark:text-white' />
                                    </IconButton>
                                </div>
                                <div className="flex justify-between mt-7">
                                    <div className="inline-flex items-center px-3 py-1 rounded mr-2 text-xs font-medium bg-green-100 text-green-800">
                                        <FaClock className="mr-1" />
                                        <span className='mr-2'>Viewed At: </span>
                                        {new Date(project.openedAt).toLocaleString()}
                                    </div>

                                    <span className="text-gray-800 dark:text-gray-300 inline-flex items-center px-3 py-1 rounded-full text-sm">
                                        ID: {project.id}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            )}

            {/* Actions Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                slotProps={{
                    paper: {
                        style: {
                            backgroundColor: isDark ? "#263238" : "white"
                        }
                    }
                }}
            >
                <MenuItem onClick={() => handleDeleteItem(selectedProject?.id)}>
                    <DeleteIcon className='mr-2' fontSize='small' />
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>Delete</span>
                </MenuItem>
                <MenuItem onClick={() => handleAddToFavorite(selectedProject?.id)}>
                    <FavoriteIcon className='mr-2' fontSize='small' />
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>Add to Favorites</span>
                </MenuItem>
                <MenuItem onClick={() => handleShare(selectedProject)}>
                    <ShareIcon className='mr-2' fontSize='small' />
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>Share</span>
                </MenuItem>
                <MenuItem onClick={handleCloseMenu}>
                    <FileDownloadIcon className='mr-2' fontSize='small' />
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>Export (Coming Soon)</span>
                </MenuItem>
            </Menu>
        </div>
    );
};

export default HistoryPage;