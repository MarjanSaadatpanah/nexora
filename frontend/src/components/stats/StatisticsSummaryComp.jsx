import React, { useEffect, useState } from 'react';
import { StatisticsSummary } from '../../services/api';

const StatisticsSummaryComp = () => {

    const [statisticsSummary, setStatisticsSummary] = useState([]);

    useEffect(() => {
        StatisticsSummary().then(data => {

            setStatisticsSummary(data);
        });
    }, []);

    return (
        <div className="text-sm py-1">
            <div className="container mx-auto px-4">
                <ul>
                    <li>Projects: <strong>{statisticsSummary.total_projects}</strong></li>
                    <li>Funding: <strong>€{(statisticsSummary.total_contribution / 1000000).toFixed(0)}M</strong></li>
                    <li>Countries: <strong>{statisticsSummary.countries_involved}</strong></li>
                    <li>Organizations: <strong>{statisticsSummary.organizations_count}</strong></li>

                </ul>
            </div>
        </div>
    )
}

export default StatisticsSummaryComp
