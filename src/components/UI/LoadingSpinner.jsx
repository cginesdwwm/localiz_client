/*
  Reusable loading spinner component
*/

const LoadingSpinner = ({ size = "medium", message = "Loading..." }) => {
  const sizeClasses = {
    small: "h-6 w-6",
    medium: "h-12 w-12",
    large: "h-16 w-16",
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div
        className={`animate-spin rounded-full border-b-2 border-blue-500 ${sizeClasses[size]}`}
        role="status"
        aria-label="Loading"
      />
      {message && (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
