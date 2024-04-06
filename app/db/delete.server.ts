import { exec } from 'child_process';

export async function deleteDB(path = './test/*.db*') {
  console.log('Cleaning up test db... at path: ', path);
  await exec(`rm -rf ${path}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error cleaning up test db: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Cleanup stderr: ${stderr}`);
      return;
    }
    console.log('Cleaned up test db.');
  });
}
