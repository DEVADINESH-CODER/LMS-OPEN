const { Client, Databases } = require('node-appwrite');
const apiKey = 'standard_03b03852a87cb3bba05e794c6bbd83498d5e75742e4dae391839d6b34761765a6f33fbd01110bd3bdc402fb2cfc57c3d1a8e3f15d6b312ad941c3bf31ce74936cee65fd2ebcd3628b39e58bbc8edaa6735ac15a3039c1e2b473d114b68df8ce6ad9e5d105009bb5c269c11623f704da8c5a275761796f33166e6f539d921be7d';
const client = new Client().setEndpoint('https://cloud.appwrite.io/v1').setProject('6a9efb2b003c964b429d').setKey(apiKey);
const db = new Databases(client);

async function inspectLessons() {
  try {
    const res = await db.listDocuments('python_class_lms', 'lessons');
    console.log('Total Lessons in DB:', res.total);
    res.documents.forEach(d => {
      console.log(`ID: ${d.$id}, lessonId: ${d.lessonId}, classId: ${d.classId}, periodNumber: ${d.periodNumber}, topic: ${d.topic}`);
      if (d.lessonData) {
        try {
          const parsed = JSON.parse(d.lessonData);
          console.log(`   status: ${parsed.status}, classId: ${parsed.classId}, period: ${parsed.periodNumber}`);
        } catch {}
      }
    });
  } catch (err) {
    console.error(err);
  }
}

inspectLessons();
