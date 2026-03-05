import JSZip from "jszip";
import { saveAs } from "file-saver";

/**
 * Export generated files as a ZIP download.
 *
 * @param {{ path: string, content: string }[]} files
 * @param {string} projectName
 */
export async function exportAsZip(files, projectName = "blueprint-project") {
  const zip = new JSZip();

  for (const file of files) {
    zip.file(file.path, file.content);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `${projectName}.zip`);
}
