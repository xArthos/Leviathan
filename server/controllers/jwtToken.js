// Modules
import jwt from 'jsonwebtoken';

// Models
import RefreshTokens from '../model/refreshTokens.js';


////////////////////////////////////////////////////////////////////////////////////////////////////////


//### Functions - Middleware ###
export const authenticateToken = (req, res, next) => {
    // const authHeader = req.headers['authorization'];
    // const token = authHeader && authHeader.split(' ')[1];

    const token = req.session.accessToken;
    // console.log(token);

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {

        if (err) return res.sendStatus(403);

        // console.log(user)
        // req.user = user;
        next();
    });
};

export const refreshToken = (req, res, next) => {
    // Set the Current Refrsh Token
    const refreshToken = req.session.refreshToken;
    // console.log(refreshToken)

    // Check if there is a Current Refresh Token
    if (refreshToken == null) res.sendStatus(401);

    // Check if the Refresh Token is in DB
    RefreshTokens.findOne({ token: refreshToken }, (err, tokenDB) => {

        if (tokenDB == null) return res.sendStatus(404);
        if (err) return res.sendStatus(403);

        // Verify if the Refresh Token is Valid
        jwt.verify(tokenDB.token, process.env.REFRESH_TOKEN_SECRET, (err) => {
            // Take the Current User
            const user = req.session.user;

            // Return an Error if the Refresh Token isn't Valid
            if (err) return res.sendStatus(403);
            // console.log(user)

            // Generate a New Access Token if the Refresh Token is Valid
            function generateAccessToken (param) {
                return jwt.sign(param, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
            };

            const accessToken = generateAccessToken(user)

            req.session.accessToken = accessToken;
            next();
        });
    })
};

////////////////////////////////////////////////////////////////////////////////////////////////////////


//### Functions ###
export const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
};