const cliProgress = require("cli-progress");
const fs = require("fs");
const readline = require("readline");
const util = require("util");
const cp = require("child_process");
const exec = util.promisify(cp.exec);

const cliProgressBar = new cliProgress.SingleBar(
  {
    format:
      "  progress: {bar} {percentage}% | passed: {duration_formatted} | line: {value} / {total}",
  },
  cliProgress.Presets.rect
);

const file = process.argv[2];
const comand = `wc -l ${file}`;

async function progressBar() {
  if (process.argv.length === 3) {
    const { stdout } = await exec(comand);
    const lineNum = parseFloat(stdout);

    const readInLine = readline.createInterface({
      input: fs.createReadStream(file),
    });

    const begining = 0;

    cliProgressBar.start(lineNum, begining);
    let count = 0;
    readInLine.on("line", function () {
      count++;
      cliProgressBar.update(count);
    });
    readInLine.on("close", function () {
      cliProgressBar.stop();
    });
  } else {
    throw new Error("error");
  }
}
progressBar();

const shutdown = () => process.exit();

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
