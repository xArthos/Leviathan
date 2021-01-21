// Models
import User from '../model/User.js';


////////////////////////////////////////////////////////////////////////////////////////////////////////


//### Functions GET Routes ###
export const userList = async (req, res) => {
    const users = await User.find();

    try {
        users.exec()
            .then(users => res.json(users))
            .catch(err => res.status(404).json({message: `Error ${err}`}));
    } catch (error) {
        res.status(404).json({message: `Error ${error}`})
    };
};