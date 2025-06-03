import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { createOrUpdateUser, deleteUser } from '@/lib/actions/user';
import { Clerk } from '@clerk/nextjs/server';

const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

export async function POST(req) {
    console.log("Webhook triggered, processing...");
    // Ensure the environment variable is set   
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET ;
    
    if (!WEBHOOK_SECRET) {
        console.error("Missing WEBHOOK_SECRET");
        throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env');
    }

    // Get the headers
    const headerPayload = headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occured -- no svix headers', {
            status: 400,
        });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt;

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        });
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error occured', {
            status: 400,
        });
    }

    // Do something with the payload
    // For this guide, you simply log the payload to the console
    const { id } = evt?.data;
    const eventType = evt?.type;
    console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
    console.log('Webhook body:', body);

    if (eventType === 'user.created' || eventType === 'user.updated') {
        console.log('🎯 Traitement événement:', eventType);
        const {
            id,
            first_name,
            last_name,
            image_url,
            email_addresses,
            username,
            profile_picture
        } = evt?.data;

        console.log('📦 Données utilisateur reçues:', {
            id,
            email: email_addresses?.[0]?.email_address,
            name: `${first_name} ${last_name}`
        });

        try {
            const user = await createOrUpdateUser(
                id,
                email_addresses,
                first_name,
                last_name,
                username,
                image_url,
                profile_picture,
                true, // isActive
                false, // isDeleted
                false  // isAdmin
            );
            console.log('✅ Utilisateur sauvegardé dans MongoDB:', user);

            if (eventType === 'user.created') {
                try {
                    console.log('⏳ Tentative de mise à jour des métadonnées...');
                    
                    const updatedUser = await clerk.users.updateUser(id, {
                        publicMetadata: {
                            userMongoId: user._id.toString(),
                            isAdmin: user.isAdmin || false,
                        },
                    });
                    
                    console.log('✅ Métadonnées mises à jour:', updatedUser);
                } catch (error) {
                    console.error('❌ Erreur:', {
                        message: error.message,
                        stack: error.stack
                    });
                }
            }
        } catch (error) {
            console.error('❌ Erreur MongoDB:', error);
            return new Response(error.message, { status: 500 });
        }
    }

    if (eventType === 'user.deleted') {
        const { id } = evt?.data;
        try {
            await deleteUser(id);
        } catch (error) {
            console.log('Error deleting user:', error);
            return new Response('Error occured', {
                status: 400,
            });
        }
    }

    return new Response('', { status: 200 });
}