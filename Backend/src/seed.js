import connectToDatabase from "./config/database.config.js";
import { User } from "./models/user.module.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const seedAdmin = async () => {
    try {
        await connectToDatabase();

        const adminEmail = "admin@example.com";
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log("Admin user already exists.");
        } else {
            const adminUser = await User.create({
                name: "Admin User",
                email: adminEmail,
                password: "admin123",
                role: "admin"
            });
            console.log("Admin user created successfully.");
        }

    } catch (error) {
        console.error("Error seeding admin:", error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

seedAdmin();
