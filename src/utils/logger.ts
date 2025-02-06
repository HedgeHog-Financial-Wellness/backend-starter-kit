import { pino } from "pino";

export const systemLogger = pino({ name: "system" });