import mongoose from 'mongoose';

// Set Mongoose options to suppress deprecation warnings
mongoose.set('strictQuery', false);

const connection = {};

async function connect() {
	// Check if already connected and ready
	if (connection.isConnected === 1) {
		if (mongoose.connection.readyState === 1) {
			console.log('Already connected');
			return;
		} else {
			// Connection state is inconsistent, reset it
			connection.isConnected = 0;
		}
	}

	// Check existing connections
	if (mongoose.connections.length > 0) {
		const readyState = mongoose.connections[0].readyState;
		if (readyState === 1) {
			connection.isConnected = 1;
			console.log('Connection already exists');
			return;
		}
		// If connection exists but not ready, disconnect it
		if (readyState !== 0) {
			try {
				await mongoose.disconnect();
			} catch (err) {
				// Ignore disconnect errors
			}
		}
	}

	try {
		// Connect with options - mongoose.connect() returns when connected
		await mongoose.connect(process.env.MONGODB_URI, {
			bufferCommands: false,
			serverSelectionTimeoutMS: 5000,
		});
		
		// Set connection state after successful connect
		connection.isConnected = mongoose.connection.readyState;
		console.log('New connection established');
	} catch (error) {
		console.error('Database connection error:', error);
		connection.isConnected = 0;
		throw error;
	}
}

async function disconnect() {
	if (connection.isConnected) {
		if (process.env.NODE_ENV === 'production') {
			await mongoose.disconnect();
			connection.isConnected = false;
		} else {
			console.log('Not disconnected');
		}
	}
}

function convertDoctoObj(doc) {
	doc._id = doc._id.toString();
	doc.createdAt = doc.createdAt.toString();
	doc.updatedAt = doc.updatedAt.toString();
	return doc;
}

const db = { connect, disconnect, convertDoctoObj };
export default db;
