
const request = axios.create({
  baseURL: ENDPOINT,
  timeout: 10000,
});
const axiosStudents = axios.create({
  baseURL: ENDPOINTSTUDENT,
  timeout: 10000,
});

