import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req) {
  try {
    const { base64 } = await req.json();
    const buffer = Buffer.from(base64.replace(/^data:image\/png;base64,/, ''), 'base64');

    const filename = `photo_${Date.now()}.png`;
    const filePath = path.join(process.cwd(), 'public', filename);

    await writeFile(filePath, buffer);

    return new Response(JSON.stringify({ message: 'Saved', url: `/${filename}` }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Error saving image:', err);
    return new Response(JSON.stringify({ message: 'Failed to save' }), { status: 500 });
  }
}
