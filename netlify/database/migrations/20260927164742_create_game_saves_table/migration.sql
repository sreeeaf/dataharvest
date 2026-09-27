CREATE TABLE "game_saves" (
	"user_id" text PRIMARY KEY,
	"pseudonym" text,
	"state" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
