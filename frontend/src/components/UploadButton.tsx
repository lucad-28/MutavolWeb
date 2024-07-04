interface UploadButtonProps {
    onClick: () => void;
    open: boolean;
}

export default function UploadButton({ onClick, open }: UploadButtonProps) {
  return (
    <div
      className="flex items-center justify-center min-w-24 min-h-10 rounded-lg cursor-pointer bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-800 shadow-lg shadow-blue-800/80"
      onClick={onClick}
    >
      <div className="flex flex-col items-center justify-center">
        <p className="text-sm text-white">
          <span className="font-semibold">{ open ? "Cancel" : "Upload"}</span>
        </p>
      </div>
    </div>
  );
}
