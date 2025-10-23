import { z } from 'zod';

export const LoginUserSchema = z.object({
    email: z.string().nonempty({ message: "Email is required" }).email({ message: "Invalid email" }),
    password: z.string().nonempty({ message: "Password is required" }).min(6, { message: "Password must be at least 6 characters long" })
})

export const RegisterUserSchema = z.object({
    // username -->
    username: z.string().nonempty({ message: "Name is required" })
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(20, { message: "Name must be at most 20 characters long" }),
    // email -->
    email: z.string().nonempty({ message: "Email is required" }).email({ message: "Invalid email" }),
    // password -->
    password: z.string().nonempty({ message: "Password is required" }).min(6, { message: "Password must be at least 6 characters long" })
        .max(20, { message: "Password must be at most 20 characters long" }),
    // profilePicture -->
    name: z.string().nonempty({ message: "Name is required" }).min(3, { message: "Name must be at least 3 characters long" }).max(20, { message: "Name must be at most 20 characters long" }),
    profilePicture: z.string().url({ message: "Invalid URL" }).optional(),
    // coverPicture -->
    coverPicture: z.string().optional(),
    // bio -->
    bio: z.string().max(50, { message: "Bio must be at most 50 characters long" }).optional(),
    // city -->
    city: z.string().max(50, { message: "City must be at most 50 characters long" }).optional(),
    // from -->
    from: z.string().max(50, { message: "From must be at most 50 characters long" }).optional(),
})

export type LoginUserPayload = z.infer<typeof LoginUserSchema>;
export type RegisterUserPayload = z.infer<typeof RegisterUserSchema>;