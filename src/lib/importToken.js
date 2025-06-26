import jwt from 'jsonwebtoken';

export function signJwtToken(user) {
    const secretKey = process.env.JWT_SECRET;
    const token = jwt.sign(
        { id: user._id, email: user.email },
        secretKey, // Use your secret key from environment variables
        // { expiresIn: '1h' } // Token expiration time
    );
    return token;
}

export function verifyJwtToken(token) {
    const secretKey = process.env.JWT_SECRET;
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded; // Returns the decoded token if valid
    } catch (error) {
        console.error('JWT verification error:', error);
        return null; // Return null if verification fails
    }
 }