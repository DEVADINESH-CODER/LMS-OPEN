import { verifyPin, createSessionToken, checkRateLimit } from '../../src/lib/security';
import { INITIAL_STUDENTS, INITIAL_TEACHER } from '../../src/data/initialData';

export async function onRequestPost(context: any) {
  try {
    const body = await context.request.json();
    const { role } = body;

    // Student Login
    if (role === 'student') {
      const { registerNumber, pin } = body;
      if (!registerNumber || !pin) {
        return new Response(JSON.stringify({ error: 'Register Number and PIN are required.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const cleanRegNo = registerNumber.trim().toUpperCase();
      const rate = checkRateLimit(`login_${cleanRegNo}`, 5, 60000);
      if (!rate.allowed) {
        return new Response(JSON.stringify({ error: 'Too many login attempts. Please wait 1 minute.' }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const student = INITIAL_STUDENTS.find(s => s.registerNumber.toUpperCase() === cleanRegNo);
      if (!student) {
        return new Response(JSON.stringify({ error: 'Invalid Register Number or PIN.' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (!student.isActive) {
        return new Response(JSON.stringify({ error: 'Account has been deactivated. Please contact your instructor.' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const valid = await verifyPin(pin, student.pinHash, student.salt);
      if (!valid) {
        return new Response(JSON.stringify({ error: 'Invalid Register Number or PIN.' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const token = await createSessionToken({
        sub: student.id,
        role: 'student',
        regNo: student.registerNumber,
        name: student.name,
        classId: student.classId,
        mustChangePin: student.mustChangePin
      });

      return new Response(JSON.stringify({
        token,
        role: 'student',
        student: {
          id: student.id,
          registerNumber: student.registerNumber,
          name: student.name,
          classId: student.classId,
          mustChangePin: student.mustChangePin,
          isActive: student.isActive
        }
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Teacher Login
    if (role === 'teacher') {
      const { email, password } = body;
      if (!email || !password) {
        return new Response(JSON.stringify({ error: 'Email and password are required.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const cleanEmail = email.trim().toLowerCase();
      if (cleanEmail === INITIAL_TEACHER.email.toLowerCase() && (password === 'Teacher@2024' || password === '1234')) {
        const token = await createSessionToken({
          sub: INITIAL_TEACHER.id,
          role: 'teacher',
          name: INITIAL_TEACHER.name
        });

        return new Response(JSON.stringify({
          token,
          role: 'teacher',
          teacher: INITIAL_TEACHER
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ error: 'Invalid Teacher Email or Password.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid role specified.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
