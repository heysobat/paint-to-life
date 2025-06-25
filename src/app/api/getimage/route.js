import { readFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';

export async function GET(req) {
  try {
    const framesFilePath = path.join(process.cwd(), '/public/frames.json');
    const framesData = JSON.parse(await readFile(framesFilePath, 'utf-8'));

    return new Response(JSON.stringify(framesData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Error retrieving frames:', err);
    return new Response(JSON.stringify({ message: 'Failed to retrieve frames' }), { status: 500 });
  }
}