// http://localhost:3000/api/blog
import { NextResponse } from 'next/server';
import Blog from '@/models/Blog-model';
import { Connect } from '@/lib/db';
import { verifyJwtToken } from '@/lib/importToken';
import mongoose from 'mongoose';

export async function POST(req) {
    await Connect();

    const accessToken = req.headers.get('authorization');
    const token = accessToken?.split(' ')[1];

    const decodedToken = verifyJwtToken(token);

    if (!accessToken || !decodedToken) {
        return new Response(JSON.stringify({ error: 'unauthorized, wrong or expired token' }), { status: 403 });
    }

    try {
        const body = await req.json();
        // Correction pour authorId
        if (body.authorId) {
            body.authorId = new mongoose.Types.ObjectId(body.authorId);
        }
        const newBlog = await Blog.create(body);
        console.log(newBlog); 
        return NextResponse.json(newBlog, { status: 201 });
    } catch (error) {
        console.error("Erreur création blog:", error);
        return NextResponse.json({message:"Error creating blog post"}, { status: 500 });
    }
}


// Pour Obtenir les Blogs de la collections mongoDb:

export async function GET(req){
    await Connect(); 

    try{
        const blogs = await Blog.find().populate('authorId', '-password').sort({createdAt: -1});

        return NextResponse.json(blogs,{status : 200})

    }catch(error){
        console.error("Erreur GET /api/blog :", error);
        return NextResponse.json({message:"Error getting blog posts"}, { status: 500 }); 
        
    }
}