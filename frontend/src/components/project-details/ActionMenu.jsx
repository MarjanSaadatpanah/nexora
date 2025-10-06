
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTheme } from '../../contexts/ThemeContext';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { useAuth } from '@clerk/clerk-react';
import { useFavorites } from '../../hooks/useFavorites';

const ITEM_HEIGHT = 48;

export default function ActionMenu({ id }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const open = Boolean(anchorEl);

    const { isDark } = useTheme();
    const { isSignedIn } = useAuth();
    const { isFavorite, toggleFavorite } = useFavorites();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleFavorite = async () => {
        if (!isSignedIn) {
            alert('Please sign in to add favorites');
            handleClose();
            return;
        }

        setActionLoading(true);
        try {
            await toggleFavorite(id);
            const message = isFavorite(id) ? 'Removed from favorites!' : 'Added to favorites!';
            alert(message);
        } catch (error) {
            console.error('Failed to update favorite:', error);
            alert('Failed to update favorites. Please try again.');
        } finally {
            setActionLoading(false);
            handleClose();
        }
    };

    // Determine which icon and text to show
    const isProjectFavorited = isFavorite(id);
    const FavoriteIconComponent = isProjectFavorited ? FavoriteIcon : FavoriteBorderIcon;
    const favoriteText = isProjectFavorited ? 'Remove from Favorites' : 'Add to Favorites';

    const MenuButton = ({ icon: Icon, title, disabled }) => {
        return (
            <p className={`px-1 ${isDark ? "text-white" : "text-gray-900"} ${disabled ? 'opacity-50' : ''}`}>
                {Icon && <Icon className='rounded-full mr-3' />}
                {title}
            </p>
        );
    };

    return (
        <div>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon className='text-black dark:text-white' />
            </IconButton>
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        style: {
                            maxHeight: ITEM_HEIGHT * 5,
                            backgroundColor: isDark ? "#263238" : "white"
                        },
                    },
                    list: {
                        'aria-labelledby': 'long-button',
                    },
                }}
            >
                <MenuItem onClick={handleFavorite} disabled={actionLoading}>
                    <MenuButton
                        title={actionLoading ? "Updating..." : favoriteText}
                        icon={FavoriteIconComponent}
                        disabled={actionLoading}
                    />
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <MenuButton title="Share" icon={ShareIcon} />
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <MenuButton title="Download" icon={CloudDownloadIcon} />
                </MenuItem>
            </Menu>
        </div>
    );
}