import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import json from "@rollup/plugin-json";


export default [
    {
        input: "src/index.ts",
        output: [
            // {
            //   file: "dist/cjs/index.js",
            //   format: "cjs",
            //   sourcemap: true,
            // },
            {
                file: "dist/es/index.js",
                format: "es",
                sourcemap: true,
                extends: true,
                globals: {
                    wagmi: "client",
                },
            },
        ],
        plugins: [resolve(), commonjs(),json(), typescript({ tsconfig: "./tsconfig.json", exclude: './wagmi.config.ts' })],
        external: ["react", "react-dom", "wagmi", "@wagmi/core","@semaphore-protocol/proof", "@semaphore-protocol/identity", "@semaphore-protocol/group", "@semaphore-protocol/data"],

    },
    {
        input: "dist/es/types/index.d.ts",
        output: [
            {
                file: "dist/index.d.ts",
                format: "es",
                extends: true,
                globals: {
                    wagmi: "client",
                },
            },
        ],
        plugins: [dts()],
        external: ["react", "react-dom", "wagmi", "@wagmi/core","@semaphore-protocol/proof", "@semaphore-protocol/identity", "@semaphore-protocol/group", "@semaphore-protocol/data"],
    },
];
