import connectDB from "@/utils/dbConnect";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB();

    // Connect to the MongoDB admin database
    const adminDB = await mongoose.createConnection(process.env.MONGODB_URI, {
      dbName: "admin",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Get the list of databases
    const databases = await adminDB.db.admin().listDatabases();

    // Return the number of databases
    return new Response(JSON.stringify({ databaseCount: databases.databases.length }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching database stats:", error);
    return new Response(JSON.stringify({ error: "Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
