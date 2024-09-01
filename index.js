import main from "./utils.js";

if (process.argv.length < 4) {
  console.log(`Usage: node index.js <url> "<region>"`);
  process.exit(1);
}

const url = process.argv[2];
const region = process.argv[3];

main(url, region, process.cwd());
