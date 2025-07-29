import { relations, sql } from "drizzle-orm";
import {
    pgTable,
    varchar,
    timestamp,
    boolean,
    pgEnum,
    text,
    index,
    integer,
    uuid,
    uniqueIndex,
    jsonb,
    doublePrecision
} from "drizzle-orm/pg-core";

// enums
export const roleEnum = pgEnum('role', ['admin', 'user', 'member']);
export const userThemeEnum = pgEnum('user_theme', ['light', 'dark', 'system']);
// user
export const UserSchema = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    username: varchar('username').notNull().unique(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    profilePicture: varchar('profile_picture'),
    bio: text('bio'),
    fileUrl: jsonb('file_url').$type<any[]>().notNull().default(sql`'[]'::jsonb`),
    website: text('website').array().notNull().default(sql`'{}'::text[]`),
    publicKey: text('public_key').notNull(),
    lastStatusUpdate: timestamp('last_status_update'),
    isPrivate: boolean('is_private').notNull().default(false),
    isVerified: boolean('is_verified').notNull().default(false),
}, (users) => ({
    uniqueIdx: uniqueIndex('unique_idx').on(users.email),
    usernameIdx: uniqueIndex('username_idx').on(users.username),
    emailUsernameIdx: uniqueIndex('email_username_idx').on(users.email, users.username)
}))

export const AccountSchema = pgTable('account', {
    id: uuid('user_id').notNull().references(() => UserSchema.id, { onDelete: 'cascade', onUpdate: 'cascade' }).primaryKey(),
    roles: roleEnum('roles').array().notNull().default(sql`ARRAY['user']::role[]`),
    // address
    latitude: doublePrecision('latitude'),
    longitude: doublePrecision('longitude'),
    city: varchar('city', { length: 100 }),
    country: varchar('country', { length: 100 }),
    locale: varchar('locale'),
    timeZone: integer('time_zone').default(12),
    // additional fields 
    phone: integer('phone'),
    // Used to lock the user account
    privateKey: text('private_key').notNull(),
    locked: boolean('locked').notNull().default(false),
    accessTokenExpires: timestamp('access_token_expires'),
    AccessToken: varchar('access_token').array(),
    RefreshToken: varchar('refresh_token').array(),
    // Used to verify the user account
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
}, (users) => ({
    uniqueIdx: index('user_account_idx').on(users.id),
}))

export const UserSettingsSchema = pgTable('user_settings', {
    id: uuid('user_id').notNull().references(() => UserSchema.id, { onDelete: 'cascade', onUpdate: 'cascade' }).primaryKey(),
    theme: userThemeEnum('theme').notNull().default('system'),
    // notificationId: varchar('notification_id').notNull(), 
    // mentions : varchar('mentions').array().notNull().default(sql`'{}'::text[]`),
    // mutedAccounts: varchar('muted_accounts').array().notNull().default(sql`'{}'::text[]`),
    // blocked: varchar('blocked').array().notNull().default(sql`'{}'::text[]`),
    // restricted: varchar('restricted').array().notNull().default(sql`'{}'::text[]`),
    // close: varchar('close').array().notNull().default(sql`'{}'::text[]`),
}, (users) => ({
    uniqueIdx: index('userSetting_idx').on(users.id),
}))

export const UserPasswordSchema = pgTable('user_password', {
    id: uuid('user_id').notNull().references(() => UserSchema.id, { onDelete: 'cascade', onUpdate: 'cascade' }).primaryKey(),
    password: varchar('password').notNull(),
    hash: varchar('hash').notNull(),
}, (users) => ({
    uniqueIdx: index('user_password_idx').on(users.id),
}))

export const Session = pgTable('session', {
    id: uuid('user_id').notNull().references(() => UserSchema.id, { onDelete: 'cascade', onUpdate: 'cascade' }).primaryKey(),
    sessionToken: varchar('session_token').unique(),
    expires: timestamp('expires').notNull(),
}, (session) => ({
    uniqueIdx: index('user_session_idx').on(session.id),
}))


export const UserRelations = relations(UserSchema, ({ one, many }) => ({
    account: one(AccountSchema, {
        fields: [UserSchema.id],
        references: [AccountSchema.id],
    }),
    settings: one(UserSettingsSchema, {
        fields: [UserSchema.id],
        references: [UserSettingsSchema.id],
    }),
    password: one(UserPasswordSchema, {
        fields: [UserSchema.id],
        references: [UserPasswordSchema.id],
    }),
    sessions: many(Session),
}));


export const AccountRelations = relations(AccountSchema, ({ one }) => ({
    user: one(UserSchema, {
        fields: [AccountSchema.id],
        references: [UserSchema.id],
    }),
}));

export const UserSettingsRelations = relations(UserSettingsSchema, ({ one }) => ({
    user: one(UserSchema, {
        fields: [UserSettingsSchema.id],
        references: [UserSchema.id],
    }),
}));

export const UserPasswordRelations = relations(UserPasswordSchema, ({ one }) => ({
    user: one(UserSchema, {
        fields: [UserPasswordSchema.id],
        references: [UserSchema.id],
    }),
}));


export const SessionRelations = relations(Session, ({ one }) => ({
    user: one(UserSchema, {
        fields: [Session.id],
        references: [UserSchema.id],
    }),
}));