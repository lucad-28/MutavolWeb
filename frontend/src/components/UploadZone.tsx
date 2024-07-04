import { useMemo } from "react";
import { useDropzone } from "react-dropzone";

interface UploadZoneProps {
  onFileAdded: (file: File) => void;
}

const ERRORS = {
  invalid_file_type: "Not file supported",
  too_many_files: "You can only upload one file at a time",
  file_too_large: "There is a file too large",
  file_not_found: "No file found",
  upload_failed: "Upload failed",
};

const typesAccepted = [
  "cpp",
];

export default function UploadZone({ onFileAdded }: UploadZoneProps) {
  const validateFiles = (file: File) => {
    if (file === undefined || file.name === undefined)
      return {
        code: "no-file-found",
        message: ERRORS.file_not_found,
      };

    const ext = file.name.split(".").pop() || "";

    if (!typesAccepted.includes(ext))
      return {
        code: "type-incorrect",
        message: ERRORS.invalid_file_type,
      };

    if (file.size > 1024 * 1024 * 10)
      return {
        code: "file-too-large",
        message: ERRORS.file_too_large,
      };

    return null;
  };

  const { getRootProps, getInputProps, fileRejections } =
    useDropzone({
      onDrop: (acceptedFiles) => {
        const file = acceptedFiles[0];
        onFileAdded(file);
      },
      validator: validateFiles,
      maxFiles: 1,
    });

  const errorsMessage = useMemo(() => {
    if (fileRejections[0]) {
      const { errors } = fileRejections[0];
      if (errors[0].code === "file-too-large") {
        return ERRORS.file_too_large;
      } else if (errors[0].code === "type-incorrect") {
        return ERRORS.invalid_file_type;
      } else if (errors[0].code === "too-many-files") {
        return ERRORS.too_many_files;
      } else {
        return ERRORS.upload_failed;
      }
    }
    return undefined;
  }, [fileRejections]);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="bg-slate-800 p-3 rounded-lg w-full">
        <div
          {...getRootProps()}
          className="flex flex-col items-center justify-center pt-5 pb-6 w-full px-4 h-28 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-bray-800 hover:bg-gray-600 hover:border-gray-500"
        >
          <img
            src="/icons/cloud-icon.svg"
            alt="cloud-icon"
            className="w-8 h-8"
          />
          {errorsMessage ? (
            <p className="text-red-500">{errorsMessage}</p>
          ) : (
            <p className="text-sm text-gray-400">
              <span className="font-semibold text-sm mt-2">
                Click to upload
              </span>{" "}
              or drag and drop{" "}
            </p>
          )}
          <input {...getInputProps()} />
        </div>
      </div>
    </div>
  );
}
