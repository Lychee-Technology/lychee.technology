import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { cpSync } from 'node:fs';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

function staticCopy(entries) {
    return {
        name: 'static-copy',
        closeBundle() {
            for (const { src, dest } of entries) {
                cpSync(src, dest, { recursive: true });
            }
        },
    };
}

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    root: '.',
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                contact: resolve(__dirname, 'contact.html'),
                ltbase: resolve(__dirname, 'ltbase/index.html'),
                ltflow: resolve(__dirname, 'ltflow/index.html'),
                ltagent: resolve(__dirname, 'ltagent/index.html'),
                'forms-ai-readiness': resolve(__dirname, 'forms/ai-readiness/index.html'),
            },
            output: {
                entryFileNames: 'assets/[name]-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash][extname]',
            },
        },
    },
    plugins: [
        tailwindcss(),
    ],
});
