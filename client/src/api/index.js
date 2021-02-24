// Modules
import axios from 'axios';

// Set URL
const usersUrl = 'http://localhost:8010/allUsersList';

// APIs
// All Users
export const fetchUsers = () => axios.get(usersUrl);