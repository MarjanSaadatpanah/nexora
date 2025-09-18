import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import HomeIcon from '@mui/icons-material/Home';
import BarChartIcon from '@mui/icons-material/BarChart';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';

const actions = [
    { icon: <HomeIcon />, name: 'Home' },
    { icon: <BarChartIcon />, name: 'Statistics' },
    { icon: <CreditScoreIcon />, name: 'All Projects' },
    { icon: <AccessTimeFilledIcon />, name: 'Recently Added' },
    { icon: <MonetizationOnIcon />, name: 'Top Funded' },
    { icon: <DoDisturbIcon />, name: 'Expiring' },
];

export default function Category() {
    return (
        <Box sx={{ height: 10, transform: 'translateZ(0px)', flexGrow: 1 }}>
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
                icon={<ArrowForwardIosIcon />}
                direction="right"
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
    );
}