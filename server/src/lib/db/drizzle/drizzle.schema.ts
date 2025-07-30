import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  serial,
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
  doublePrecision,
} from "drizzle-orm/pg-core";
import { generateRandomString } from "src/lib/id-generator";

// Enums
export const roleEnum = pgEnum("role", ["admin", "user", "member"]);
export const userThemeEnum = pgEnum("user_theme", ["light", "dark", "system"]);
export const quizStatusEnum = pgEnum("quiz_status", ["waiting", "active", "ended"]);

// Users
export const UserSchema = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  profilePicture: varchar("profile_picture"),
  bio: text("bio"),
  fileUrl: jsonb("file_url").$type<any[]>().notNull().default(sql.raw("'[]'::jsonb")),
  website: text("website").array().notNull().default(sql.raw("'{}'::text[]")),
  publicKey: text("public_key").notNull(),
  lastStatusUpdate: timestamp("last_status_update"),
  isPrivate: boolean("is_private").notNull().default(false),
  isVerified: boolean("is_verified").notNull().default(false),
}, (users) => ({
  usernameIdx: uniqueIndex("username_idx").on(users.username),
  emailIdx: uniqueIndex("email_idx").on(users.email),
  emailUsernameIdx: uniqueIndex("email_username_idx").on(users.email, users.username),
}));

// Account
export const AccountSchema = pgTable("account", {
  id: integer("user_id").notNull().primaryKey().references(() => UserSchema.id, { onDelete: "cascade", onUpdate: "cascade" }),
  roles: roleEnum("roles").array().notNull().default(sql.raw("ARRAY['user']::role[]")),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  city: varchar("city", { length: 100 }),
  country: varchar("country", { length: 100 }),
  locale: varchar("locale", { length: 20 }),
  timeZone: integer("time_zone").default(12),
  phone: integer("phone"),
  privateKey: text("private_key").notNull(),
  locked: boolean("locked").notNull().default(false),
  accessTokenExpires: timestamp("access_token_expires"),
  AccessToken: varchar("access_token").array(),
  RefreshToken: varchar("refresh_token").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(() => new Date()),
}, (account) => ({
  accountIdx: index("user_account_idx").on(account.id),
}));

// User Settings
export const UserSettingsSchema = pgTable("user_settings", {
  id: integer("user_id").notNull().primaryKey().references(() => UserSchema.id, { onDelete: "cascade", onUpdate: "cascade" }),
  theme: userThemeEnum("theme").notNull().default("system"),
}, (settings) => ({
  settingsIdx: index("user_settings_idx").on(settings.id),
}));

// Password
export const UserPasswordSchema = pgTable("user_password", {
  id: integer("user_id").notNull().primaryKey().references(() => UserSchema.id, { onDelete: "cascade", onUpdate: "cascade" }),
  password: varchar("password").notNull(),
  hash: varchar("hash").notNull(),
}, (password) => ({
  passwordIdx: index("user_password_idx").on(password.id),
}));

// Sessions
export const SessionSchema = pgTable("session", {
  id: integer("user_id").notNull().primaryKey().references(() => UserSchema.id, { onDelete: "cascade", onUpdate: "cascade" }),
  sessionToken: varchar("session_token").unique(),
  expires: timestamp("expires").notNull(),
}, (session) => ({
  sessionIdx: index("user_session_idx").on(session.id),
}));

// Rooms
export const RoomSchema = pgTable("rooms", {
  id: serial("id").primaryKey(),
  code: text('code').$defaultFn(() =>
    generateRandomString({ length: 10, type: "lowernumeric" })
  ),
  hostId: varchar("host_id", { length: 10 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  status: quizStatusEnum("status").default("waiting"),
});


// --- Relations ---
export const UserRelations = relations(UserSchema, ({ one, many }) => ({
  account: one(AccountSchema, { fields: [UserSchema.id], references: [AccountSchema.id] }),
  settings: one(UserSettingsSchema, { fields: [UserSchema.id], references: [UserSettingsSchema.id] }),
  password: one(UserPasswordSchema, { fields: [UserSchema.id], references: [UserPasswordSchema.id] }),
  sessions: many(SessionSchema),
}));

export const AccountRelations = relations(AccountSchema, ({ one }) => ({
  user: one(UserSchema, { fields: [AccountSchema.id], references: [UserSchema.id] }),
}));

export const UserSettingsRelations = relations(UserSettingsSchema, ({ one }) => ({
  user: one(UserSchema, { fields: [UserSettingsSchema.id], references: [UserSchema.id] }),
}));

export const UserPasswordRelations = relations(UserPasswordSchema, ({ one }) => ({
  user: one(UserSchema, { fields: [UserPasswordSchema.id], references: [UserSchema.id] }),
}));

export const SessionRelations = relations(SessionSchema, ({ one }) => ({
  user: one(UserSchema, { fields: [SessionSchema.id], references: [UserSchema.id] }),
}));
