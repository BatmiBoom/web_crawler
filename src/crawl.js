const { exit } = require("node:process");
const { JSDOM } = require("jsdom");

function normalizeURL(url) {
	const url_obj = new URL(url);
	let normalized_url = `${url_obj.host}${url_obj.pathname}`;
	if (normalized_url.slice(-1) === "/") {
		normalized_url = normalized_url.slice(0, -1);
	}
	return normalized_url;
}

function getURLsFromHTML(html, base_url) {
	const { document } = new JSDOM(html).window;

	const a_tag = document.getElementsByTagName("a");

	const urls = [];
	for (const a of a_tag) {
		if (a.hasAttribute("href")) {
			let href = a.getAttribute("href");

			try {
				href = new URL(href, base_url).href;
				urls.push(href);
			} catch (err) {
				console.log(`${err.message}: ${href}`);
			}
		}
	}

	return urls;
}

async function getHTML(url) {
	let response;
	try {
		response = await fetch(url);
	} catch (err) {
		throw new Error(`ERROR : ${err} with URL: ${url}`);
	}

	if (response.status > 399) {
		throw new Error(
			`Got HTTP error: ${response.status} ${response.statusText}`,
		);
	}

	const content_type = response.headers.get("content-type");
	if (content_type !== "text/html; charset=utf-8") {
		throw new Error(`ERROR : Content type is not text/html. ${content_type}`);
	}

	return response.text();
}

async function crawlPage(base_url, current_url = base_url, pages = {}) {
	const base_url_obj = new URL(base_url);
	const current_url_obj = new URL(current_url);

	if (base_url_obj.hostname !== current_url_obj.hostname) {
		return pages;
	}

	const current_normailze_url = normalizeURL(current_url);

	if (current_normailze_url in pages) {
		pages[current_normailze_url]++;
		return pages;
	}

	pages[current_normailze_url] = 1;

	console.log(`Crawling ${current_url}`);
	let html;
	try {
		html = await getHTML(current_url);
	} catch (err) {
		console.log(`Stop Crawling at ${current_url} with ERROR: ${err.message}`);
		return pages;
	}

	const links = getURLsFromHTML(base_url, html);
	for (const link of links) {
		pages = await crawlPage(base_url, link, pages);
	}

	return pages;
}

module.exports = {
	normalizeURL,
	getURLsFromHTML,
	crawlPage,
};
