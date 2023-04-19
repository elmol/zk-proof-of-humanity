import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

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
        plugins: [resolve(), commonjs(), typescript({ tsconfig: "./tsconfig.json" })],
        external: ["react", "react-dom", "wagmi", "@wagmi/core"],
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
        external: ["react", "react-dom", "wagmi", "@wagmi/core"],
    },
];
