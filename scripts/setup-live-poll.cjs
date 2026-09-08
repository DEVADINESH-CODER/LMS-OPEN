const { Client, Databases, Permission, Role } = require('node-appwrite');
const apiKey = 'standard_03b03852a87cb3bba05e794c6bbd83498d5e75742e4dae391839d6b34761765a6f33fbd01110bd3bdc402fb2cfc57c3d1a8e3f15d6b312ad941c3bf31ce74936cee65fd2ebcd3628b39e58bbc8edaa6735ac15a3039c1e2b473d114b68df8ce6ad9e5d105009bb5c269c11623f704da8c5a275761796f33166e6f539d921be7d';
const client = new Client().setEndpoint('https://cloud.appwrite.io/v1').setProject('6a9efb2b003c964b429d').setKey(apiKey);
const db = new Databases(client);

const DB_ID = 'python_class_lms';
const PERMS = [
  Permission.read(Role.any()),
  Permission.create(Role.any()),
  Permission.update(Role.any()),
  Permission.delete(Role.any()),
];

async function setupLivePollCollection() {
  try {
    try {
      await db.getCollection(DB_ID, 'live_poll');
      console.log('Collection live_poll already exists.');
    } catch {
      await db.createCollection(DB_ID, 'live_poll', 'Live Polls', PERMS, false, true);
      console.log('Created collection live_poll');
    }

    // Ensure permissions
    await db.updateCollection(DB_ID, 'live_poll', 'Live Polls', PERMS, false, true);

    // Create attributes if not present
    const col = await db.getCollection(DB_ID, 'live_poll');
    const existingAttrKeys = col.attributes.map(a => a.key);
    console.log('Existing attributes in live_poll:', existingAttrKeys);

    if (!existingAttrKeys.includes('pollId')) {
      await db.createStringAttribute(DB_ID, 'live_poll', 'pollId', 50, false);
      console.log('Created attribute pollId');
    }
    if (!existingAttrKeys.includes('targetClass')) {
      await db.createStringAttribute(DB_ID, 'live_poll', 'targetClass', 20, false);
      console.log('Created attribute targetClass');
    }
    if (!existingAttrKeys.includes('question')) {
      await db.createStringAttribute(DB_ID, 'live_poll', 'question', 500, false);
      console.log('Created attribute question');
    }
    if (!existingAttrKeys.includes('pollData')) {
      await db.createStringAttribute(DB_ID, 'live_poll', 'pollData', 65535, false);
      console.log('Created attribute pollData');
    }
    if (!existingAttrKeys.includes('isActive')) {
      await db.createBooleanAttribute(DB_ID, 'live_poll', 'isActive', false, true);
      console.log('Created attribute isActive');
    }
    if (!existingAttrKeys.includes('expiresAt')) {
      await db.createStringAttribute(DB_ID, 'live_poll', 'expiresAt', 50, false);
      console.log('Created attribute expiresAt');
    }

    console.log('✅ live_poll collection ready!');
  } catch (err) {
    console.error('Error creating live_poll collection:', err);
  }
}

setupLivePollCollection();
