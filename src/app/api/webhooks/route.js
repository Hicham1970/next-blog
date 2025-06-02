import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { createOrUpdateUser } from '@/lib/actions/user.js';  
import { clerkClient } from '@clerk/nextjs';  

export async function POST(req) {
    // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error(
            'Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local'
        );
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

    // Handle different event types according to the actions you set up in the file actions/user.js

    if (eventType === 'user.created' || eventType === 'user.updated') {
        if (!evt?.data) {
            return new Response('Invalid event data', { status: 400 });
        }
        const { id, email_addresses, first_name, last_name, username, image_url, profile_picture } = evt?.data;
        // create the user with the createOrUpdateUser function
        try {
            const user = await createOrUpdateUser(
                id,
                email_addresses,
                first_name,
                last_name,
                username,
                image_url,
                profile_picture
            )
            // ajouter ou update les infos du user à la base de données Clerk
            if (user && eventType === 'user.created') {

                try {
                    await clerkClient.users.updateUserMetadata(user.clerkId, {
                        publicMetadata: {
                            userMongoId: user._id.toString(),
                            isAdmin: user.isAdmin,
                            firstName: user.firstName,
                            email: user.email,
                            lastName: user.lastName,
                            userName: user.userName,
                            profilePicture: user.profilePicture
                        }
                    })
                } catch (error) {
                    console.error('Error updating Clerk user metadata:', error);
                }
            }

            console.log('User created or updated successfully:', user);

        } catch (error) {
            console.error('Error creating or updating user:', error);
            return new Response('Error creating or updating user', { status: 500 });
        }

    }

    if (eventType === 'user.deleted') {
        if (!evt?.data) {
            return new Response('Invalid event data', { status: 400 });
        }
        const { id } = evt?.data;
        // delete the user with the deleteUser function
        try {
            await deleteUser(id);
            console.log(`User with ID ${id} has been marked as deleted.`);
            
        } catch (error) {
            console.error('Error deleting user:', error);
            return new Response('Error deleting user', { status: 500 });
        }
    }
    return new Response('', { status: 200 });
}