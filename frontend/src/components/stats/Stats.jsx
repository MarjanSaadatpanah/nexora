import React from 'react'
import ProjectsPerProgrammeChart from './ProjectsPerProgrammeChart'
import CountryMerg from './CountryMerg'
import ProjectsOverYears from './ProjectsOverYears'
import ProjectsByEuContribution from './ProjectsByEuContribution'
// import Test from './Test'

const Stats = () => {
    return (
        <div>
            {/* <Test /> */}
            <ProjectsPerProgrammeChart />
            <CountryMerg />
            <ProjectsOverYears />
            <ProjectsByEuContribution />
        </div>
    )
}

export default Stats
