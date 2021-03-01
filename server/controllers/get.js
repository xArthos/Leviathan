// Modules
import fs from 'fs';
import jwt from 'jsonwebtoken';

// Models
import User from '../model/User.js';
import WikiPage from '../model/WikiPage.js';


////////////////////////////////////////////////////////////////////////////////////////////////////////


//### Functions ###
export const allUsersList = async (req, res) => {

    try {
        await User.find()
            .then(users => res.json(users))
            .catch(err => res.status(404).json({ message: `Error ${err}` }));
    } catch (error) {
        res.status(404).json({ message: `Error ${error}` })
    };
};

export const allWikisList = async (req, res) => {

    try {
        await WikiPage.find()
            .then(wikis => res.json(wikis))
            .catch(err => res.status(404).json({ message: `Error ${err}` }));
    } catch (error) {
        res.status(404).json({ message: `Error ${error}` })
    };
};

export const authenticate = async (req, res) => {

    const token = req.params.token;
    console.log(token);

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) return res.send(400).send('Something went wrong');

            const { email } = JSON.parse(decoded.body);
            // console.log(JSON.parse(decoded.body));

            User.findOneAndUpdate({ email: email }, { active: true }, (err, data) => {
                if (err) return res.send(400).send('Something went wrong');

                console.log(data)
            });

            res.status(200).redirect('http://localhost:3000/login');
        })
    } else {
        return res.json({ error: 'Something went wrong :(' });
    };
};

export const userProfilePic = async (req, res) => {

    // Usrname of the picture requested
    const userName = req.params.userName;

    const file = fs.readFileSync(`${process.cwd()}/public/images/profilePicture/${userName}/profile.jpg`);

    res.status(200).send(file);
};

export const userProfilePicTemp = async (req, res) => {

    // Usrname of the picture requested
    const userName = req.params.userName;

    const profileImg = fs.readFileSync(`${process.cwd()}/public/images/profilePicture/${userName}/temp/profile.jpg`);

    res.status(200).send(profileImg);
};

export const wikiPagePicture = async (req, res) => {

    const { wikiId, picExtension, fileName } = req.params;

    WikiPage.findById(wikiId).populate('author', '_id').exec().then((data) => {
        const userId = data.author._id;

        // Destination of the file
        const dir = `${process.cwd()}/public/images/wikis/${userId}/${wikiId}`;
        const file = fs.readFileSync(`${dir}/${fileName}.${picExtension}`);
        res.status(200).send(file);
    });
};

export const wikiPagePublished = async (req, res) => {
    // console.log('---------------- GET Picture Test --------------------');
    const { wikiId } = req.params;

    WikiPage.findById(wikiId).populate('author', '_id').exec().then((data) => {
        res.status(200).send({
            content: data.content
        });
    });
};

export const userWikiPages = async (req, res) => {
    // console.log('---------------- GET Picture Test --------------------');
    const { userName } = req.params;
    // console.log(userName);

    User.findOne({ userName: userName }).populate('wikiPagesMade').exec((err, data) => {
        // console.log(data)
        res.status(200).send({
            numberOfWikis: data.wikiPagesMade.length,
            wikis: data.wikiPagesMade
        });
    });
};

export const formSelectArrowIcon = async (req, res) => {
    // Destination of the file
    const dir = `${process.cwd()}/public/images/form`;
    const file = fs.readFileSync(`${dir}/arrow.png`);
    res.status(200).send(file);
};

export const lastPublishedWikisList = async (req, res) => {
    WikiPage.find({'published': true}).sort({"createdAt": 1}).limit(3).then(item => {
        res.status(200).send(item);
    });
};

export const wikiPageCardBackground = async (req, res) => {

    const { wikiId, picExtension } = req.params;

    WikiPage.findById(wikiId).populate('author', '_id').exec().then((data) => {
        const userId = data.author._id;

        // Destination of the file
        const dir = `${process.cwd()}/public/images/wikis/${userId}/${wikiId}`;
        const file = fs.readFileSync(`${dir}/card-bg.${picExtension}`);
        res.status(200).send(file);
    });
};