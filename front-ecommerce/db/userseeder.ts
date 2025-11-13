import { registerUserAction, promoteToAdminAction } from "@/actions/auth";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";

export const seedAdminUser = async () => {
    await connectToDB();

    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "adminpassword";

    try {
        // Check if an admin user already exists
        const existingAdmin = await User.findOne({ role: "admin" });
        if (existingAdmin) {
            console.log("Admin user already exists.");
            return;
        }

        // Check if a user with the desired admin email/username already exists
        const existingUser = await User.findOne({ $or: [{ email: adminEmail }, { username: adminUsername }] });
        let userId;

        if (existingUser) {
            console.log(`User with email ${adminEmail} or username ${adminUsername} already exists. Promoting to admin.`);
            userId = existingUser._id.toString();
        } else {
            // Create a new user first
            const formData = new FormData();
            formData.append("username", adminUsername);
            formData.append("email", adminEmail);
            formData.append("password", adminPassword);

            const registrationResult = await registerUserAction(formData);

            if (!registrationResult.success) {
                throw new Error(`Failed to register initial admin user: ${registrationResult.error}`);
            }
            userId = registrationResult.data._id.toString();
            console.log("Initial admin user registered successfully.");
        }

        // Promote the user to admin
        const promoteResult = await promoteToAdminAction(userId);

        if (!promoteResult.success) {
            throw new Error(`Failed to promote user to admin: ${promoteResult.error}`);
        }

        console.log("Admin user created/promoted successfully:");
        console.log(`Username: ${adminUsername}`);
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword} (Please change this immediately!)`);

    } catch (error) {
        console.error("Error seeding admin user:", error);
    }
};

// Execute the seeder function
seedAdminUser();
