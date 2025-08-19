interface EmptyState {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

const EmptyState = ({ title, description, children }: EmptyState) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 rounded-[16px]">
      <div className="text-center text-gray-500">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="text-lg font-medium mb-2">
          {title || "No Content Availabel"}
        </p>
        <p className="text-sm">
          {description || "Create your first content to see it here"}
        </p>

        {children && children}
      </div>
    </div>
  );
};

export default EmptyState;
