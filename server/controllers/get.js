// Models
import User from '../model/User.js';


////////////////////////////////////////////////////////////////////////////////////////////////////////


//### Functions ###
export const usersList = async (req, res) => {

    try {
        await User.find()
            .then(users => res.json(users))
            .catch(err => res.status(404).json({message: `Error ${err}`}));
    } catch (error) {
        res.status(404).json({message: `Error ${error}`})
    };
};