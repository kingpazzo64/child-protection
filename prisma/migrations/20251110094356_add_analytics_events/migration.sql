-- CreateTable
CREATE TABLE "public"."analytics_events" (
    "id" TEXT NOT NULL,
    "userId" INTEGER,
    "eventType" TEXT NOT NULL,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "analytics_events_timestamp_idx" ON "public"."analytics_events"("timestamp");

-- CreateIndex
CREATE INDEX "analytics_events_eventType_idx" ON "public"."analytics_events"("eventType");

-- CreateIndex
CREATE INDEX "analytics_events_userId_idx" ON "public"."analytics_events"("userId");

-- AddForeignKey
ALTER TABLE "public"."analytics_events" ADD CONSTRAINT "analytics_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
