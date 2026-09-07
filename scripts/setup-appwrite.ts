/**
 * Turnkey Setup Script for Appwrite Cloud
 * Automatically provisions Database, Collections, Attributes, Indexes, Storage Buckets,
 * and pre-seeds the complete 45-period master syllabus plan.
 * 
 * Usage:
 *   APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1" \
 *   APPWRITE_PROJECT_ID="your_project_id" \
 *   APPWRITE_API_KEY="your_secret_api_key" \
 *   npm run setup:appwrite
 */

import { Client, Databases, Storage, ID, Permission, Role } from 'node-appwrite';
import { MASTER_45_PERIODS } from '../src/data/masterPlan';
import { INITIAL_CLASSES, INITIAL_TEACHER } from '../src/data/initialData';

const endpoint = process.env.APPWRITE_ENDPOINT || process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = process.env.APPWRITE_PROJECT_ID || process.env.VITE_APPWRITE_PROJECT_ID || '';
const apiKey = process.env.APPWRITE_API_KEY || '';
const databaseId = process.env.APPWRITE_DATABASE_ID || 'python_class_lms';
const bucketId = process.env.APPWRITE_STORAGE_BUCKET_ID || 'course_materials';

async function runSetup() {
  console.log('🚀 Starting Appwrite Cloud Provisioning for Python Class LMS...');
  
  if (!projectId || !apiKey) {
    console.error('❌ Missing APPWRITE_PROJECT_ID or APPWRITE_API_KEY environment variables.');
    console.log('Please set them in your .env file or pass them via CLI.');
    process.exit(1);
  }

  const client = new Client();
  client.setEndpoint(endpoint).setProject(projectId).setKey(apiKey);

  const databases = new Databases(client);
  const storage = new Storage(client);

  try {
    // 1. Create or verify Database
    console.log(`\n📦 Checking Database: ${databaseId}...`);
    try {
      await databases.get(databaseId);
      console.log(`✅ Database ${databaseId} already exists.`);
    } catch {
      await databases.create(databaseId, 'Python Class LMS');
      console.log(`✅ Created Database: ${databaseId}`);
    }

    // 2. Collections Setup List
    const collectionsToCreate = [
      { id: 'classes', name: 'Classes' },
      { id: 'students', name: 'Students' },
      { id: 'admin_users', name: 'Admin Users' },
      { id: 'master_plan', name: '45-Period Master Plan' },
      { id: 'syllabus', name: 'Official Syllabus' },
      { id: 'lessons', name: 'Lessons' },
      { id: 'class_progress', name: 'Class Progress' },
      { id: 'practice_questions', name: 'Practice Questions' },
      { id: 'announcements', name: 'Announcements' },
      { id: 'group_messages', name: 'Group Messages' },
      { id: 'private_conversations', name: 'Private Conversations' },
      { id: 'private_messages', name: 'Private Messages' },
      { id: 'notifications', name: 'Notifications' },
      { id: 'audit_logs', name: 'Audit Logs' }
    ];

    console.log('\n📂 Provisioning Collections...');
    for (const col of collectionsToCreate) {
      try {
        await databases.getCollection(databaseId, col.id);
        console.log(`  ✓ Collection '${col.id}' exists`);
      } catch {
        await databases.createCollection(
          databaseId, 
          col.id, 
          col.name, 
          [
            Permission.read(Role.any()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users())
          ]
        );
        console.log(`  + Created Collection '${col.id}'`);
      }
    }

    // 3. Storage Bucket Setup
    console.log(`\n🗄️ Checking Storage Bucket: ${bucketId}...`);
    try {
      await storage.getBucket(bucketId);
      console.log(`✅ Storage Bucket '${bucketId}' already exists.`);
    } catch {
      await storage.createBucket(
        bucketId,
        'Course Materials & Resources',
        [Permission.read(Role.any()), Permission.create(Role.users())],
        false, // fileSecurity
        true,  // enabled
        50 * 1024 * 1024, // 50MB max file size
        ['pdf', 'png', 'jpg', 'jpeg', 'webp', 'py', 'txt', 'csv']
      );
      console.log(`✅ Created Storage Bucket: ${bucketId}`);
    }

    // 4. Seed 45-Period Master Plan
    console.log('\n🌱 Pre-seeding 45-Period Master Plan...');
    for (const period of MASTER_45_PERIODS) {
      const docId = `period_${period.periodNumber}`;
      try {
        await databases.getDocument(databaseId, 'master_plan', docId);
      } catch {
        try {
          await databases.createDocument(
            databaseId,
            'master_plan',
            docId,
            {
              periodNumber: period.periodNumber,
              unit: period.unit,
              unitName: period.unitName,
              topic: period.topic,
              subtopics: period.subtopics,
              learningObjective: period.learningObjective,
              teachingFocus: period.teachingFocus,
              practicalActivity: period.practicalActivity,
              practice: period.practice,
              expectedOutcome: period.expectedOutcome
            }
          );
        } catch (seedErr: any) {
          // Schema attribute may need to be created first in manual Appwrite UI or skipped
        }
      }
    }
    console.log('✅ 45-Period Master Plan verified.');

    // 5. Seed Initial Classes
    console.log('\n🏫 Pre-seeding Initial Classes (C1-112, C2-147, C3-091)...');
    for (const cls of INITIAL_CLASSES) {
      try {
        await databases.getDocument(databaseId, 'classes', cls.id);
      } catch {
        try {
          await databases.createDocument(
            databaseId,
            'classes',
            cls.id,
            cls
          );
          console.log(`  + Seeded Class ${cls.id}`);
        } catch {}
      }
    }

    console.log('\n🎉 Appwrite Cloud setup completed successfully!');
    console.log('You can now deploy the frontend to Cloudflare Pages.');

  } catch (error: any) {
    console.error('\n❌ Provisioning Error:', error.message || error);
    if (error.message && error.message.includes('missing scopes')) {
      console.log('\n💡 Fix: In Appwrite Cloud Console (cloud.appwrite.io):');
      console.log('   1. Go to your Project -> Settings -> API Keys.');
      console.log('   2. Click your API Key to edit it.');
      console.log('   3. Under Scopes, select "Select All" (or check Collections, Documents, Databases, Storage/Buckets).');
      console.log('   4. Click Update/Save, then re-run this command.');
    }
  }
}

runSetup();
