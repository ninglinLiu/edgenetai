/**
 * @file seed.ts
 * @description Seed database with initial nodes
 */

import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || 'postgresql://postgres:postgres@localhost:5432/edgenetai',
});

async function seed() {
  console.log('🌱 Seeding database...');

  // Register sample nodes
  const nodes = [
    {
      id: 'node-1',
      addr: 'http://localhost:8001',
      region: 'us-east-1',
      stake: '1000000000000000000',
    },
    {
      id: 'node-2',
      addr: 'http://localhost:8002',
      region: 'us-west-1',
      stake: '2000000000000000000',
    },
  ];

  for (const node of nodes) {
    await pool.query(
      `INSERT INTO nodes (id, addr, stake, region, registered_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (id) DO UPDATE SET
         addr = EXCLUDED.addr,
         stake = EXCLUDED.stake,
         region = EXCLUDED.region`,
      [node.id, node.addr, node.stake, node.region]
    );
    console.log(`✅ Registered node: ${node.id}`);
  }

  await pool.end();
  console.log('✅ Seeding complete!');
}

seed().catch(console.error);

