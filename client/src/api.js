const API_URL = 'http://localhost:1337'; // TODO: env

const getAllJobs = () => fetch(`${API_URL}/jobs`)
  .then(res => res.json());

export { getAllJobs };
