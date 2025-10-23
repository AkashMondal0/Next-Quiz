import { z } from 'zod';

export const CreateConversationSchema = z.object({
    memberIds: z.array(z.string())
        .min(2, { message: "At least two members are required" })
        .nonempty({ message: "Member IDs array cannot be empty" })
        .default([]),
    isGroup: z.boolean().optional().default(false),
    groupName: z.string().optional(),
    groupDescription: z.string().optional(),
    groupImage: z.string().optional(),
    members_e_key: z.record(z.string(), z.string()).default({}),
});

export const UpdateConversationSchema = z.object({
    memberIds: z.array(z.number())
        .min(2, { message: "At least two members are required" })
        .nonempty({ message: "Member IDs array cannot be empty" })
        .default([]),
});

export const GraphQLPageQuerySchema = z.object({
    offset: z.number().min(0).default(0),
    limit: z.number().min(1).max(100).default(20),
    search: z.string().optional(),
    id: z.string().optional(),
    privateKey: z.string().optional(),
});

export const CreateMessageSchema = z.object({
    content: z.string().min(1, { message: "Content cannot be empty" }),
    authorId: z.string().min(1, { message: "Author ID is required" }),
    conversationId: z.string().min(1, { message: "Conversation ID is required" }),
    fileUrl: z.array(z.record(z.string(), z.any())).optional().default([]),
    members: z.array(z.string()).min(2, { message: "At least two members are required" }).default([]),
    membersPublicKey: z.record(z.string(), z.string()).default({}),
});

export type CreateMessagePayload = z.infer<typeof CreateMessageSchema>;
export type CreateConversationPayload = z.infer<typeof CreateConversationSchema>;
export type UpdateConversationPayload = z.infer<typeof UpdateConversationSchema>;
export type GraphQLPageQueryPayload = z.infer<typeof GraphQLPageQuerySchema>;