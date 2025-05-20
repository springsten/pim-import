import { createBucketClient } from '@cosmicjs/sdk';
import 'dotenv/config';
import {
  getCategoryIdFromDatabase,
  getProductIdFromDatabase,
  insertCategory,
  insertProduct,
  updateCategory,
  updateProduct,
} from './database/database';
import { initDb } from './database/db';
import { exit } from 'process';

// initiera databasen:
initDb();

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

//initiera cosmic response
let cosmic_response_categories = await cosmic.objects
  .find({
    type: 'categories',
  })
  .sort('created_at asc')
  .limit(100);

// Category-funktioner:
for (const pimCategory of cosmic_response_categories.objects) {
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

  console.log('Executed category functions');
}

let cosmic_response_products = await cosmic.objects
  .find({
    type: 'products',
  })
  .sort('created_at asc')
  .limit(100);

for (const pimProduct of cosmic_response_products.objects) {
  console.log(pimProduct);
  console.log(pimProduct.metadata.popularityfactor);

  const productIdInDatabase = await getProductIdFromDatabase(pimProduct.id);

  if (productIdInDatabase === undefined) {
    // INSERT i sql-databas:
    await insertProduct(
      pimProduct.title,
      pimProduct.metadata.price,
      pimProduct.metadata.stocklevel,
      pimProduct.metadata.category,
      pimProduct.metadata.popularityfactor,
      pimProduct.id,
      pimProduct.metadata.active,
      pimProduct.metadata.description
    );
  } else {
    await updateProduct(
      pimProduct.title,
      pimProduct.metadata.price,
      pimProduct.metadata.stocklevel,
      pimProduct.metadata.category,
      pimProduct.metadata.popularityfactor,
      productIdInDatabase.id,
      pimProduct.metadata.active,
      pimProduct.metadata.description
    );
  }
}

exit();
