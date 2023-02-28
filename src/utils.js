const {spawn} = require('child_process');

const run = async (text) => {
  const commands = text.split('\n').map(command => command.trim()).filter(command => command !== '');
  for(const command of commands) {
    await runOne(command);
  }
}

const runOne = (command) => {
  const commands = command.split(/\s+/);
  command = commands[0];
  const args = commands.slice(1);
  if (process.platform === 'win32' && command === 'yarn') {
    command = 'yarn.cmd';
  }
  const childProcess = spawn(command, args, {stdio: 'inherit'});
  return new Promise((resolve, reject) => {
    childProcess.once(
      'exit',
      (code, signal) => {
        if (code === 0) {
          resolve();
        } else {
          reject(signal);
        }
      }
    );
  });
};

const logInfo = (message) => {
  console.log('\x1b[34m', '[Start]:', message, '\x1b[0m');
};

const logSuccess = (message) => {
  console.log('\x1b[32m', '[Done]:', message, '\x1b[0m');
};

module.exports = {run, logInfo, logSuccess};
