#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Firebase Emulators...\n');

// Start Firebase emulators
const emulatorProcess = spawn('firebase', ['emulators:start'], {
  stdio: 'inherit',
  shell: true,
  cwd: path.join(__dirname, '..')
});

emulatorProcess.on('error', (error) => {
  console.error('❌ Failed to start emulators:', error.message);
  console.log('\n💡 Make sure you have Firebase CLI installed:');
  console.log('   npm install -g firebase-tools');
  console.log('   firebase login');
  process.exit(1);
});

emulatorProcess.on('close', (code) => {
  console.log(`\n✅ Emulators stopped with code ${code}`);
  process.exit(code);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping emulators...');
  emulatorProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Stopping emulators...');
  emulatorProcess.kill('SIGTERM');
}); 