const { Client, Databases } = require('node-appwrite');

const client = new Client().setEndpoint('https://cloud.appwrite.io/v1').setProject('6a9efb2b003c964b429d');
const db = new Databases(client);

async function testFullPollFlow() {
  const databaseId = 'python_class_lms';
  const collectionId = 'live_poll';
  const docId = 'active_poll';

  try {
    console.log('1. Simulating teacher launching poll...');
    const newPoll = {
      id: `POLL-${Date.now()}`,
      targetClass: 'all',
      question: 'Are you understanding the while loop logic?',
      options: ['Yes', 'No'],
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 300 * 1000).toISOString(),
      durationSeconds: 300,
      isActive: true,
      votes: {}
    };

    const payload = {
      pollId: newPoll.id,
      targetClass: newPoll.targetClass,
      question: newPoll.question,
      pollData: JSON.stringify(newPoll),
      isActive: true,
      expiresAt: newPoll.expiresAt
    };

    try {
      await db.updateDocument(databaseId, collectionId, docId, payload);
      console.log('✅ Poll created/updated via updateDocument');
    } catch {
      await db.createDocument(databaseId, collectionId, docId, payload);
      console.log('✅ Poll created via createDocument');
    }

    // 2. Student 1 votes YES
    console.log('2. Student 1 (Aarav) voting YES...');
    const doc1 = await db.getDocument(databaseId, collectionId, docId);
    const poll1 = JSON.parse(doc1.pollData);
    poll1.votes['student-1'] = {
      studentId: 'student-1',
      studentName: 'Aarav Sharma',
      choice: 'Yes',
      timestamp: new Date().toISOString()
    };
    await db.updateDocument(databaseId, collectionId, docId, {
      pollData: JSON.stringify(poll1)
    });
    console.log('✅ Student 1 vote saved');

    // 3. Student 2 votes NO
    console.log('3. Student 2 (Sneha) voting NO...');
    const doc2 = await db.getDocument(databaseId, collectionId, docId);
    const poll2 = JSON.parse(doc2.pollData);
    poll2.votes['student-2'] = {
      studentId: 'student-2',
      studentName: 'Sneha Patel',
      choice: 'No',
      timestamp: new Date().toISOString()
    };
    await db.updateDocument(databaseId, collectionId, docId, {
      pollData: JSON.stringify(poll2)
    });
    console.log('✅ Student 2 vote saved');

    // 4. Teacher reads live poll
    console.log('4. Teacher checking live poll stats...');
    const finalDoc = await db.getDocument(databaseId, collectionId, docId);
    const finalPoll = JSON.parse(finalDoc.pollData);
    console.log('Poll Question:', finalPoll.question);
    console.log('Total Votes Count:', Object.keys(finalPoll.votes).length);
    console.log('Votes Breakdown:', finalPoll.votes);

    // 5. Clean up / End Poll
    console.log('5. Teacher ending poll...');
    await db.updateDocument(databaseId, collectionId, docId, {
      pollId: 'none',
      targetClass: 'all',
      question: '',
      pollData: JSON.stringify({ id: 'none', isActive: false, votes: {} }),
      isActive: false,
      expiresAt: new Date(0).toISOString()
    });
    console.log('✅ Poll ended and cleaned up successfully!');

  } catch (err) {
    console.error('❌ Error during full poll test:', err.message || err);
  }
}

testFullPollFlow();
