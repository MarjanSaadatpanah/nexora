import React from 'react'
import RecentlyAdded from '../components/RecentlyAdded'

const RecentProjects = () => {
    return (
        <div className='pt-10 min-h-screen'>
            <RecentlyAdded all={true} />
        </div>
    )
}

export default RecentProjects
