import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { buildR2ObjectPublicUrl, r2 } from '@/lib/r2';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileName = `${nanoid()}-${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    });

    console.log('Subiendo archivo:', fileName, 'a bucket:', process.env.R2_BUCKET_NAME);
    await r2.send(command);
    console.log('Archivo subido exitosamente');

    const publicUrl = buildR2ObjectPublicUrl(fileName);
    console.log('URL generada:', publicUrl);
    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Error uploading image', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
