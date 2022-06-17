/* eslint-disable no-console,import/no-extraneous-dependencies */
// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'development';

const path = require('path');
require('react-scripts/config/env');

function runCmd(cmd, args) {
  return new Promise((resolve) => {
    // eslint-disable-next-line global-require
    const {spawn} = require('child_process');
    const child = spawn(cmd, args);

    child.stdout.on('data', (buffer) => {
      console.log(buffer.toString());
    });
    child.stdout.on('end', () => {
      resolve();
    });
  });
}

const projectPathEnvName = 'AppLocalizationUtil';
const projectPathEnv = process.env[projectPathEnvName];

if (projectPathEnv) {
  const projectPath = path.relative(process.cwd(), projectPathEnv);

  if (projectPath) {
    const configFile = process.env.APP_LOCALIZATION_UTIL_CONFIG;

    runCmd('dotnet', ['run', '--project', projectPath, '--ConfigFile', configFile]);
  }
} else {
  console.error(`Please set ${projectPathEnvName} environment variable`);
}
