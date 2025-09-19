import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { SearchContext } from '../contexts/SearchContext';

import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import HomeIcon from '@mui/icons-material/Home';
import BarChartIcon from '@mui/icons-material/BarChart';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';

import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';

import { useNavigate } from 'react-router-dom';

const actions = [
    { icon: <HomeIcon />, name: 'Home', route: '/' },
    { icon: <BarChartIcon />, name: 'Statistics', route: '/stats' },
    { icon: <CorporateFareIcon />, name: 'Organizations', route: '/all-projects' },
    { icon: <AccessTimeFilledIcon />, name: 'Recently Added', route: '/recent' },
    { icon: <MonetizationOnIcon />, name: 'Top Funded', route: '/top' },
    { icon: <DoDisturbIcon />, name: 'Expiring', route: '/expiring' }
];

export default function Category() {

    const navigate = useNavigate();
    const { setSearchTerm } = useContext(SearchContext);

    const MenuButton = ({ link, icon: Icon, title }) => {
        return (

            <Tooltip
                title={title}
                placement="bottom-start"
                arrow
                slots={{
                    transition: Fade,
                }}
                slotProps={{
                    transition: { timeout: 600 },
                }}
            >
                <Link to={link} className="mx-3 cursor-pointer text-gray-700 hover:text-blue-600">
                    {Icon && <Icon className='rounded-full' />}
                </Link>
            </Tooltip>
        )
    }

    return (
        <>
            <div className="flex justify-between py-3 w-9/12">
                <Link to="/" onClick={() => { setSearchTerm('') }} className='text-3xl text-gray-700 hover:text-blue-600 cursor-pointer'>NEXORA</Link>
                <div className='pt-2 hidden md:flex'>
                    <MenuButton link="/" title="Home" icon={HomeIcon} />
                    <MenuButton link="/all-projects" title="Organizations" icon={CorporateFareIcon} />
                    <MenuButton link="/stats" title="Statistics" icon={BarChartIcon} />
                    <MenuButton link="/recent" title="New Projects" icon={AccessTimeFilledIcon} />
                    <MenuButton link="/top" title="Top Projects" icon={MonetizationOnIcon} />
                    <MenuButton link="/expiring" title="Expiring Projects" icon={DoDisturbIcon} />
                </div>
                <div className="md:hidden flex items-center bg-amber-50 fixed right-7">

                    <Box sx={{ height: 40, transform: 'translateZ(0px)', flexGrow: 1 }}>
                        <SpeedDial
                            ariaLabel="SpeedDial"
                            sx={{
                                '& .MuiSpeedDial-fab': {
                                    bgcolor: 'gray',
                                    '&:hover': {
                                        bgcolor: 'lightblue',
                                    },
                                    width: 40,
                                    height: 40,
                                },
                            }}
                            icon={<ExpandMoreIcon />}
                            direction="down"
                        >
                            {actions.map((action) => (
                                <SpeedDialAction
                                    key={action.name}
                                    icon={action.icon}
                                    tooltipTitle={action.name}
                                    onClick={() => navigate(action.route)}
                                />
                            ))}
                        </SpeedDial>
                    </Box>
                </div>
            </div>
        </>
    );
}
