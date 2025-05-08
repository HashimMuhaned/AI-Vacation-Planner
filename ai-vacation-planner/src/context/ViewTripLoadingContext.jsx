import { createContext, useState, useContext } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = () => setIsLoading(true);
  const hideLoading = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-60 backdrop-blur-sm">
          <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-500" />
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  );
};

// Custom hook for easy use
export const useLoading = () => useContext(LoadingContext);
