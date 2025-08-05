// import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { GetProjectById } from '../services/api';
// import RecentlyAdded from '../components/RecentlyAdded'
// import ExpieringSoon from '../components/ExpieringSoon'
// import TopProjects from '../components/TopProjects';

// const ProjectDetails = () => {
//     const { id } = useParams();
//     const location = useLocation();
//     const navigate = useNavigate();
//     const [project, setProject] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchProject = async () => {
//             try {
//                 setIsLoading(true);
//                 const data = await GetProjectById(id);
//                 setProject(data);
//                 console.log('single project: ', data)
//             } catch (err) {
//                 console.error(err);
//                 setError('Failed to fetch project details');
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchProject();
//     }, [id]);

//     const handleBack = () => {
//         if (location.state?.projectList && location.state?.searchTerm) {
//             navigate('/', { state: location.state });
//         } else {
//             navigate('/');
//         }
//     };

//     if (isLoading) return <p>Loading...</p>;
//     if (error) return <p>{error}</p>;
//     if (!project) return <p>No project found</p>;

//     return (
//         <div className="w-full m-auto pt-5">
//             <button onClick={handleBack} className="bg-gray-200 px-4 py-2 rounded mb-5">
//                 Back to All Search Results
//             </button>
//             <h1 className="text-2xl font-bold">{project.topic}</h1>
//             <p className="text-lg">{project.acronym}</p>
//             <p>EU Contribution: {project.eu_contribution}</p>
//             <p className="mt-4">{project.objective}</p>

//             <div className='mt-40'>
//                 <RecentlyAdded />
//                 <TopProjects />
//                 <ExpieringSoon />
//             </div>
//         </div>
//     );
// };

// export default ProjectDetails;
{/* call_for_proposal: 

call_topic: 

coordinator: 

end_date: 

funded_under: 

id: 

participants: 
[{…}]
programme: 

source: 


: 
 */}