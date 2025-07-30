/* eslint-disable no-undef */
import { defineConfig } from "vite";
import sass from "sass";
import react from "@vitejs/plugin-react-swc";
import dotenv from 'dotenv';
import { VitePWA } from "vite-plugin-pwa";
// import PurgeCSS from 'vite-plugin-purgecss';
import ViteImagemin from 'vite-plugin-imagemin';

dotenv.config();

// https://vite.dev/config/
export default defineConfig(({
	mode
})=>{
	dotenv.config({ path: `.env.${mode}` });
	
	return {
		assetsInclude: ['**/*.docx'],
		plugins: [
			react(),
			VitePWA({
				registerType: 'autoUpdate',
				workbox: {
					globPatterns: ['**/*.{js,css,html,ico,png}']
				}
			}),
			ViteImagemin({
				gifsicle: { optimizationLevel: 3 },
				optipng: { optimizationLevel: 7 },
				mozjpeg: { quality: 85 },
				pngquant: { quality: [0.6, 0.8] },
				svgo: { plugins: [{ removeViewBox: false }] },
				webp: { quality: 75 }
			}),
		],
		define:{
			'process.env': {
				VITE_FIREBASE_KEY: process.env.VITE_FIREBASE_KEY,
				VITE_FIREBASE_AUTH_DOMAIN: process.env.VITE_FIREBASE_AUTH_DOMAIN,
				VITE_FIREBASE_PROJECT_ID: process.env.VITE_FIREBASE_PROJECT_ID,
				VITE_FIREBASE_STORAGE_BUCKET: process.env.VITE_FIREBASE_STORAGE_BUCKET,
				VITE_FIREBASE_MESSAGING_SENDER_ID: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
				VITE_FIREBASE_APP_ID: process.env.VITE_FIREBASE_APP_ID,
				VITE_FIREBASE_VAPID_KEY: process.env.VITE_FIREBASE_VAPID_KEY
			}
		},
		css: {
			preprocessorOptions: {
				scss: {
					implementation: sass
				}
			}
		},
		resolve: {
			alias: {
				src: "/src",
				'~bootstrap': '/node_modules/bootstrap',
			}
		},
		build: {
			commonjsOptions: {
				transformMixedEsModules: true
			},
			minify: 'terser',
			terserOptions: {
				compress: {
					// drop_console: true, // Hapus console log di build produksi
					drop_debugger: true,
				},
			},
		}
	}
});
