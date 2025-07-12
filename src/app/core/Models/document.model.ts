export interface Document {
  id: string;
  fileName: string;
  summary: string;
  keywords: string[];
  category: string;
  uploadedAt: Date;
}
