import { createBucketClient } from '@cosmicjs/sdk';
import 'dotenv/config';
import products from '../data/products.json';

// API-variabler (finns i .env):
const COSMIC_BUCKET_SLUG = process.env.COSMIC_BUCKET_SLUG;
const COSMIC_READ_KEY = process.env.COSMIC_READ_KEY;
const COSMIC_WRITE_KEY = process.env.COSMIC_WRITE_KEY;

// initierar cosmic och sätter dit ! för att undvika typescript tjafs:
const cosmic = createBucketClient({
  bucketSlug: COSMIC_BUCKET_SLUG!,
  readKey: COSMIC_READ_KEY!,
  writeKey: COSMIC_WRITE_KEY!,
});

const allProducts = products;

export async function addAllProductsToCosmic() {
  for (const product of allProducts) {
    try {
      await cosmic.objects.insertOne(product);
      console.log(`Lade till: ${product.title}`);
    } catch (error) {
      console.error(`Fel vid uppladdning av ${product.title}:`, error);
    }
  }
}

addAllProductsToCosmic();
