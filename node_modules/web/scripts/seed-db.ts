// Run with: npx tsx apps/web/scripts/seed-db.ts

import * as dotenv from 'dotenv';
import { db } from '../lib/db';
import { tenants, users, projects, risks, changeOrders } from '../lib/db/schema';
import { v4 as uuidv4 } from 'uuid';

// Load env from .env.local if possible
dotenv.config({ path: 'apps/web/.env.local' });

async function seed() {
  if (!process.env.POSTGRES_URL) {
    console.error('❌ POSTGRES_URL not found. Please run "vercel env pull .env.local" first.');
    process.exit(1);
  }

  console.log('🌱 Seeding database with dummy construction data...');

  try {
    // 1. Create a Tenant (Construction Company)
    const tenantId = uuidv4();
    await db.insert(tenants).values({
      id: tenantId,
      name: 'Apex Builders Inc.',
      slug: 'apex-builders',
    }).onConflictDoNothing(); // Prevent dupe errors if re-running
    console.log('✅ Created Tenant: Apex Builders');

    // 2. Create a User (Project Manager)
    const userId = uuidv4();
    await db.insert(users).values({
      id: userId,
      tenantId: tenantId,
      email: 'pm@apexbuilders.com',
      role: 'manager',
    }).onConflictDoNothing();
    console.log('✅ Created User: pm@apexbuilders.com');

    // 3. Create a Project
    const projectId = uuidv4();
    await db.insert(projects).values({
      id: projectId,
      tenantId: tenantId,
      name: 'Skyline Lofts - Phase 1',
      code: 'PROJ-2024-001',
      status: 'active',
      budget: '5000000.00', // $5M
      startDate: new Date('2024-01-01'),
      endDate: new Date('2025-06-30'),
      metadata: { location: 'Austin, TX', type: 'Commercial-Residential' }
    }).onConflictDoNothing();
    console.log(`✅ Created Project: Skyline Lofts (${projectId})`);

    // 4. Add some initial Risks
    await db.insert(risks).values([
      {
        projectId: projectId,
        title: 'Steel Tariff Fluctuation',
        category: 'financial',
        severity: 'medium',
        description: 'New import tariffs may increase structural steel costs by 15% in Q3.'
      },
      {
        projectId: projectId,
        title: 'Permit Delay - City Inspection',
        category: 'schedule',
        severity: 'high',
        description: 'City backlog causing 3-week delays on foundation inspection.'
      }
    ]);
    console.log('✅ Added Project Risks');

    // 5. Add a Change Order
    await db.insert(changeOrders).values({
      projectId: projectId,
      description: 'Client requested upgrade to marble countertops in lobby.',
      amount: '45000.00',
      priority: 'medium',
      status: 'open',
      detectedFrom: 'email_thread_1012'
    });
    console.log('✅ Added Active Change Order');

    console.log('🎉 Database seeding complete!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    process.exit(0);
  }
}

seed();
