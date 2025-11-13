"use server";

import User from "@/models/User";
import { createSession, deleteSession } from "@/lib/session";
import bcrypt from "bcrypt";
import { connectToDB } from "@/lib/mongodb";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/emails/EmailTemplate";
import { PasswordResetTemplate } from "@/components/emails/PasswordResetTemplate";
import PasswordReset from "@/models/PasswordReset";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function registerUserAction(formData: FormData) {
    try {
        await connectToDB()
        const username = formData.get("username") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        // Validate required fields
        if (!username || !email || !password) {
            throw new Error("All fields are required");
        }

        // Check if user already exists by email
        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            throw new Error("User with this email already exists");
        }

        // Check if user already exists by username
        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            throw new Error("Username is already taken");
        }

        // Hash the password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create the user with hashed password
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role: "user"
        });

        // Create session with user role
        await createSession(user._id.toString(), user.role);

        await resend.emails.send({
            from: 'Snackly <no-reply@snackly.site>',
            to: [email],
            subject: 'Welcome to Snackly',
            react: EmailTemplate({ firstName: username }),
        });

        return {
            success: true,
            data: JSON.parse(JSON.stringify(user))
        };

    } catch (error) {
        console.error("Registration error:", error);

        if (error instanceof Error) {
            return {
                success: false,
                error: error.message
            };
        }

        return {
            success: false,
            error: "An unexpected error occurred during registration"
        };
    }
}

export async function loginUserAction(formData: FormData) {
    await connectToDB()

    try {
        const emailOrUsername = formData.get("emailOrUsername") as string;
        const password = formData.get("password") as string;

        // Validate required fields
        if (!emailOrUsername || !password) {
            throw new Error("Email/Username and password are required");
        }

        // Find user by email or username
        const user = await User.findOne({
            $or: [
                { email: emailOrUsername },
                { username: emailOrUsername }
            ]
        });

        if (!user) {
            throw new Error("Invalid email/username or password");
        }

        // Compare password with hashed password in database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error("Invalid email/username or password");
        }

        // Create session with user role
        await createSession(user._id.toString(), user.role);

        return {
            success: true,
            data: JSON.parse(JSON.stringify(user))
        };

    } catch (error) {
        console.error("Login error:", error);

        if (error instanceof Error) {
            return {
                success: false,
                error: error.message
            };
        }

        return {
            success: false,
            error: "An unexpected error occurred during login"
        };
    }
}

export async function logoutUserAction() {
    try {
        await deleteSession();
        return { success: true };
    } catch (error) {
        console.error("Logout error:", error);
        return {
            success: false,
            error: "An unexpected error occurred during logout"
        };
    }
}

// Function to promote a user to admin (for testing purposes)
export async function promoteToAdminAction(userId: string) {
    try {
        await connectToDB();
        const user = await User.findByIdAndUpdate(
            userId,
            { role: 'admin' },
            { new: true }
        );

        if (!user) {
            throw new Error("User not found");
        }

        return {
            success: true,
            data: JSON.parse(JSON.stringify(user))
        };
    } catch (error) {
        console.error("Promote to admin error:", error);

        if (error instanceof Error) {
            return {
                success: false,
                error: error.message
            };
        }

        return {
            success: false,
            error: "An unexpected error occurred while promoting user"
        };
    }
}

export async function changePasswordAction(formData: FormData) {
    try {
        await connectToDB();
        
        const currentPassword = formData.get("currentPassword") as string;
        const newPassword = formData.get("newPassword") as string;
        const confirmNewPassword = formData.get("confirmNewPassword") as string;
        const userId = formData.get("userId") as string;

        // Validate required fields
        if (!currentPassword || !newPassword || !confirmNewPassword || !userId) {
            throw new Error("All fields are required");
        }

        // Check if new passwords match
        if (newPassword !== confirmNewPassword) {
            throw new Error("New passwords don't match");
        }

        // Check if new password is different from current password
        if (currentPassword === newPassword) {
            throw new Error("New password must be different from current password");
        }

        // Validate new password length
        if (newPassword.length < 8) {
            throw new Error("New password must be at least 8 characters long");
        }

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new Error("Current password is incorrect");
        }

        // Hash the new password
        const saltRounds = 12;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update user password
        await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

        return {
            success: true,
            message: "Password changed successfully"
        };

    } catch (error) {
        console.error("Change password error:", error);

        if (error instanceof Error) {
            return {
                success: false,
                error: error.message
            };
        }

        return {
            success: false,
            error: "An unexpected error occurred while changing password"
        };
    }
}

export async function requestPasswordResetAction(formData: FormData) {
    try {
        await connectToDB();
        
        const email = formData.get("email") as string;

        // Validate email
        if (!email) {
            throw new Error("Email is required");
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            // For security reasons, don't reveal if email exists or not
            return {
                success: true,
                message: "If an account with that email exists, a password reset link has been sent"
            };
        }

        // Generate unique token
        const token = crypto.randomBytes(32).toString('hex');
        
        // Set expiration (1 hour from now)
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);

        // Delete any existing unused tokens for this email
        await PasswordReset.deleteMany({ email, used: false });

        // Create new password reset record
        await PasswordReset.create({
            email,
            token,
            expiresAt,
            used: false
        });

        // Send email with reset link
        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
        
        await resend.emails.send({
            from: 'Snackly <no-reply@snackly.site>',
            to: [email],
            subject: 'Password Reset Request',
            react: PasswordResetTemplate({ 
                firstName: user.username,
                resetLink: resetLink
            }),
        });

        return {
            success: true,
            message: "If an account with that email exists, a password reset link has been sent"
        };

    } catch (error) {
        console.error("Password reset request error:", error);

        if (error instanceof Error) {
            return {
                success: false,
                error: error.message
            };
        }

        return {
            success: false,
            error: "An unexpected error occurred while processing your request"
        };
    }
}

export async function resetPasswordAction(formData: FormData) {
    try {
        await connectToDB();
        
        const token = formData.get("token") as string;
        const newPassword = formData.get("newPassword") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        // Validate required fields
        if (!token || !newPassword || !confirmPassword) {
            throw new Error("All fields are required");
        }

        // Check if passwords match
        if (newPassword !== confirmPassword) {
            throw new Error("Passwords don't match");
        }

        // Validate password length
        if (newPassword.length < 8) {
            throw new Error("Password must be at least 8 characters long");
        }

        // Find valid password reset token
        const passwordReset = await PasswordReset.findOne({
            token,
            used: false,
            expiresAt: { $gt: new Date() }
        });

        if (!passwordReset) {
            throw new Error("Invalid or expired reset token");
        }

        // Find user by email
        const user = await User.findOne({ email: passwordReset.email });
        if (!user) {
            throw new Error("User not found");
        }

        // Hash the new password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update user password
        await User.findByIdAndUpdate(user._id, { password: hashedPassword });

        // Mark token as used
        await PasswordReset.findByIdAndUpdate(passwordReset._id, { used: true });

        return {
            success: true,
            message: "Password reset successfully"
        };

    } catch (error) {
        console.error("Password reset error:", error);

        if (error instanceof Error) {
            return {
                success: false,
                error: error.message
            };
        }

        return {
            success: false,
            error: "An unexpected error occurred while resetting password"
        };
    }
}
