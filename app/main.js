const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const command = process.argv[2];

switch (command) {
  case "init":
    createGitDirectory();
    break;

  case "cat-file":
    catFile(process.argv[4]);
    break;
  default:
    throw new Error(`Unknown command ${command}`);
}

function createGitDirectory() {
  fs.mkdirSync(path.join(__dirname, ".git"), { recursive: true });
  fs.mkdirSync(path.join(__dirname, ".git", "objects"), { recursive: true });
  fs.mkdirSync(path.join(__dirname, ".git", "refs"), { recursive: true });

  fs.writeFileSync(
    path.join(__dirname, ".git", "HEAD"),
    "ref: refs/heads/main\n"
  );
  console.log("Initialized git directory");
}

function catFile(blobSha) {
  const dir = blobSha.slice(0, 2);
  const file = blobSha.slice(2);

  const objPath = path.join(__dirname, ".git", "objects", dir, file);
  const data = fs.readFileSync(objPath);

  const dataUnzipped = zlib.inflateSync(data);
  const res = dataUnzipped.toString().split("\0");

  process.stdout.write(res[1]);
}
