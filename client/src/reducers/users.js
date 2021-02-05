// Actions
import { FETCH_ALL } from '../actions/actions';

// eslint-disable-next-line
export default (users = [], action) => {

    switch (action.type) {
        case FETCH_ALL:
            return action.payload;

        default:
            return users;
    };
};