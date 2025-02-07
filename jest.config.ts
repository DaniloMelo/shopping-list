import dotenv from "dotenv";
import type { Config } from "jest";
import nextJest from "next/jest.js";

dotenv.config({
  path: ".env",
});

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
};

export default createJestConfig(config);
