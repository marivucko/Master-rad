const spawn = require("child_process").spawn;

const callAlgorithm = async () => {
  console.log("before python called");
  const childPython = spawn("python", ["./algorithm/algorithm.py"]);

  childPython.stdout.on("data", (data) => {
    console.log(`stdout: ${data} 1`);
  });

  childPython.stderr.on("data", (data) => {
    console.log(`stderr: ${data}`);
  });

  childPython.on("close", (code) => {
    console.log(`child process exited with code: ${code}`);
  });
};

module.exports = callAlgorithm;
