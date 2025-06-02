import mongoose from 'mongoose';

let initialized = false;

export const Connect = async () => {
    mongoose.set('strictQuery', true);
    
    // Si déjà connecté, retourner
    if (mongoose.connection.readyState === 1) {
        console.log('MongoDB déjà connecté');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: 'Cluster-nextjs-blog',
        });
        
        initialized = true;
        console.log('MongoDB connecté avec succès');
    } catch (error) {
        console.error('Erreur de connexion MongoDB:', error);
        throw new Error('Échec de la connexion à MongoDB');
    }
};