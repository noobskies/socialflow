# Phase 9F12: Products Integration (External Systems)

**Part of Phase 9F: Complete Mock Data Migration**

---

## Overview

Integrate product data from external e-commerce platforms (Shopify, WooCommerce), migrating from `MOCK_PRODUCTS` to real API. This enables the Composer feature's product picker for promotional content.

### What This Enables

- Sync products from Shopify/WooCommerce
- Product picker in Composer
- Automated product posts
- Inventory tracking
- Price updates
- Product catalogs

---

## Current vs Target State

### Current (Mock)
```typescript
// constants.ts
export const MOCK_PRODUCTS: Product[] = [/* hardcoded */];

// ProductPickerModal.tsx
const [products, setProducts] = useState(MOCK_PRODUCTS);
```

### Target (Real Integration)
```typescript
// AppContext.tsx
const [products, setProducts] = useState<Product[]>([]);
useEffect(() => {
  fetch('/api/products').then(res => res.json()).then(data => setProducts(data.products));
}, []);
```

---

## Integration Strategy

### Option 1: Direct API Integration (Recommended for MVP)

Keep `MOCK_PRODUCTS` for MVP and add real integration in Phase 10+.

**Rationale**:
- External dependencies add complexity
- Requires merchant accounts (Shopify, WooCommerce)
- OAuth setup for each platform
- Webhook management
- Cache invalidation strategies
- Not critical for MVP functionality

### Option 2: Cached Product Sync (If Needed Now)

Create a lightweight caching layer that syncs products periodically.

---

## Minimal API Implementation (Option 2)

### Step 1: Add Products Cache Table (10 min)

```prisma
model ProductCache {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  externalId  String   // ID from e-commerce platform
  source      String   // "shopify", "woocommerce"
  
  name        String
  price       String
  description String   @db.Text
  image       String?
  inventory   Int      @default(0)
  
  metadata    Json?    // Additional platform data
  
  syncedAt    DateTime @default(now())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([userId, externalId, source])
  @@index([userId])
  @@index([source])
  @@map("product_cache")
}
```

---

### Step 2: Products API (20 min)

**File**: `src/app/api/products/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/products
 * List cached products for user
 */
export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const source = searchParams.get('source'); // Filter by source

    const where: any = { userId: user!.id };

    if (source) {
      where.source = source;
    }

    const products = await prisma.productCache.findMany({
      where,
      orderBy: { syncedAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({
      products,
      count: products.length,
      lastSync: products[0]?.syncedAt,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products/sync
 * Trigger manual product sync
 */
export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const { source } = body; // "shopify" or "woocommerce"

    // Get integration credentials
    // const credentials = await getIntegrationCredentials(user!.id, source);

    // Fetch products from external API
    // const externalProducts = await fetchFromShopify(credentials);

    // Sync to cache
    // for (const product of externalProducts) {
    //   await prisma.productCache.upsert({
    //     where: {
    //       userId_externalId_source: {
    //         userId: user!.id,
    //         externalId: product.id,
    //         source,
    //       },
    //     },
    //     update: { ...product, syncedAt: new Date() },
    //     create: { ...product, userId: user!.id, source },
    //   });
    // }

    return NextResponse.json({
      message: 'Products synced successfully',
      count: 0, // externalProducts.length
    });
  } catch (error) {
    console.error('Error syncing products:', error);
    return NextResponse.json(
      { error: 'Failed to sync products' },
      { status: 500 }
    );
  }
}
```

---

### Step 3: Shopify Integration (Phase 10+)

**File**: `src/lib/integrations/shopify.ts`

```typescript
/**
 * Shopify integration (implement in Phase 10+)
 */
export async function fetchShopifyProducts(credentials: {
  shopUrl: string;
  accessToken: string;
}) {
  const url = `https://${credentials.shopUrl}/admin/api/2024-01/products.json`;

  const response = await fetch(url, {
    headers: {
      'X-Shopify-Access-Token': credentials.accessToken,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Shopify products');
  }

  const data = await response.json();

  return data.products.map((product: any) => ({
    externalId: product.id.toString(),
    name: product.title,
    price: product.variants[0]?.price || '0.00',
    description: product.body_html || '',
    image: product.images[0]?.src,
    inventory: product.variants.reduce(
      (sum: number, v: any) => sum + (v.inventory_quantity || 0),
      0
    ),
  }));
}
```

---

## Recommendation: Keep Mock Data for MVP

**For MVP deployment, KEEP `MOCK_PRODUCTS`** and implement real integration in Phase 10+.

### Reasons:
1. **Not blocking**: Product picker works with mock data
2. **External dependencies**: Requires merchant accounts
3. **Complex setup**: OAuth, webhooks, rate limiting
4. **Maintenance overhead**: Multiple API versions
5. **Testing difficulty**: Sandbox environments needed

### Migration Path (Phase 10+):
1. Set up Shopify/WooCommerce developer accounts
2. Implement OAuth flow
3. Create webhook handlers
4. Build sync jobs
5. Add cache invalidation
6. Test with real merchant data

---

## Add to AppContext (5 min) - Optional

**File**: `src/app/_components/AppContext.tsx`

```typescript
interface AppContextType {
  // ... existing fields

  // Products (can stay mock for MVP)
  products: Product[];
  productsLoading: boolean;
  productsError: string | null;
  refetchProducts: () => Promise<void>;
}
```

---

## Cleanup Decision

### Option A: Keep Mock Data (Recommended)
```typescript
// Keep in constants.ts
export const MOCK_PRODUCTS: Product[] = [/* ... */];
```

### Option B: Remove Mock Data
```typescript
// DELETE from constants.ts if implementing real integration
// export const MOCK_PRODUCTS = [/* ... */];
```

---

## Time Estimate

**Option 1** (Keep Mock - Recommended): 0 hours
**Option 2** (Basic Integration): ~2-3 hours  
**Full Integration** (Phase 10+): ~8-10 hours

- Shopify OAuth setup: 2 hours
- WooCommerce integration: 2 hours
- Webhook handlers: 2 hours
- Sync jobs & caching: 2 hours
- Testing & debugging: 2 hours

---

## Success Criteria

### For MVP (Option 1 - Keep Mock):
- [ ] MOCK_PRODUCTS remains in constants.ts
- [ ] ProductPickerModal works with mock data
- [ ] Document future integration plan
- [ ] No breaking changes to product interface

### For Full Integration (Phase 10+):
- [ ] Products sync from Shopify/WooCommerce
- [ ] Webhook updates product cache
- [ ] Product picker shows real inventory
- [ ] Price updates reflect in UI
- [ ] Image URLs load correctly
- [ ] Sync jobs run periodically

---

## Next Steps

### Recommended Path (MVP):
1. **Skip implementation** - Keep MOCK_PRODUCTS
2. Continue to **phase9f13_workflows_api.md** (Workflows)
3. Document integration plan for Phase 10+

### If Implementing Now:
1. Set up Shopify partner account
2. Create test store
3. Implement OAuth flow
4. Build sync mechanism
5. Test thoroughly

---

**Status**: 
- **MVP**: No implementation needed (0 hours)
- **Full Integration**: Phase 10+ (~8-10 hours)

**Recommendation**: Keep mock data, defer to Phase 10+
