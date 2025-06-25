import { writeFile, appendFile, readFile } from 'fs/promises';
import path from 'path';

export async function POST(req) {
  try {
    const { base64, name, frame } = await req.json();
    const buffer = Buffer.from(base64.replace(/^data:image\/png;base64,/, ''), 'base64');

    const filename = `photo_${Date.now()}.png`;
    const filePath = path.join(process.cwd(), 'public/histories', filename);
    await writeFile(filePath, buffer);

    const metadata = {
      name: name || 'Unnamed Image',
      frame: frame || 'No Frame',
      url: `/${filename}`,
      timestamp: Date.now()
    };

    const metadataPath = path.join(process.cwd(), 'public', 'images_metadata.json');

    let existingData = [];
    try {
      const data = await readFile(metadataPath, 'utf-8');
      existingData = JSON.parse(data);
    } catch (err) {
      console.log('No existing metadata file, creating a new one.');
    }

    existingData.push(metadata);

    await writeFile(metadataPath, JSON.stringify(existingData, null, 2));
    return new Response(JSON.stringify({ message: 'Saved', url: `/${filename}`, metadata }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Error saving image:', err);
    return new Response(JSON.stringify({ message: 'Failed to save' }), { status: 500 });
  }
}
