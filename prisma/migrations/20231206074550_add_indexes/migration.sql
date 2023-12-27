-- CreateIndex
CREATE INDEX "Report_id_title_content_createdAt_updatedAt_authorId_isPost_idx" ON "Report"("id", "title", "content", "createdAt", "updatedAt", "authorId", "isPosted");

-- CreateIndex
CREATE INDEX "User_id_email_username_idx" ON "User"("id", "email", "username");
