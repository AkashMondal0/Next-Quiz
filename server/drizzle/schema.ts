import { pgTable, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const quizStatus = pgEnum("quiz_status", ['waiting', 'active', 'ended'])
export const role = pgEnum("role", ['admin', 'user', 'member'])
export const userTheme = pgEnum("user_theme", ['light', 'dark', 'system'])



