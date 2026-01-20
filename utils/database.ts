import mongoose from 'mongoose';
import keys from '../config/keys';

// Track MongoDB connection state
let isConnected = false;
let connectionError: Error | null = null;

/**
 * Initialize MongoDB connection with graceful error handling.
 * The server will continue running even if MongoDB connection fails.
 */
export async function connectToMongoDB(): Promise<void> {
  try {
    await mongoose.connect(keys.mongoURI);
    isConnected = true;
    connectionError = null;
    console.log('Connected to MongoDB successfully');

    // Handle disconnection events
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
      isConnected = true;
      connectionError = null;
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err.message);
      connectionError = err;
    });
  } catch (err) {
    const error = err as Error;
    isConnected = false;
    connectionError = error;
    console.warn(`MongoDB connection failed: ${error.message}`);
    console.warn('Server will continue running without database connectivity');
  }
}

/**
 * Check if MongoDB is currently connected
 */
export function isDatabaseConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}

/**
 * Get the last connection error if any
 */
export function getConnectionError(): Error | null {
  return connectionError;
}

/**
 * Get database health status for health check endpoint
 */
export function getDatabaseHealth(): { connected: boolean; error?: string } {
  return {
    connected: isDatabaseConnected(),
    ...(connectionError && { error: connectionError.message })
  };
}
