import mongoose from 'mongoose';

let initialized = false;

export const Connect = async () => {
    mongoose.set('strictQuery', true);
    
    console.log('État de la connexion:', mongoose.connection.readyState);
    console.log('URL de connexion:', process.env.MONGODB_URL);
    
    if (mongoose.connection.readyState === 1) {
        console.log('MongoDB déjà connecté');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: 'NEXTBLOGY',
        });
        
        initialized = true;
        console.log('MongoDB connecté avec succès');
        console.log('Base de données:', mongoose.connection.db.databaseName);

        // verification de la connexion
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'Erreur de connexion MongoDB:'));
        db.once('open', () => console.log('Connexion MongoDB établie'));



    } catch (error) {
        console.error('Erreur détaillée:', {
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        throw new Error('Échec de la connexion à MongoDB');
    }
};