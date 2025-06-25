import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Connect } from '@/lib/db';
import bcrypt from 'bcrypt';
import User from '@/models/User-model';
import { NextResponse } from 'next/server';
import { signJwtToken } from '@/lib/importToken'; // Import the function to sign JWT tokens


export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'Email' },
                password: { label: 'Password', type: 'password', placeholder: 'Password' },
            },
            async authorize(credentials) {
                try {
                    await Connect(); // Ensure the database connection is established
                    const { email, password } = credentials;
                    const user = await User.findOne({ email });
                    if (!user) {
                        throw new Error('User not found');
                    }
                    const isPasswordValid = await bcrypt.compare(password, user.password);
                    if (!isPasswordValid) {
                        throw new Error('Invalid password');
                    } else {
                        const { password, ...currentUser } = user._doc
                        const accessToken = signJwtToken(currentUser, { expiresIn: '7d'}) // Assuming getAccessToken is a method in your User model
                        return { ...currentUser, accessToken };
                    }
                    
                } catch (error) {
                    console.log('Error in authorize:', error);
                    throw new Error('Authentication failed');
                }
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
    secret: process.env.NEXT_AUTH_SECRET, // Ensure you have a secret set in your .env
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken; // Add the access token to the JWT token
                token._id = user._id; // Add user ID to the token
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id; // Add user ID to the session
                session.user.accessToken = token.accessToken;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };