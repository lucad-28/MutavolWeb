interface UploadFormProps {
  onFileUploaded: () => Promise<void>;
  file: File | null;
}

export default function UploadForm({ onFileUploaded, file }: UploadFormProps) {
  const handleSubmit = async () => {
    try {
      await onFileUploaded();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative bg-slate-700 rounded-lg shadow overflow-auto">
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {file?.name}
          </h3>
        </div>
        <div className="flex justify-center p-4 md:p-5 border-b border-gray-600">
          <button
            type="button"
            className="text-white min-w-24 bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm py-2.5 text-center"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
