import React, { useEffect, useState } from "react";
import placeholderimg from "../../assets/placeholder.jpg";
import { Button } from "../ui/button";
import { FaShare, FaRegTrashCan } from "react-icons/fa6";
import { getCountryImagesUnSplash } from "@/services/GglPlaceImgApi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useAuth } from "@/context/GoogleAuth";
import LoginDialog from "@/components/custom/Dialog";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/services/FirebaseConfig";
import { showToast } from "@/components/ui/sonner";
import { useParams, useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useLoading } from "@/context/ViewTripLoadingContext"; // Import your context

const InfoSection = ({ tripData }) => {
  const [placePhoto, setPlacePhoto] = useState([]);
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const { showLoading, hideLoading } = useLoading(); // Access context
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const getPlacePhotos = async () => {
      showLoading(); // Start global loading
      try {
        const placeName = tripData?.userSelection?.place; // Get the place name from tripData
        const photos = await getCountryImagesUnSplash(placeName); // passing placeName to the function
        setPlacePhoto(photos); // Set the photos in state
      } catch (error) {
        console.error("Error fetching country photos:", error);
      } finally {
        setIsReady(true);
        hideLoading(); // Done loading this component
      }
    };

    if (tripData?.userSelection?.place) {
      // Check if place is available then fetch photos
      getPlacePhotos();
    } else {
      setIsReady(true);
      hideLoading(); // No data = still mark as done
    }
  }, [tripData]);

  // This useEffect is used to update the current and count state variables whenever the api or placePhoto changes.
  // It listens for the "select" and "reInit" events from the carousel API to update the current slide and total count of slides.
  // it is from the chadcn documentation
  useEffect(() => {
    if (api) {
      const updateSnapData = () => {
        const snaps = api.scrollSnapList();
        setCount(snaps.length);
        setCurrent(api.selectedScrollSnap() + 1);
      };
      // The api.scrollSnapList() method is used to get the list of scroll snaps, and api.selectedScrollSnap() is used to get the currently selected snap.
      updateSnapData();
      api.on("select", updateSnapData);
      api.on("reInit", updateSnapData);
    }
  }, [api, placePhoto]);

  const deleteTrip = async () => {
    // Check if user is authenticated
    // If not, show the login dialog
    if (!user) {
      setOpenDialog(true);
      return;
    }

    try {
      await deleteDoc(doc(db, "Trips", tripId));
      showToast("white", "green", "Trip deleted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error deleting trip:", error);
      showToast("white", "red", "Failed to delete trip.");
    }
  };

  // ✅ Until ready, show nothing or local loader if needed
  if (!isReady) return null;

  return (
    <div className="mx-auto">
      <Carousel setApi={setApi} className="rounded-xl">
        <CarouselContent>
          {/*The expression (placePhoto.length ? placePhoto : [placeholderimg]) determines the source of the content to be displayed */}
          {(placePhoto.length // If placePhoto (an array) contains elements, it is used as the source of images.
            ? placePhoto
            : [placeholderimg]
          ) // If placePhoto is empty, a fallback array containing a single placeholderimg is used instead.
            .map((photo, index) => (
              <CarouselItem key={index}>
                {photo ? (
                  <img
                    src={photo}
                    alt={`Place Photo ${index + 1}`}
                    className="h-[170px] md:h-[400px] w-full rounded-xl shadow-md border border-gray-200 object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex items-center justify-center h-[170px] md:h-[400px] w-full rounded-xl shadow-md border border-gray-200 bg-gray-100">
                    <AiOutlineLoading3Quarters className="animate-spin text-4xl" />
                  </div>
                )}
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselNext />
        <CarouselPrevious />
      </Carousel>

      <div className="py-2 text-center text-sm text-muted-foreground">
        Slide {current} of {count}{" "}
        <span className="md:hidden block">(swip to see more)</span>
      </div>

      <div className="my-5 flex flex-col gap-2">
        <h2 className="font-bold text-sm md:text-2xl">
          {tripData?.userSelection?.place}
        </h2>
        <div className="flex justify-between items-center">
          <div className="flex flex-col md:flex-row gap-5">
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500">
              📅 {tripData?.userSelection?.days}{" "}
              {Number(tripData?.userSelection?.days) > 1 ? "Days" : "Day"}
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500">
              💰 {tripData?.userSelection?.budget} Budget
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500">
              🧍 No. Of travelers: {tripData?.userSelection?.travelers}
            </h2>
          </div>
          <div className="flex flex-col md:flex gap-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className={"bg-red-500 hover:bg-red-400 text-white"}>
                  <FaRegTrashCan />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your trip and remove your data
                    from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.preventDefault();
                      user ? deleteTrip() : setOpenDialog(true);
                    }}
                    className="bg-red-500 hover:bg-red-400 text-white"
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button>
              <FaShare />
            </Button>
          </div>
        </div>
      </div>
      <LoginDialog openDialog={openDialog} setOpenDialog={setOpenDialog} />
    </div>
  );
};

export default InfoSection;
