import { boolean, integer, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const tasksTable = pgTable("tasks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  done: boolean("done").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const selectTasksSchema = createSelectSchema(tasksTable);
export const createTaskSchema = createInsertSchema(tasksTable, {
  name: schema => schema.min(1).max(500),
})
  .required({
    done: true,
  })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

export const patchTaskSchema = createTaskSchema.partial();

export const ideaStatusEnum = pgEnum("idea_status", ["draft", "voting", "done"]);
// ideas table
export const ideasTable = pgTable("ideas", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  slug: text("slug").notNull(),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  status: ideaStatusEnum("status").notNull().default("draft"),
  rating: integer("rating").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const createIdeaSchemaReqBody = createInsertSchema(ideasTable, {
  title: schema => schema.min(1).max(100),
  description: schema => schema.min(1).max(500),
})
  .omit({
    id: true,
    slug: true,
    startTime: true,
    endTime: true,
    status: true,
    rating: true,
    createdAt: true,
    updatedAt: true,
  });

export const createIdeaSchemaResBody = createInsertSchema(ideasTable)
  .omit({
    id: true,
    startTime: true,
    endTime: true,
    rating: true,
    createdAt: true,
    updatedAt: true,
  });
