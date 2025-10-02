import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { SearchContext } from '../contexts/SearchContext';
import HomeIcon from '@mui/icons-material/Home';
import BarChartIcon from '@mui/icons-material/BarChart';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import HourglassDisabledIcon from '@mui/icons-material/HourglassDisabled';
import EventBusyIcon from '@mui/icons-material/EventBusy';

import { IoIosSunny, IoIosMoon } from "react-icons/io";


import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';

import { useTheme } from '../contexts/ThemeContext';

export default function Category() {

    const { setSearchTerm } = useContext(SearchContext);
    const { isDark, toggleTheme } = useTheme();

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
                <Link to={link} className="mx-3 cursor-pointer text-gray-700 dark:text-gray-200 hover:text-blue-600">
                    {Icon && <Icon className='rounded-full' />}
                </Link>
            </Tooltip>
        )
    }

    return (
        <>
            <div className="flex justify-between py-3 px-9" >
                <Link to="/" onClick={() => { setSearchTerm('') }} className='text-3xl text-gray-700 dark:text-gray-200 hover:text-blue-600 cursor-pointer'>NEXORA</Link>
                <div className='pt-2 hidden md:flex'>
                    <MenuButton link="/" title="Home" icon={HomeIcon} />
                    <MenuButton link="/all-projects" title="Organizations" icon={CorporateFareIcon} />
                    <MenuButton link="/stats" title="Statistics" icon={BarChartIcon} />
                    <MenuButton link="/recent" title="New Projects" icon={NewReleasesIcon} />
                    <MenuButton link="/expiring" title="Expiring Projects" icon={HourglassDisabledIcon} />
                    <MenuButton link="/closed" title="Closed Projects" icon={EventBusyIcon} />

                    <button
                        onClick={toggleTheme}
                        className='px-4 py-1 ml-16 rounded border dark:bg-gray-900 dark:text-white'
                    >
                        {isDark ? (<IoIosSunny />) : (<IoIosMoon />)}
                    </button>
                </div>

            </div>
        </>
    );
}
