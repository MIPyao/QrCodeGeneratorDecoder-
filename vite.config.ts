import {fileURLToPath, URL} from 'node:url'
import type {ConfigEnv, UserConfig} from 'vite'
import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'

// 当前执行node命令时文件夹的地址(工作目录)
const root = process.cwd()

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
    // 加载环境变量
    let env: Record<string, any>
    const isBuild = command === 'build'
    if (!isBuild) {
        env = loadEnv((process.argv[3] === '--mode' ? process.argv[4] : process.argv[3]), root)
    } else {
        env = loadEnv(mode, root)
    }
    return {
        base: env.VITE_BASE_PATH,
        root: root,
        server: {
            port: env.VITE_PORT || 5173,
            host: "0.0.0.0",
            open: env.VITE_OPEN === 'true',
        },
        define: {
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
        },
        plugins: [
            vue(),
            legacy({
                targets: ['Android > 39', 'Chrome >= 60', 'Safari >= 10.1', 'iOS >= 10.3', 'Firefox >= 54', 'Edge >= 15'],
            }),
            AutoImport({
                imports: ['vue', 'vue-router'],
                resolvers: [ElementPlusResolver()],
                dts: 'src/types/auto-imports.d.ts',
            }),
            Components({
                resolvers: [ElementPlusResolver()],
                dts: 'src/types/auto-components.d.ts',
            }),
        ],
        build: {
            minify: 'terser',
            outDir: env.VITE_OUT_DIR || 'dist',
            sourcemap: env.VITE_SOURCEMAP === 'true' ? 'inline' : false,
            // brotliSize: false,
            terserOptions: {
                compress: {
                    drop_debugger: env.VITE_DROP_DEBUGGER === 'true',
                    drop_console: env.VITE_DROP_CONSOLE === 'true'
                }
            }
        },
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        css: {
            preprocessorOptions: {
                less: {
                    javascriptEnabled: true,
                },
            },
        },
    }
})
