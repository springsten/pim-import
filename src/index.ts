import { createBucketClient } from '@cosmicjs/sdk';
import 'dotenv/config';
import {
  getCategoryIdFromDatabase,
  insertCategory,
  updateCategory,
} from './database/database';

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

// initiera cosmic response
let cosmic_response = await cosmic.objects
  .find({
    type: 'categories',
  })
  .sort('created_at asc')
  .limit(100);

for (const pimCategory of cosmic_response.objects) {
  console.log(pimCategory);

  const categoryIdInDatabase = await getCategoryIdFromDatabase(pimCategory.id);
  console.log(categoryIdInDatabase);

  if (categoryIdInDatabase === undefined) {
    // INSERT i sql-databas:
    await insertCategory(
      pimCategory.title,
      pimCategory.metadata.description,
      pimCategory.id,
      pimCategory.metadata.active
    );
  } else {
    await updateCategory(
      categoryIdInDatabase.id,
      pimCategory.title,
      pimCategory.metadata.description,
      pimCategory.active
    );
  }
}
