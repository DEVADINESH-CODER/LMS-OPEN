import { Client, Databases, Permission, Role } from 'node-appwrite';

const apiKey = 'standard_03b03852a87cb3bba05e794c6bbd83498d5e75742e4dae391839d6b34761765a6f33fbd01110bd3bdc402fb2cfc57c3d1a8e3f15d6b312ad941c3bf31ce74936cee65fd2ebcd3628b39e58bbc8edaa6735ac15a3039c1e2b473d114b68df8ce6ad9e5d105009bb5c269c11623f704da8c5a275761796f33166e6f539d921be7d';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('6a9efb2b003c964b429d')
  .setKey(apiKey);

const db = new Databases(client);
const DB_ID = 'python_class_lms';

const PERMS = [
  Permission.read(Role.any()),
  Permission.create(Role.any()),
  Permission.update(Role.any()),
  Permission.delete(Role.any()),
];

async function checkAndFix() {
  const cols = await db.listCollections(DB_ID);
  console.log(`Checking ${cols.total} collections in ${DB_ID}...\n`);
  
  for (const c of cols.collections) {
    console.log(`Collection: ${c.$id} (${c.name})`);
    try {
      await db.updateCollection(
        DB_ID,
        c.$id,
        c.name,
        PERMS,
        false, // documentSecurity
        true   // enabled
      );
      console.log(`  ✅ Permissions set to [read/create/update/delete: any]`);
    } catch (err: any) {
      console.error(`  ❌ Error updating ${c.$id}:`, err.message || err);
    }
  }
  console.log('\n🎉 Finished updating all collection permissions!');
}

checkAndFix().catch(console.error);
