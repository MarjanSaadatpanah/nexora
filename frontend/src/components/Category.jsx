import * as React from 'react';
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import SelectAll from '@mui/icons-material/SelectAll';
import NewReleases from '@mui/icons-material/NewReleases';
import MonetizationOn from '@mui/icons-material/MonetizationOn';
import Speed from '@mui/icons-material/Speed';
import BarChartIcon from '@mui/icons-material/BarChart';
import HomeIcon from '@mui/icons-material/Home';


export default function Category() {
    const [value, setValue] = React.useState(0);
    const navigate = useNavigate();

    return (
        <div className='w-full bg-white'>
            <Box>
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                >
                    <BottomNavigationAction sx={{ flexDirection: 'row', '& .MuiBottomNavigationAction-label': { paddingLeft: '8px', } }} label="Home" icon={<HomeIcon />} onClick={() => navigate("/")} />
                    <BottomNavigationAction sx={{ flexDirection: 'row', '& .MuiBottomNavigationAction-label': { paddingLeft: '8px', } }} label="Statistics" icon={<BarChartIcon />} onClick={() => navigate("/stats")} />
                    <BottomNavigationAction sx={{ flexDirection: 'row', '& .MuiBottomNavigationAction-label': { paddingLeft: '8px', } }} label="All Projects" icon={<SelectAll />} />
                    <BottomNavigationAction sx={{ flexDirection: 'row', '& .MuiBottomNavigationAction-label': { paddingLeft: '8px', } }} label="Recently Added" icon={<NewReleases />} />
                    <BottomNavigationAction sx={{ flexDirection: 'row', '& .MuiBottomNavigationAction-label': { paddingLeft: '8px', } }} label="Top Funded" icon={<MonetizationOn />} />
                    <BottomNavigationAction sx={{ flexDirection: 'row', '& .MuiBottomNavigationAction-label': { paddingLeft: '8px', } }} label="Expiring Soon" icon={<Speed />} />
                </BottomNavigation>
            </Box>
        </div>
    );
}
