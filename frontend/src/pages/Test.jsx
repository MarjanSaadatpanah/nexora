import { useState } from 'react';
import { Link } from 'react-router-dom'

import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import HomeIcon from '@mui/icons-material/Home';
import BarChartIcon from '@mui/icons-material/BarChart';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';

import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';

const actions = [
    { icon: <HomeIcon />, name: 'Home' },
    { icon: <BarChartIcon />, name: 'Statistics' },
    { icon: <CreditScoreIcon />, name: 'All Projects' },
    { icon: <AccessTimeFilledIcon />, name: 'Recently Added' },
    { icon: <MonetizationOnIcon />, name: 'Top Funded' },
    { icon: <DoDisturbIcon />, name: 'Expiring' },
];

export default function Test() {

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
            <div className="flex justify-between">
                <Link to="/" className='text-3xl text-gray-700 hover:text-blue-600 cursor-pointer'>NEXORA</Link>
                <div className='pt-2 hidden md:flex'>
                    <MenuButton link="/" title="Home" icon={HomeIcon} />
                    <MenuButton link="/all-projects" title="All Projects" icon={CreditScoreIcon} />
                    <MenuButton link="/stats" title="Statistics" icon={BarChartIcon} />
                    <MenuButton link="/recent" title="New Projects" icon={AccessTimeFilledIcon} />
                    <MenuButton link="/top" title="Top Projects" icon={MonetizationOnIcon} />
                    <MenuButton link="/expiering" title="Expiring Projects" icon={DoDisturbIcon} />
                </div>
                <div className="md:hidden flex items-center">

                    <Box sx={{ height: 420, transform: 'translateZ(0px)', flexGrow: 1 }}>
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
                                />
                            ))}
                        </SpeedDial>
                    </Box>
                </div>
            </div>
        </>
    );
}
