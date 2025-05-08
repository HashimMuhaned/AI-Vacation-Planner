import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Compass, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-orange-100">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg animate-fade-in">
        <div className="flex flex-col items-center text-center">
          <div className="p-5 bg-orange-100 rounded-full mb-6">
            <Compass className="h-16 w-16 text-orange-500" />
          </div>

          <h1 className="text-4xl font-bold mb-2 text-gray-800">
            Oops! Lost your way?
          </h1>
          <div className="bg-gradient-to-r from-orange-600 to-orange-400 h-1 w-16 mb-6 mx-auto"></div>

          <p className="text-gray-600 mb-2">
            The destination you're looking for doesn't exist.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Path: {location.pathname}
          </p>

          <div className="space-y-4 w-full">
            <Link to="/" className="block w-full">
              <Button className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-400">
                <ArrowLeft className="h-4 w-4" />
                Back to Exploration
              </Button>
            </Link>

            <div className="text-sm text-gray-500">
              Let's find your perfect destination together!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
