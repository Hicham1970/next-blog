import mongoose from 'mongoose';

export async function Connect() {
    try {
        mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const connection = mongoose.connection;
        connection.on('connected', () => {
            console.log('Database connected successfully!');
        });
        connection.on('error', (err) => {
            console.log('MongoDB connection error:', err);
            console.error(`Database connection error: ${err}`);
            process.exit(1);
        });
        return connection;
        
    } catch (error) {
        console.log('Something goe wrong!', error);
        throw new Error('Database connection failed');
        console.log(error);
    }
}