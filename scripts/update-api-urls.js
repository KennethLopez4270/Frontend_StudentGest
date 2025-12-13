/**
 * Script para actualizar URLs hardcodeadas en el frontend
 * Ejecutar con: node scripts/update-api-urls.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directorio raíz del proyecto
const srcDir = path.join(__dirname, '..', 'src');

// Patrones a reemplazar
const replacements = [
    // URLs con puerto 8084 (user-service)
    {
        pattern: /http:\/\/localhost:8084/g,
        replacement: '${API_URL}',
        description: 'localhost:8084 -> API_URL'
    },
    // URLs con puerto 8080 (gateway)
    {
        pattern: /http:\/\/localhost:8080/g,
        replacement: '${API_URL}',
        description: 'localhost:8080 -> API_URL'
    },
    // URLs con puerto 8088 (foro-service)
    {
        pattern: /http:\/\/localhost:8088/g,
        replacement: '${API_URL}',
        description: 'localhost:8088 -> API_URL'
    }
];

// Import que debe añadirse
const importStatement = "import API_URL from '@/config/api'";

// Extensiones de archivo a procesar
const extensions = ['.vue', '.js'];

// Archivos a excluir
const excludeFiles = ['api.js'];

// Contador de archivos modificados
let modifiedCount = 0;
let filesChecked = 0;

/**
 * Procesa un archivo
 */
function processFile(filePath) {
    const fileName = path.basename(filePath);

    // Excluir ciertos archivos
    if (excludeFiles.includes(fileName)) {
        return;
    }

    filesChecked++;
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let changes = [];

    // Verificar si el archivo contiene alguna URL hardcodeada
    for (const { pattern, replacement, description } of replacements) {
        if (pattern.test(content)) {
            // Reemplazar comillas simples y dobles alrededor de la URL
            // Convertir 'http://localhost:8084' a `${API_URL}`
            // Convertir "http://localhost:8084" a `${API_URL}`
            content = content.replace(
                new RegExp(`['"]http:\\/\\/localhost:(8080|8084|8088)`, 'g'),
                '`${API_URL}'
            );
            content = content.replace(
                new RegExp(`http:\\/\\/localhost:(8080|8084|8088)(['"])`, 'g'),
                '${API_URL}`'
            );
            // Para template strings existentes con variables
            content = content.replace(
                new RegExp('\\$\\{API_URL\\}\\`\\/', 'g'),
                '${API_URL}/'
            );

            modified = true;
            changes.push(description);
        }
    }

    // Si el archivo fue modificado, verificar si necesita el import
    if (modified) {
        // Comprobar si ya tiene el import
        if (!content.includes("import API_URL from '@/config/api'") &&
            !content.includes('import API_URL from "@/config/api"')) {

            // Para archivos .vue, añadir después de <script setup> o <script>
            if (filePath.endsWith('.vue')) {
                content = content.replace(
                    /(<script setup>|<script>)/,
                    `$1\n${importStatement}`
                );
            }
            // Para archivos .js, añadir al inicio
            else if (filePath.endsWith('.js')) {
                content = importStatement + '\n' + content;
            }

            changes.push('Added import statement');
        }

        // Guardar el archivo
        fs.writeFileSync(filePath, content, 'utf8');
        modifiedCount++;
        console.log(`✅ Modified: ${path.relative(srcDir, filePath)}`);
        changes.forEach(c => console.log(`   - ${c}`));
    }
}

/**
 * Recorre un directorio recursivamente
 */
function walkDir(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Excluir node_modules y otras carpetas
            if (!['node_modules', '.git', 'dist'].includes(file)) {
                walkDir(filePath);
            }
        } else if (stat.isFile()) {
            // Solo procesar archivos con las extensiones correctas
            const ext = path.extname(file);
            if (extensions.includes(ext)) {
                processFile(filePath);
            }
        }
    }
}

// Ejecutar
console.log('🔄 Updating API URLs in frontend files...\n');
console.log(`📂 Source directory: ${srcDir}\n`);

walkDir(srcDir);

console.log(`\n📊 Summary:`);
console.log(`   Files checked: ${filesChecked}`);
console.log(`   Files modified: ${modifiedCount}`);
console.log(`\n✨ Done!`);
