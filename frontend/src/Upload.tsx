import { useState } from "react";
import UploadButton from "./components/UploadButton";
import Modal from "./components/Modal";
import UploadZone from "./components/UploadZone";
import UploadForm from "./components/UploadForm";

interface UploadProps {
  onResponse: (res: any) => void;
}

export default function Upload({ onResponse }: UploadProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  const onFileAdded = (file: File) => {
    setFile(file);
  };

  const handleClick = () => {
    setOpen(!open);
    setFile(null);
  };

  const handleFileUploaded = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file as File);
      const res = await fetch(
        `${
          import.meta.env.DEV
            ? import.meta.env.VITE_DEV_SERVER_URL
            : import.meta.env.VITE_PROD_SERVER_URL
        }/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (!data.success && data.message) {
        setError(data.message);
        return;
      }
      setOpen(false);
      onResponse(data);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  return (
    <>
      <UploadButton open={open} onClick={handleClick} />
      <Modal isOpen={open} onClose={handleClick}>
        {error && (
          <div className="text-white bg-red-700 rounded-lg px-4 py-2">
            <p className="my-auto">{error}</p>
          </div>
        )}
        <UploadZone onFileAdded={onFileAdded} />
        {file && <UploadForm file={file} onFileUploaded={handleFileUploaded} />}
      </Modal>
    </>
  );
}
