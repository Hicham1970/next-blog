import mongoose from 'mongoose';

let initialized = false;

export const Connect = async () => {
    mongoose.set('strictQuery', true);
    if (initialized) {
        console.log('Mongoose already initialized, you are trying to connect again');
        return;
         
        try {
            await mongoose.connect(process.env.MONGODB_URI, {
                dbName: 'Cluster-nextjs-blog',
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            initialized = true;
            console.log('Mongoose connected successfully');
        
        } catch (error) {
            console.error('Mongoose connection error:', error);
            throw new Error('Failed to connect to MongoDB');    
            
        }

    }
}