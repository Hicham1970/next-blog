import { auth } from '@clerk/nextjs/server';
import { Post } from '@/lib/models/post-model.js';
import { Connect } from '@/lib/mongodb/mongoose.js';
import { currentUser } from '@clerk/nextjs/server';


export async function POST(req) {
  try {
    // Get auth from the request
    const session = await auth();
    
    console.log('API auth:', {
      userId: session.userId,
      sessionId: session.sessionId,
      headers: Object.fromEntries(req.headers)
    });

    if (!session.userId) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No session found' },
        { status: 401 }
      );
    }

    await Connect();
    const data = await req.json();

    // Get the user's public metadata
    const user = await currentUser();
    if (!user?.publicMetadata) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'User metadata not found' },
        { status: 400 }
      );
    }

    // Check permissions
    if (!user.publicMetadata?.userMongoId || 
        user.publicMetadata?.userMongoId !== data.userMongoId ||
        !user.publicMetadata?.isAdmin) {
            return new Response(JSON.stringify({
                message: 'Unauthorized'
            }), {
                status: 403,
                headers: {
                    'Content-Type': 'application/json'
                }
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
        return new Response(JSON.stringify(newPost), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.log('Error creating post:', error);
        return new Response(JSON.stringify({
            message: 'Error creating post'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};
