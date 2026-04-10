import * as fs from "fs";
import * as path from "path";
import { CONFIG } from "./config.ts";

const experimentsPath = path.resolve(CONFIG.paths.experiments);
const templatePath = path.resolve("gallery/index.template.html");
const outputPath = path.resolve("gallery/public/index.html");

const experiments = fs.existsSync(experimentsPath)
  ? fs.readFileSync(experimentsPath, "utf-8")
  : "[]";

// Always build from template, never modify the output in place
let html = fs.readFileSync(templatePath, "utf-8");
html = html.replace("/*EXPERIMENTS_DATA*/[]", experiments);

fs.writeFileSync(outputPath, html);
console.log(`Gallery index rebuilt with ${JSON.parse(experiments).length} experiments.`);
