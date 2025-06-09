CREATE INDEX "account_user_id_index" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_token_index" ON "session" USING btree ("token");--> statement-breakpoint
CREATE INDEX "user_id_index" ON "user" USING btree ("id");--> statement-breakpoint
CREATE INDEX "user_email_index" ON "user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "verification_identifier_index" ON "verification" USING btree ("identifier");