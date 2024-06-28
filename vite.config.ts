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
		rollupOptions: {
			output: {
				manualChunks: id => {
					const names = id.split("node_modules/");
					if (names.length > 1) {
						const name = names.pop()!.split("/")[0];
						return `vendor-${name}`;
					}
				},
			},
		},
	},
});
