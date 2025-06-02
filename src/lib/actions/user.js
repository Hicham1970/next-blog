import {User} from '../models/user-model.js';
import { Connect } from '../mongodb/mongoose.js';

export const createOrUpdateUser = async (
    id, 
    email_addresses, 
    first_name, 
    last_name, 
    username, 
    image_url,
    profile_picture
) => {
    // Validation des entrées
    if (!id || !email_addresses?.length) {
        throw new Error('ID et email sont requis');
    }

    try {
        await Connect();

        const user = await User.findOneAndUpdate(
            { clerkId: id },
            { 
                $set: {
                    email: email_addresses[0].email_address,
                    firstName: first_name,
                    lastName: last_name,
                    userName: username,
                    profilePicture: image_url || profile_picture || '',
                    isActive: true,
                    isDeleted: false
                }
            },
            {
                new: true,         // Retourne le document modifié
                upsert: true,      // Crée un nouveau document si non trouvé
                runValidators: true // Active la validation du schéma
            }
        );

        if (!user) {
            throw new Error('Échec de création/mise à jour utilisateur');
        }

        return user;

    } catch (error) {
        console.error('Error creating or updating user:', error);
        throw new Error('Failed to create or update user');
    }
}

export const deleteUser = async (id) => {
    try {
        await Connect();

        const user = await User.findOneAndDelete(
            { clerkId: id },
    
        );

        if (!user) {
            throw new Error('User not found or already deleted');
        }   
    }
    catch (error) {
        console.error('Error deleting user:', error);
        throw new Error('Failed to delete user');
        
    }
 }