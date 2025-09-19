import React from 'react'
import ProjectsPerProgrammeChart from './ProjectsPerProgrammeChart'
import CountryMerg from './CountryMerg'
import ProjectsOverYears from './ProjectsOverYears'
import ProjectsByEuContribution from './ProjectsByEuContribution'

const Stats = () => {
    return (
        <div>
            <ProjectsPerProgrammeChart />
            <CountryMerg />
            <ProjectsOverYears />
            <ProjectsByEuContribution />
        </div>
    )
}

export default Stats
