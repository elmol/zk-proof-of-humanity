import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import json from "@rollup/plugin-json";
import * as fs from "fs"

const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"))

export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: "dist/index.js",
                format: "es",
                sourcemap: true,
            },
        ],
        plugins: [resolve(), commonjs(),json(), typescript({ tsconfig: "./tsconfig.json", exclude: './wagmi.config.ts' })],
        external: [...Object.keys(pkg.dependencies),"@wagmi/core"]
    },
    {
        input: "dist/types/index.d.ts",
        output: [
            {
                file: "dist/index.d.ts",
                format: "es",
            },
        ],
        plugins: [dts()],
        external: [...Object.keys(pkg.dependencies),"@wagmi/core"]
    },
];
