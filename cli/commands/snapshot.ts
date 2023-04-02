import fs from "fs";
import path from "path";

// Snapshot command action
const snapshot = async (options: { snapshotVersion?: number }) => {
  const sourcePath = path.resolve(process.cwd(), "prompt.json");
  const snapshotPath = path.resolve(process.cwd(), "snapshots");

  // Check if the source file (prompt.json) exists
  if (!fs.existsSync(sourcePath)) {
    console.error(
      'Error: Cannot find the required "prompt.json" file in the project directory.',
    );
    process.exit(1);
  }

  try {
    // Ensure the 'dist' directory exists, and if not, create it
    if (!fs.existsSync(snapshotPath)) {
      fs.mkdirSync(snapshotPath);
    }

    let snapshotVersion = options.snapshotVersion;

    // If the version is not provided, find the highest current version number and increment it
    if (!snapshotVersion) {
      const files = fs.readdirSync(snapshotPath);
      const existingVersions = files.map((file) => {
        const match = file.match(/^prompt-v(\d+).json$/);
        return match ? parseInt(match[1]) : 0;
      });

      snapshotVersion = Math.max(...existingVersions, 0) + 1;
    }

    const destFile = `prompt-v${snapshotVersion}.json`;
    const destPath = path.resolve(snapshotPath, destFile);

    // Copy 'prompt.json' to the destination path with the version
    fs.copyFileSync(sourcePath, destPath);

    console.log(`Successfully created a snapshot at: ${destPath}`);
  } catch (error) {
    console.error("Error during snapshot process:", error);
    process.exit(1);
  }
};

export default snapshot;
