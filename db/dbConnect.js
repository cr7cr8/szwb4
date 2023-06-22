import mongoose from 'mongoose'

const MONGODB_URI = "mongodb+srv://boss:ABCabc123@cluster0.7ijmi.mongodb.net/szwb4DB?retryWrites=true&w=majority"

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

//https://github.com/netlify/netlify-plugin-nextjs/issues/191

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose


if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }
  cached.conn = await cached.promise
  //console.log(cached.conn)
  return cached.conn
}

export default dbConnect
