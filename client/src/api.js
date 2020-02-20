const API_URL = 'http://localhost:1337'; // TODO: env

const getAllJobs = () => fetch(`${API_URL}/jobs`)
  .then(res => res.json());

const getJob = id => fetch(`${API_URL}/jobs/${id}`)
  .then(res => res.json());

const runJob = id => fetch(`${API_URL}/jobs/${id}/run`, {
  method: 'POST',
});

export {
  getAllJobs,
  getJob,
  runJob,
};
