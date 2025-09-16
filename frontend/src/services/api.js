import axios from 'axios';

const client = axios.create({
    baseURL: 'http://localhost:5000/api/'
})


export const SearchProjects = async (query, page = 1, perPage = 10, filters = {}) => {
    const params = {
        q: query,
        page,
        per_page: perPage
    };

    // Only include filters with real values
    Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
            params[key] = value.join(',');
        } else if (value !== undefined && value !== null && value !== '') {
            params[key] = value;
        }
    });

    const res = await client.get('/projects/search', { params });
    return res.data;
};



export const GetProjectById = async (id) => {
    const res = await client.get(`projects/${id}`);
    console.log("projects and organizations from single: ", res.data)
    return res.data;
};


export async function AllProjects() {
    const { data } = await client.get('projects');
    return data;
}

export async function RecentProjects() {
    const { data } = await client.get('projects/recent');
    return data;
}

export async function TopTenProjects() {
    const { data } = await client.get('projects/top');
    return data;
}

export async function ExpiredProjects() {
    const { data } = await client.get('projects/expiring');
    return data;
}



