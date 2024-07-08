import { defineConfig } from "vite";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import solid from "vite-plugin-solid";

export default defineConfig({
	base: "./",
	server: {
		port: 7333,
	},
	preview: {
		port: 7333,
	},
	plugins: [solid(), nodeResolve()],
	resolve: {
		alias: [{ find: "@", replacement: "/src" }],
	},
	build: {
		target: ["esnext", "firefox110", "chrome110", "safari15"],
	},
});
