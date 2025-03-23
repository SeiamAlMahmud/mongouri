import { MongoClient } from "mongodb";

export async function POST(req) {
  try {
    console.log("Connecting to MongoDB...");

    const client = new MongoClient(process.env.MONGODB_URI);

    await client.connect();

    const { dbName = "test", userName, password } = await req.json();

    // Validate input fields
    if (!dbName || !userName || !password) {
      console.error("Missing fields:", { dbName, userName, password });
      return new Response(
        JSON.stringify({
          error: "Database name, username, and password are required",
        }),
        { status: 400 }
      );
    }

    console.log("Connected to MongoDB");

    const adminDb = client.db("admin"); // Access the admin database
    const maxSize = 50 * 1024 * 1024; // 50 MB in bytes
    // Create the new database by inserting a dummy document into a collection of the target database
    const newDbCollection = client.db(dbName).collection("dummyCollection", {
      capped: true,
      size: maxSize,
    }); // Create a collection in the new database
    await newDbCollection.insertOne({ dummy: "data" });

    console.log(`Creating user: ${userName} for database ${dbName}`);

    // Create a user for the new database with restricted access
    await adminDb.command({
      createUser: userName,
      pwd: password,
      roles: [{ role: "dbOwner", db: dbName }],
    });

    console.log("Database and user created successfully");

    // Close the client connection after operations
    await client.close();

    return new Response(
      JSON.stringify({
        message: "Database and user created",
        dbName,
        userName,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating database:", error);
    return new Response(JSON.stringify({ error: "Server Error, try again" }), {
      status: 500,
    });
  }
}
