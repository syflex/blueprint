import { useState } from "react";
import { exportAsZip } from "../../utils/exportZip";

export default function ExportDialog({ files, onClose }) {
  const [projectName, setProjectName] = useState("blueprint-project");
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    setExporting(true);
    try {
      await exportAsZip(files, projectName);
      onClose();
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(false);
    }
  }

  const totalSize = files.reduce((acc, f) => acc + f.content.length, 0);
  const sizeKB = (totalSize / 1024).toFixed(1);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl border border-[#EDEDF0] bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-[Poppins] text-lg font-light text-[#2D2D31]">
            Export Project
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer text-[#97979B] hover:text-[#2D2D31]"
          >
            <span className="icon-x" aria-hidden="true" />
          </button>
        </div>

        <div className="mb-4 flex flex-col gap-1">
          <label className="text-xs text-[#97979B]">Project name</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="rounded-md border border-[#EDEDF0] px-3 py-2 text-sm text-[#2D2D31] outline-none focus:border-[#FD366E]"
          />
        </div>

        <div className="mb-4 rounded-md bg-[#FAFAFB] p-3">
          <div className="flex justify-between text-xs text-[#97979B]">
            <span>{files.length} files</span>
            <span>~{sizeKB} KB</span>
          </div>
        </div>

        <button
          onClick={handleExport}
          disabled={exporting || files.length === 0}
          className="w-full cursor-pointer rounded-md bg-[#FD366E] py-2 text-sm text-white disabled:opacity-60"
        >
          {exporting ? "Exporting..." : `Download ${projectName}.zip`}
        </button>
      </div>
    </div>
  );
}
