// Modules
import axios from 'axios';

// Set URL
const usersUrl = 'http://localhost:8010/usersList';

// APIs
// All Users
export const fetchUsers = () => axios.get(usersUrl);