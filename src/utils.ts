import {spawn} from 'child_process';

export const run = async (text: string) => {
  const commands = text
    .split('\n')
    .map(command => command.trim())
    .filter(command => command !== '');
  for (const command of commands) {
    await runOne(command);
  }
};

const runOne = (command: string) => {
  const commands = command.split(/\s+/);
  command = commands[0];
  const args = commands.slice(1);
  if (process.platform === 'win32' && command === 'yarn') {
    command = 'yarn.cmd';
  }
  const childProcess = spawn(command, args, {stdio: 'inherit', shell: true});
  return new Promise((resolve, reject) => {
    childProcess.once('exit', (code, signal) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(signal);
      }
    });
  });
};

export const logInfo = (message: string) => {
  console.log('\x1b[34m', '[Start]:', message, '\x1b[0m');
};

export const logSuccess = (message: string) => {
  console.log('\x1b[32m', '[Done]:', message, '\x1b[0m');
};
