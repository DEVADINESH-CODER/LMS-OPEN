/**
 * Bulk seed all 130+ students from studentsData.ts into Appwrite Cloud.
 * Safe to re-run: if a student already exists, it updates their data.
 */
import { Client, Databases } from 'node-appwrite';

const apiKey = 'standard_03b03852a87cb3bba05e794c6bbd83498d5e75742e4dae391839d6b34761765a6f33fbd01110bd3bdc402fb2cfc57c3d1a8e3f15d6b312ad941c3bf31ce74936cee65fd2ebcd3628b39e58bbc8edaa6735ac15a3039c1e2b473d114b68df8ce6ad9e5d105009bb5c269c11623f704da8c5a275761796f33166e6f539d921be7d';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('6a9efb2b003c964b429d')
  .setKey(apiKey);

const db = new Databases(client);
const DB_ID = 'python_class_lms';

async function sleep(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}

// Import the students from our data file
// Since we can't import ESM directly here easily, we'll import ALL_ENROLLED_STUDENTS
async function run() {
  // Dynamically import the students data
  const { ALL_ENROLLED_STUDENTS } = await import('../src/data/studentsData.js');
  
  console.log(`\n🎓 Seeding ${ALL_ENROLLED_STUDENTS.length} students to Appwrite Cloud...\n`);

  let created = 0;
  let updated = 0;
  let errored = 0;

  for (const student of ALL_ENROLLED_STUDENTS) {
    const payload = {
      studentId: student.id,
      registerNumber: student.registerNumber,
      name: student.name,
      email: student.email || '',
      classId: student.classId,
      pinHash: student.pinHash,
      salt: student.salt,
      mustChangePin: student.mustChangePin ?? false,
      isActive: student.isActive ?? true,
      createdAt: student.createdAt || new Date().toISOString(),
      updatedAt: student.updatedAt || new Date().toISOString(),
    };

    try {
      await db.createDocument(DB_ID, 'students', student.id, payload);
      created++;
      process.stdout.write(`  ✓ Created ${student.id} (${student.name})\n`);
    } catch (e: any) {
      if (e?.message?.includes('already exists') || e?.code === 409) {
        try {
          await db.updateDocument(DB_ID, 'students', student.id, payload);
          updated++;
          process.stdout.write(`  ~ Updated ${student.id} (${student.name})\n`);
        } catch (ue: any) {
          errored++;
          console.error(`  ✗ Error updating ${student.id}: ${ue?.message}`);
        }
      } else {
        errored++;
        console.error(`  ✗ Error creating ${student.id}: ${e?.message}`);
      }
    }
    await sleep(100); // Rate limit
  }

  console.log(`\n✅ Done! Created: ${created} | Updated: ${updated} | Errors: ${errored}`);
}

run();
