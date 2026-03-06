import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

const options = {
  tls: true,
  tlsAllowInvalidCertificates: false,
  serverSelectionTimeoutMS: 10000,
};

const client = new MongoClient(uri, options);  // 👈 options added here

let cached = global._mongo;

if (!cached) {
  cached = global._mongo = { conn: null };
}

export async function connectDB() {
  if (!cached.conn) {
    cached.conn = await client.connect();
    console.log("✅ MongoDB Connected");
  }

  return cached.conn.db("ai_interview_system");
}




// import { MongoClient } from "mongodb";

// const uri = process.env.MONGODB_URI;

// if (!uri) {
//   throw new Error("Please define MONGODB_URI in .env.local");
// }

// const client = new MongoClient(uri);

// let cached = global._mongo;

// if (!cached) {
//   cached = global._mongo = { conn: null };
// }

// export async function connectDB() {
//   if (!cached.conn) {
//     cached.conn = await client.connect();
//     console.log("✅ MongoDB Connected");
//   }

//   return cached.conn.db("ai_interview_system");
// }