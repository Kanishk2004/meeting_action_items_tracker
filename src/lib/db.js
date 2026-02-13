import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
	throw new Error(
		'Please define the MONGODB_URI environment variable inside .env.local',
	);
}

// Cache the connection promise to avoid multiple connections in Next.js hot-reload
let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

const connect = async () => {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		cached.promise = mongoose
			.connect(MONGODB_URI)
			.then((mongoose) => {
				console.log('Connected to MongoDB');
				return mongoose;
			})
			.catch((error) => {
				cached.promise = null;
				console.error('Error connecting to MongoDB:', error);
				throw error;
			});
	}

	cached.conn = await cached.promise;
	return cached.conn;
};

export default connect;
