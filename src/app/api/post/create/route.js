import { auth } from '@clerk/nextjs/server';
import { Post } from '@/lib/models/post.model.js';
import { Connect } from '@/lib/mongodb/mongoose.js';
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req) {
    console.log('=== Début de la requête POST /api/post/create ===');

    try {
        // Vérification de l'authentification
        console.log('Vérification de la session...');
        const session = await auth();
        console.log('Session:', {
            hasSession: !!session,
            userId: session?.userId,
            sessionKeys: session ? Object.keys(session) : []
        });

        if (!session?.userId) {
            console.log('Erreur: Aucune session utilisateur trouvée');
            return NextResponse.json(
                { error: 'Unauthenticated', message: 'Authentication required' },
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        try {
            // Vérification manuelle du token
            const authHeader = req.headers.get('authorization');
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                console.log('Aucun token fourni');
                return NextResponse.json(
                    { error: 'Unauthenticated', message: 'No token provided' },
                    { status: 401 }
                );
            }

            const token = authHeader.split(' ')[1];
            console.log('Token reçu:', token ? `[TOKEN PRÉSENT, ${token.length} caractères]` : '[TOKEN MANQUANT]');

            // Validation du token avec Clerk
            const session = await clerkClient.sessions.verifySession(token);
            console.log('Session vérifiée:', {
                userId: session.userId,
                status: session.status,
                lastActiveAt: session.lastActiveAt
            });

            if (!session || session.status !== 'active') {
                console.log('Session invalide ou expirée');
                return NextResponse.json(
                    { error: 'Unauthenticated', message: 'Invalid or expired session' },
                    { status: 401 }
                );
            }
        } catch (error) {
            console.error('Erreur de vérification de la session:', error);
            return NextResponse.json(
                { error: 'Internal Server Error', message: 'Session verification failed' },
                { status: 500 }
            );
        }


        console.log('Connexion à la base de données...');
        await Connect();

        console.log('Récupération des données de la requête...');
        const data = await req.json();
        console.log('Données reçues:', {
            hasTitle: !!data.title,
            hasContent: !!data.content,
            hasUserMongoId: !!data.userMongoId,
            dataKeys: Object.keys(data)
        });

        // Récupération des métadonnées de l'utilisateur
        console.log('Récupération des informations utilisateur...');
        const user = await currentUser();
        console.log('Utilisateur actuel:', {
            id: user?.id,
            hasMetadata: !!user?.publicMetadata,
            metadataKeys: user?.publicMetadata ? Object.keys(user.publicMetadata) : []
        });

        if (!user?.publicMetadata) {
            console.log('Erreur: Métadonnées utilisateur non trouvées');
            return NextResponse.json(
                { error: 'Unauthorized', message: 'User metadata not found' },
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Vérification des permissions
        const hasUserMongoId = !!user.publicMetadata?.userMongoId;
        const isAdmin = !!user.publicMetadata?.isAdmin;
        const mongoIdMatch = user.publicMetadata?.userMongoId === data.userMongoId;

        console.log('Vérification des permissions:', {
            hasUserMongoId,
            isAdmin,
            mongoIdMatch,
            requiredMongoId: data.userMongoId,
            actualMongoId: user.publicMetadata?.userMongoId
        });

        if (!hasUserMongoId || !mongoIdMatch || !isAdmin) {
            console.log('Erreur: Permissions insuffisantes');
            return NextResponse.json(
                { error: 'Forbidden', message: 'Insufficient permissions' },
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Création du slug
        const slug = data.title
            .split(' ')
            .join('-')
            .toLowerCase()
            .replace(/[^a-zA-Z0-9-]/g, '');

        console.log('Création du post avec le slug:', slug);

        // Création du post
        const newPost = await Post.create({
            userId: user.publicMetadata.userMongoId,
            title: data.title,
            slug,
            content: data.content,
            image: data.image || '',
            category: data.category || 'Uncategorized',
            published: data.published !== undefined ? data.published : true,
        });

        console.log('Post créé avec succès:', { postId: newPost._id, slug });

        return NextResponse.json(
            {
                success: true,
                slug: newPost.slug,
                post: newPost
            },
            { status: 201, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Erreur lors de la création du post:', error);
        return NextResponse.json(
            {
                error: 'Internal Server Error',
                message: error.message || 'An error occurred while creating the post'
            },
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    } finally {
        console.log('=== Fin de la requête POST /api/post/create ===\n');
    }
}
