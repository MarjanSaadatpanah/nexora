import { useEffect, useState } from 'react';
import { GetProjectById } from '../../services/api';
import {PropagateLoader} from 'react-spinners';

const ObjectiveSummary = ({ id }) => {  // <-- also need to receive `id` as prop!
    const [project, setProject] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const data = await GetProjectById(id);
                setProject(data);
            } catch (err) {
                console.error('Error fetching project:', err);
            }
        };
        fetchProject();
    }, [id]); // <-- include id as dependency

    if (!project) return <p><PropagateLoader size={10} className='ml-24' /></p>; 

    return (
        <div>
            <p>
                {project.objective_data?.summary || "No summary available."}
            </p>
            <p className='mt-2 text-gray-700 text-sm'>Original Length: <span className='font-semibold'> {project.objective_data?.original_length}</span></p>
            <p className='text-gray-700 text-sm'>Summary Length: <span className='font-semibold'> {project.objective_data?.summary_length}</span></p>
        </div>

    );
}

export default ObjectiveSummary;
