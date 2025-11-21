import { exec } from "node:child_process";
import { copyFile } from "node:fs/promises";
import { promisify } from "node:util";
import glob from "tiny-glob";
import { defineConfig } from "tsup";

const pexec = promisify(exec);

export default defineConfig((options) => ({
    entryPoints: ["src/index.ts", "src/**/*.ts", "src/**/*.tsx"],
    format: ["esm", "cjs"],
    external: ["react", "react/jsx-runtime", "react-dom"],
    dts: false,
    jsx: "automatic",
    ...options,
    // tsup's dts option just bombs with more than than a handful of components, using this fix to build types
    // after building cjs and esm modules. Not sure there's much of a reason to use tsup over rollup combined with esbuild
    // https://github.com/egoist/tsup/issues/920#issuecomment-2144658003
    async onSuccess() {
        try {
            await pexec("tsc --emitDeclarationOnly --declaration --noEmit false --outDir ./dist");
            const files = await glob("dist/**/*.d.ts");
            await Promise.all(files.map((file) => copyFile(file, file.replace(".d.ts", ".d.cts")))); // or to `.d.cjs` for `"type": "module"` projects
        } catch (err) {
            if (err instanceof Error) {
                console.error();
                console.error("Typescript compilation error:");
                console.error();
                console.error(err);
                throw err;
            }
        }
    },
}));
