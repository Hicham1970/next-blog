// http://localhost:3000/api/blog/some-id-here
import { NextResponse } from 'next/server';
import Blog from '@/models/Blog-model';
import { Connect } from '@/lib/db';
import { verifyJwtToken } from '@/lib/importToken';
import mongoose from 'mongoose';

export async function PUT(req, res) {
    await Connect();

    const id = res.params.id; // Récupération de l'ID depuis les paramètres de la requête


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
        const blog = await Blog.findById(id).populate('authorId');
        if (blog?.authorId?._id.toString() !== decodedToken._id.toString()) {
            return NextResponse.json({ message: "You are not authorized to update this blog post" }, { status: 403 });
        }
        const updateBlog = await Blog.findByIdAndUpdate(id, {$set:{...body}}, { new: true });
        console.log(updateBlog);

        return NextResponse.json(updateBlog, { status: 200 });
    } catch (error) {
        console.error("Erreur création blog:", error);
        return NextResponse.json({ message: "Error updating blog post" }, { status: 500 });
    }
}


// Pour Obtenir les Blogs de la collections mongoDb:

export async function GET(req, res) {
    await Connect();

    const id = res.params.id; 

    try {
        const blog = await Blog.findById(id)
            .populate('authorId', '-password')
            .populate('comments.user', '-password');

        return NextResponse.json(blog, { status: 200 })

    } catch (error) {
        console.error("Erreur GET /api/blog :", error);
        return NextResponse.json({ message: "Error getting blog posts" }, { status: 500 });

    }
}

// Delete API


export async function DELETE(req, res) {
    await Connect();

    const id = res.params.id; // Récupération de l'ID depuis les paramètres de la requête


    const accessToken = req.headers.get('authorization');
    const token = accessToken?.split(' ')[1];

    const decodedToken = verifyJwtToken(token);

    if (!accessToken || !decodedToken) {
        return new Response(JSON.stringify({ error: 'unauthorized, wrong or expired token' }), { status: 403 });
    }

    try {
        const blog = await Blog.findById(id).populate('authorId');
        if (blog?.authorId?._id.toString() !== decodedToken._id.toString()) {
            return NextResponse.json({ message: "Only authorized author can delete his blog post" }, { status: 403 });
        }
        await Blog.findByIdAndDelete(id);

        return NextResponse.json({message:"Blog deleted successfully"}, { status: 200 });
    } catch (error) {
        console.error("Erreur création blog:", error);
        return NextResponse.json({ message: "Error deleting blog post" }, { status: 500 });
    }
}