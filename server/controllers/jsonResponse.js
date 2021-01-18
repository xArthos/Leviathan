// Models
const User = require('../model/User');


////////////////////////////////////////////////////////////////////////////////////////////////////////


//### Functions GET Routes ###
exports.userList = (req, res) => {
    const query = User.find();

    query.exec()
    .then(users => res.json(users))
    .catch(err => res.status(404).json(`Error ${err}`));
};