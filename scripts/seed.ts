import fs from "node:fs";
import path from "node:path";

const reset = process.argv.includes("--reset");
const configured = process.env.DATABASE_PATH || "./data/babycon.db";
const dbFile = path.isAbsolute(configured)
  ? configured
  : path.join(process.cwd(), configured);

if (reset) {
  for (const suffix of ["", "-wal", "-shm", "-journal"]) {
    const file = `${dbFile}${suffix}`;
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }
  console.log("Removed existing database.");
}

async function main() {
  const { getDatabase } = await import("../lib/database");
  getDatabase();
  console.log(`Database ready at ${dbFile}`);
  console.log("Admin login: " + (process.env.ADMIN_EMAIL || "admin@babycon.in"));
  console.log("Admin password: " + (process.env.ADMIN_PASSWORD || "Admin@12345"));
  console.log("Customer demo login: ananya@example.com / Baby@12345");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
