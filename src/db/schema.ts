/**
 * MindBlink - Cloud SQL (PostgreSQL) Drizzle Schema
 * Relational model mirroring Firestore documents for analytical querying and archiving.
 */

import { pgTable, text, serial, timestamp, integer } from 'drizzle-orm/pg-core';

// 1. Categories Table
export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  subcategories: text('subcategories').array().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// 2. Puzzles Table
export const puzzles = pgTable('puzzles', {
  id: text('id').primaryKey(),
  question: text('question').notNull(),
  imageUrl: text('image_url').notNull(),
  answer: text('answer').notNull(),
  hint: text('hint'),
  category: text('category').notNull(),
  subcategory: text('subcategory').notNull(),
  difficulty: text('difficulty').default('Medium').notNull(),
  publishedAt: timestamp('published_at').defaultNow().notNull()
});

// 3. FCM Push Device Tokens Table
export const fcmTokens = pgTable('fcm_tokens', {
  token: text('token').primaryKey(),
  platform: text('platform').default('web').notNull(),
  registeredAt: timestamp('registered_at').defaultNow().notNull()
});

// 4. Notifications Broadcast Log Table
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  targetUrl: text('target_url'),
  recipientCount: integer('recipient_count').default(0).notNull(),
  sentAt: timestamp('sent_at').defaultNow().notNull()
});
