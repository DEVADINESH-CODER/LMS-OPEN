const { Client, Databases } = require('node-appwrite');
const apiKey = 'standard_03b03852a87cb3bba05e794c6bbd83498d5e75742e4dae391839d6b34761765a6f33fbd01110bd3bdc402fb2cfc57c3d1a8e3f15d6b312ad941c3bf31ce74936cee65fd2ebcd3628b39e58bbc8edaa6735ac15a3039c1e2b473d114b68df8ce6ad9e5d105009bb5c269c11623f704da8c5a275761796f33166e6f539d921be7d';
const client = new Client().setEndpoint('https://cloud.appwrite.io/v1').setProject('6a9efb2b003c964b429d').setKey(apiKey);
const db = new Databases(client);

async function testPoll() {
  try {
    const list = await db.listDocuments('python_class_lms', 'live_poll');
    console.log('Existing live_poll docs:', list.total);
    list.documents.forEach(d => console.log('Doc:', d.$id, d.pollId, d.question, d.isActive));

    const pollObj = {
      id: `POLL-${Date.now()}`,
      targetClass: 'all',
      question: 'Test poll question?',
      options: ['Yes', 'No'],
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 300000).toISOString(),
      durationSeconds: 300,
      isActive: true,
      votes: {}
    };

    console.log('\nTrying to create active_poll document...');
    try {
      const created = await db.createDocument('python_class_lms', 'live_poll', 'active_poll', {
        pollId: pollObj.id,
        targetClass: pollObj.targetClass,
        question: pollObj.question,
        pollData: JSON.stringify(pollObj),
        isActive: pollObj.isActive,
        expiresAt: pollObj.expiresAt
      });
      console.log('✅ Successfully created active_poll:', created.$id);
    } catch (e) {
      console.log('Create failed, trying update...', e.message);
      const updated = await db.updateDocument('python_class_lms', 'live_poll', 'active_poll', {
        pollId: pollObj.id,
        targetClass: pollObj.targetClass,
        question: pollObj.question,
        pollData: JSON.stringify(pollObj),
        isActive: pollObj.isActive,
        expiresAt: pollObj.expiresAt
      });
      console.log('✅ Successfully updated active_poll:', updated.$id);
    }

    const fetched = await db.getDocument('python_class_lms', 'live_poll', 'active_poll');
    console.log('✅ Fetched doc:', fetched.$id, fetched.question);
  } catch (err) {
    console.error('❌ Error testing live poll:', err);
  }
}

testPoll();
