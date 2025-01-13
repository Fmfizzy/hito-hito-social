const LoadingSpinner = () => {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="mt-4 text-gray-600 text-sm">Loading...</span>
      </div>
    );
  };
  
  export default LoadingSpinner;