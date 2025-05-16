import { createBucketClient } from '@cosmicjs/sdk';
import 'dotenv/config';

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

let cosmic_response = await cosmic.objects
  .find({
    type: 'products',
  })
  .sort('created_at asc')
  .limit(10);

console.log(cosmic_response);
console.log(cosmic_response.objects);
