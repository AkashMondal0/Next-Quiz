import { sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  timestamp,
  boolean,
  pgEnum,
  text,
  index,
  integer,
  uniqueIndex,
  jsonb,
  doublePrecision,
} from "drizzle-orm/pg-core";
import { generateRandomString } from "src/lib/id-generator";
export type EncryptedKeys = {
  [key: string]: string;
};
export const notificationEnum = pgEnum("notification_type", [
  "comment",
  "reply",
  "like",
  "dislike",
  "subscription",
  "video_upload",
]);
export const roleEnum = pgEnum("role", ["admin", "user", "member"]);
export const userThemeEnum = pgEnum("user_theme", ["light", "dark", "system"]);
export const reportReasonEnum = pgEnum("report_reason", [
  "spam",
  "harassment",
  "copyright",
  "other",
]);

// Users
export const UserSchema = pgTable("users", {
  id: uuid('id').defaultRandom().primaryKey(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  profilePicture: text("profile_picture"),
  bio: text("bio"),
  fileUrl: jsonb("file_url").$type<any[]>().notNull().default(sql.raw("'[]'::jsonb")),
  website: text("website").array().notNull().default(sql.raw("'{}'::text[]")),
  publicKey: text("public_key").notNull(),
  lastStatusUpdate: timestamp("last_status_update"),
  isPrivate: boolean("is_private").notNull().default(false),
  isVerified: boolean("is_verified").notNull().default(false),
}, (users) => [
  uniqueIndex("username_idx").on(users.username),
  uniqueIndex("email_idx").on(users.email),
  uniqueIndex("email_username_idx").on(users.email, users.username),
]);

// Account
export const AccountSchema = pgTable("account", {
  id: uuid("user_id").notNull().primaryKey().references(() => UserSchema.id, { onDelete: "cascade", onUpdate: "cascade" }),
  roles: roleEnum("roles").array().notNull().default(sql.raw("ARRAY['user']::role[]")),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  city: text("city"),
  country: text("country"),
  locale: text("locale"),
  timeZone: integer("time_zone").default(12),
  phone: text("phone"), // changed to text to support international formats
  cc: text("cc"), // country code
  privateKey: text("private_key").notNull(),
  locked: boolean("locked").notNull().default(false),
  accessTokenExpires: timestamp("access_token_expires"),
  accessToken: text("access_token").array(), // normalized names to lowerCamel
  refreshToken: text("refresh_token").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(() => new Date()),
}, (account) => [
  index("user_account_idx").on(account.id)
]);

// User Settings
export const UserSettingsSchema = pgTable("user_settings", {
  id: uuid("user_id").notNull().primaryKey().references(() => UserSchema.id, { onDelete: "cascade", onUpdate: "cascade" }),
  theme: userThemeEnum("theme").notNull().default("system"),
}, (settings) => [
  index("user_settings_idx").on(settings.id)
]);

// Password
export const UserPasswordSchema = pgTable("user_password", {
  id: uuid("user_id").notNull().primaryKey().references(() => UserSchema.id, { onDelete: "cascade", onUpdate: "cascade" }),
  password: text("password").notNull(),
  hash: text("hash").notNull(),
}, (password) => [
  index("user_password_idx").on(password.id)
]);

// Sessions
export const SessionSchema = pgTable("session", {
  id: uuid("user_id").notNull().primaryKey().references(() => UserSchema.id, { onDelete: "cascade", onUpdate: "cascade" }),
  sessionToken: text("session_token").unique(),
  expires: timestamp("expires").notNull(),
}, (session) => [
  index("user_session_idx").on(session.id)
]);