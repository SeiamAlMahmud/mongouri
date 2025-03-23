import connectDB from "@/utils/dbConnect";
import mongoose from "mongoose";

export async function GET(req, res) {
  try {
    await connectDB();

    const adminDB = await mongoose.createConnection(process.env.MONGODB_URI, {
      dbName: 'admin',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Get the list of databases
    const databases = await adminDB.db.admin().listDatabases();

    return res.status(200).json({ databaseCount: databases.databases.length });
  } catch (error) {
    console.error('Error fetching database stats:', error);
    return res.status(500).json({ error: 'Server Error' });
  }
}
