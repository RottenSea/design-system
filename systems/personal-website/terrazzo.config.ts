import { defineConfig } from "@terrazzo/cli";
import css from "@terrazzo/plugin-css";

export default defineConfig({
  tokens: "./tokens/personal-website.resolver.json",
  outDir: "./dist/",
  plugins: [css({ filename: "tokens.css" })],
});
