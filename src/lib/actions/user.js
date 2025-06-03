'use server';

import { User } from '../models/user-model.js';
import { Connect } from '../mongodb/mongoose.js';

export const createOrUpdateUser = async (
    id, 
    email_addresses, 
    first_name, 
    last_name, 
    username, 
    image_url,
    profile_picture,
    isActive,
    isDeleted,
    isAdmin 
) => {
    console.log('🚀 Début createOrUpdateUser:', { id, email: email_addresses?.[0]?.email_address });

    if (!id || !email_addresses?.length) {
        console.error('❌ Validation échouée: ID ou email manquant');
        throw new Error('ID et email sont requis');
    }

    try {
        console.log('🔄 Tentative de connexion MongoDB...');
        await Connect();
        console.log('✅ Connexion MongoDB établie');

        const userData = {
            email: email_addresses[0].email_address,
            firstName: first_name,
            lastName: last_name,
            userName: username,
            profilePicture: image_url || profile_picture || '',
            isActive: true,
            isDeleted: false,
            isAdmin: false
        };
        console.log('📝 Données à sauvegarder:', userData);

        const user = await User.findOneAndUpdate(
            { clerkId: id },
            { $set: userData },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        if (!user) {
            console.error('❌ Échec création/mise à jour utilisateur');
            throw new Error('Échec de création/mise à jour utilisateur');
        }

        console.log('✅ Utilisateur créé/mis à jour avec succès:', user);
        return user;

    } catch (error) {
        console.error('❌ Erreur détaillée:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        throw new Error('Failed to create or update user');
    }
}

export const deleteUser = async (id) => {
    console.log('🗑️ Tentative de suppression utilisateur:', id);
    
    try {
        await Connect();
        console.log('✅ Connexion MongoDB établie pour suppression');

        const user = await User.findOneAndDelete({ clerkId: id });

        if (!user) {
            console.error('❌ Utilisateur non trouvé ou déjà supprimé');
            throw new Error('User not found or already deleted');
        }

        console.log('✅ Utilisateur supprimé avec succès:', id);
    } catch (error) {
        console.error('❌ Erreur lors de la suppression:', {
            message: error.message,
            stack: error.stack
        });
        throw new Error('Failed to delete user');
    }
}