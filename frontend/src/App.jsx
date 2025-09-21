import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SearchProvider } from './contexts/SearchContext';
import Layout from './Layout';
import Home from "./pages/Home";
import AllProjectsPaginated from './pages/AllProjectsPaginated';
import ProjectDetails from './pages/ProjectDetails';
import Test from './pages/Test'
import RecentProjects from './pages/RecentProjects';
import ExpiringProjects from './pages/ExpiringProjects';
import ClosedProjects from './pages/ClosedProjects';

function App() {
  return (
    <SearchProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="all-projects" element={<AllProjectsPaginated />} />
            <Route path="project/:id" element={<ProjectDetails />} />
            <Route path="test" element={<Test />} />
            <Route path="recent" element={<RecentProjects />} />
            <Route path="expiring" element={<ExpiringProjects />} />
            <Route path="closed" element={<ClosedProjects />} />
          </Route>
        </Routes>
      </Router>
    </SearchProvider>
  );
}


export default App;
