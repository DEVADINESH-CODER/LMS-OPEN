const { Client, Databases } = require('node-appwrite');
// Client WITHOUT api key (just like frontend browser client)
const client = new Client().setEndpoint('https://cloud.appwrite.io/v1').setProject('6a9efb2b003c964b429d');
const db = new Databases(client);

async function testClientAccess() {
  try {
    console.log('Testing reading active_poll without api key...');
    const doc = await db.getDocument('python_class_lms', 'live_poll', 'active_poll');
    console.log('✅ Browser client can read active_poll:', doc.$id, doc.question);

    console.log('Testing updating active_poll without api key...');
    const updated = await db.updateDocument('python_class_lms', 'live_poll', 'active_poll', {
      question: 'Updated from client?'
    });
    console.log('✅ Browser client can update active_poll:', updated.question);
  } catch (err) {
    console.error('❌ Browser client permission error:', err.message || err);
  }
}

testClientAccess();
