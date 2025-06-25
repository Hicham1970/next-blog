// localhost:3000/api/signup

import User from '@/models/User-model';
import bcrypt from 'bcrypt';
import { Connect } from '@/lib/db';
import { NextResponse } from 'next/server';


export async function POST(request) {
    try {
        await Connect(); // Ensure the database connection is established
        const {name, email, password} = await request.json();
        
        // verifier si l'email se trouve deja  dans la base de données
        const isExisting = await User.findOne({ email });
        if (isExisting) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }
        
        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed password:', hashedPassword);

        // create a new user
        const newUser = await User.create({
            name,
            email,
            password:hashedPassword,
        });
        console.log('New user created:', newUser);

       return NextResponse.json(newUser, { status: 201 });
        
    } catch (error) {
        return NextResponse.json({ error: 'POST error (sign up)!!' }, { status: 500 });
    }
 }
