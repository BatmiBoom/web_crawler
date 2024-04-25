const { test, expect } = require("@jest/globals");
const { normalizeURL, getURLsFromHTML } = require("../crawl.js");

test("Test Normalize URL Function", () => {
	expect(normalizeURL("https://boot.dev/path/")).toBe("boot.dev/path");
});

test("Test finding links in HTML", () => {
	const base_url = "https://boot.dev/path/";
	const html = `<html><body><a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a></body></html>`;

	expect(getURLsFromHTML(html, base_url)).toStrictEqual([
		"https://blog.boot.dev/",
	]);
});
