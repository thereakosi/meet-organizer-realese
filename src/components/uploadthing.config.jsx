// uploadthing.config.ts
import { generateUploadThing } from "uploadthing/client";

export const uploadFiles = generateUploadThing({
  endpoint: "meetingFiles",
  config: {
    maxFileSize: "4MB",
    maxFileCount: 1,
    allowedFileTypes: ["image/*", "application/pdf"],
  },
});
