import * as dotenv from 'dotenv';
import { eq, inArray } from 'drizzle-orm';

dotenv.config({ path: '../../.env' });

const CATEGORY_SEEDS = [
  {
    name: 'Grains',
    description: 'Cereal crops including rice, wheat, and maize from Hadejia and surrounding areas.',
  },
  {
    name: 'Legumes',
    description: 'Beans, groundnuts, and other pulse crops common in Jigawa State.',
  },
  {
    name: 'Oilseeds',
    description: 'Oil-bearing seeds such as sesame traded in Hadejia markets.',
  },
  {
    name: 'Roots & Tubers',
    description: 'Root and tuber crops including cassava, yam, and sweet potato.',
  },
] as const;

const PRODUCT_SEEDS = [
  {
    name: 'Hadejia Paddy Rice (50kg)',
    categoryName: 'Grains',
    unit: '50kg bag',
    description: 'Locally grown paddy rice from Hadejia, Jigawa State — 50kg bag.',
  },
  {
    name: 'Jigawa White Wheat (100kg)',
    categoryName: 'Grains',
    unit: '100kg bag',
    description: 'White wheat harvested in Jigawa State — 100kg bag.',
  },
  {
    name: 'Cleaned Sesame Seeds (50kg)',
    categoryName: 'Oilseeds',
    unit: '50kg bag',
    description: 'Cleaned sesame seeds ready for oil processing or export — 50kg bag.',
  },
  {
    name: 'Yellow Maize (100kg)',
    categoryName: 'Grains',
    unit: '100kg bag',
    description: 'Yellow maize suitable for feed and milling — 100kg bag.',
  },
] as const;

async function seed() {
  // Load client after dotenv so DATABASE_URL from .env is available
  const { db, queryClient } = await import('./client');
  const { productCategories, products } = await import('./schema/index');

  console.log('Seeding product categories and sample products...\n');

  try {
    await db.transaction(async (tx) => {
      await tx
        .insert(productCategories)
        .values(CATEGORY_SEEDS.map((c) => ({ name: c.name, description: c.description })))
        .onConflictDoNothing({ target: productCategories.name });

      const categoryRows = await tx
        .select()
        .from(productCategories)
        .where(
          inArray(
            productCategories.name,
            CATEGORY_SEEDS.map((c) => c.name),
          ),
        );

      const categoryIdByName = new Map(categoryRows.map((row) => [row.name, row.id]));

      for (const product of PRODUCT_SEEDS) {
        const categoryId = categoryIdByName.get(product.categoryName);
        if (!categoryId) {
          throw new Error(
            `Missing category "${product.categoryName}" for product "${product.name}"`,
          );
        }

        const existing = await tx
          .select({ id: products.id })
          .from(products)
          .where(eq(products.name, product.name))
          .limit(1);

        if (existing.length > 0) {
          continue;
        }

        await tx.insert(products).values({
          categoryId,
          name: product.name,
          unit: product.unit,
          description: product.description,
        });
      }
    });

    const seededCategories = await db
      .select({
        id: productCategories.id,
        name: productCategories.name,
        description: productCategories.description,
      })
      .from(productCategories)
      .where(
        inArray(
          productCategories.name,
          CATEGORY_SEEDS.map((c) => c.name),
        ),
      );

    const seededProducts = await db
      .select({
        name: products.name,
        unit: products.unit,
        categoryName: productCategories.name,
      })
      .from(products)
      .innerJoin(productCategories, eq(products.categoryId, productCategories.id))
      .where(
        inArray(
          products.name,
          PRODUCT_SEEDS.map((p) => p.name),
        ),
      );

    console.log('Categories:');
    for (const category of seededCategories) {
      console.log(`  - ${category.name}`);
    }

    console.log('\nProducts:');
    for (const product of seededProducts) {
      console.log(`  - ${product.name} [${product.unit}] → ${product.categoryName}`);
    }

    console.log(
      `\nSeed complete: ${seededCategories.length} categories, ${seededProducts.length} products.`,
    );
  } finally {
    await queryClient.end();
  }
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
