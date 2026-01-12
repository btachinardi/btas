import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

const sizes = [128, 256, 512]; // 1x, 2x, 4x for different displays

async function optimizeProfileImage() {
  const inputPath = join(rootDir, 'references', 'Bruno Tachinardi - Profile.png');
  const outputDir = join(rootDir, 'public', 'images');

  // Ensure output directory exists
  await mkdir(outputDir, { recursive: true });

  console.log('Optimizing profile image...');
  console.log(`Source: ${inputPath}`);

  for (const size of sizes) {
    // WebP version (best compression)
    const webpOutput = join(outputDir, `profile-${size}.webp`);
    await sharp(inputPath)
      .resize(size, size, { fit: 'cover', position: 'top' })
      .webp({ quality: 85 })
      .toFile(webpOutput);

    const webpStats = await sharp(webpOutput).metadata();
    console.log(`Created: profile-${size}.webp`);

    // PNG fallback for older browsers
    const pngOutput = join(outputDir, `profile-${size}.png`);
    await sharp(inputPath)
      .resize(size, size, { fit: 'cover', position: 'top' })
      .png({ compressionLevel: 9, palette: true })
      .toFile(pngOutput);

    console.log(`Created: profile-${size}.png`);
  }

  // Also create an AVIF version for cutting-edge browsers (even smaller)
  const avifOutput = join(outputDir, 'profile-256.avif');
  await sharp(inputPath)
    .resize(256, 256, { fit: 'cover' })
    .avif({ quality: 80 })
    .toFile(avifOutput);
  console.log('Created: profile-256.avif');

  console.log('\nDone! Optimized images saved to public/images/');
}

optimizeProfileImage().catch(console.error);
