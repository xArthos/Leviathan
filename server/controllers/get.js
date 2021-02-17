// Models
import User from '../model/User.js';
import fs from 'fs';


////////////////////////////////////////////////////////////////////////////////////////////////////////


//### Functions ###
export const usersList = async (req, res) => {

    try {
        await User.find()
            .then(users => res.json(users))
            .catch(err => res.status(404).json({ message: `Error ${err}` }));
    } catch (error) {
        res.status(404).json({ message: `Error ${error}` })
    };
};

export const userProfilePic = async (req, res) => {

    // Usrname of the picture requested
    const userName = req.params.userName;

    const folders = fs.readdirSync(`${process.cwd()}/public/images/profilePicture/`);

    // console.log(folders);

    let objArray = [];

    folders.forEach((folder) => {
        let obj = {};
        let files = fs.readdirSync(`${process.cwd()}/public/images/profilePicture/${folder}`);
        obj.folder = folder;
        obj.files = files;
        objArray.push(obj);
    });

    // console.log(objArray);
    const searchedUser = objArray.find(function (post, index) {
        if (post.folder === userName)
            return true;
    });
    // console.log(searchedUser);

    fs.readFile(`${process.cwd()}/public/images/profilePicture/${userName}/${searchedUser.files[0]}`, function (err, data) {
        const base64 = Buffer.from(data).toString('base64');

        let mimetype = 'image/jpeg';

        const profileImg = `data:${mimetype};base64,${base64}`;

        res.status(200).send(profileImg);
    });
};