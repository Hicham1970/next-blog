import {Post} from '@/lib/models/post-model.js';  
import { Connect }from '@/lib/mongodb/mongoose.js';
import { currentUser } from '@clerk/nextjs/server';
export const POST = async (req) => {
    const user = await currentUser();
    console.log('User in route.js:', user);
   
    try {
        await Connect();
        const data = await req.json();
        // console.log('user', user.publicMetadata.userId);
        console.log('data', data);


        if (
            !user ||
            user.publicMetadata.userMongoId !== data.userMongoId ||
            user.publicMetadata.isAdmin !== true
        ) {
            return new Response('Unauthorized by Law', {
                status: 401,
            });
        }
        const slug = data.title
            .split(' ')
            .join('-')
            .toLowerCase()
            .replace(/[^a-zA-Z0-9-]/g, '');
        const newPost = await Post.create({
            userId: user.publicMetadata.userMongoId,
            content: data.content,
            title: data.title,
            image: data.image,
            category: data.category,
            slug,
        });
        await newPost.save();
        return new Response(JSON.stringify(newPost), {
            status: 200,
        });
    } catch (error) {
        console.log('Error creating post:', error);
        return new Response('Error creating post', {
            status: 500,
        });
    }
    if (!user) {
        console.error('User is null');
        return new Response('Unauthorized', { status: 401 });
    }
};
