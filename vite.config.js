import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        tailwindcss(),
        react(),
    ],
    resolve: {
        alias: {
            // --- PASO 2: ASEGÚRATE DE QUE TU ALIAS "@" SE VEA ASÍ ---
            // Esto reemplaza a __dirname por la versión moderna de ESM
            '@': path.resolve(
                path.dirname(fileURLToPath(import.meta.url)), 
                'resources/js'
            ),
        },
    },
});
