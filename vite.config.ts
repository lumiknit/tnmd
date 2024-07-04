import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
	base: "./",
	server: {
		port: 7333,
	},
	preview: {
		port: 7333,
	},
	plugins: [solid()],
	resolve: {
		alias: [{ find: "@", replacement: "/src" }],
	},
	build: {
		target: ["esnext", "firefox110", "chrome110", "safari15"],
	},
});
