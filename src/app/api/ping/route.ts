import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';

// Simple IP address validation regex
const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ip = searchParams.get('ip');

  if (!ip || !ipRegex.test(ip)) {
    return NextResponse.json({ error: 'Invalid or missing IP address' }, { status: 400 });
  }

  // Using -c 1 for a single packet, and -W 2 for a 2-second timeout.
  // This is suitable for Linux environments where the app will be hosted.
  const command = `ping -c 1 -W 2 ${ip}`;

  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        // 'error' is not null if the ping command fails (e.g., host unreachable)
        resolve(NextResponse.json({ status: 'Offline' }));
      } else {
        // No error means the ping was successful
        resolve(NextResponse.json({ status: 'Online' }));
      }
    });
  });
}
