import express from 'express';
import path from 'path';

export default async function staticLoader({ app }) {
  // Serve static files from the uploads directory
  app.use('/static', express.static(path.join(process.cwd(), 'static')));
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
}