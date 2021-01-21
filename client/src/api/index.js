// Modules
import axios from 'axios';

const usersUrl = 'http://localhost:8010/user/all';

export const fetchUsers = () => axios.get(usersUrl);