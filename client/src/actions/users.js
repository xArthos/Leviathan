// Api
import * as api from '../api';

// Actions
import { FETCH_ALL } from './actions';

// Fetching API
export const getUsers = () => async (dispatch) => {
    try {
        const { data } = await api.fetchUsers();

        dispatch({ type: FETCH_ALL, payload: data });
    } catch (error) {
        console.log(error.message);
    };
};