const { argv, exit } = require("node:process");
const { crawlPage } = require("./crawl.js");

async function main() {
	if (argv.length < 3) {
		console.error("ERROR : You need to pass the url as CLI parameter");
		exit(0);
	}

	if (argv.length > 3) {
		console.error("ERROR : Only one parameter expected, multiple passed");
		exit(0);
	}

	const base_url = argv[2];
	console.log(`STARTING CRAWLING FROM : ${base_url}`);

	const pages = await crawlPage(base_url);

	console.log(pages);
}

main();
