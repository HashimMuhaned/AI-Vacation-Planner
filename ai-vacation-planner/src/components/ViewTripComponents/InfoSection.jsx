import React, { useEffect, useState } from "react";
import placeholderimg from "../../assets/placeholder.jpg"; // Placeholder image
import { Button } from "../ui/button";
import { FaShare } from "react-icons/fa6";
import {
  getCountryImage,
  getCountryImagesUnSplash,
} from "@/services/GglPlaceImgApi";
// import { Card, CardContent } from "@/components/ui/card";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaRegTrashCan } from "react-icons/fa6";
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

const InfoSection = ({ tripData }) => {
  const [placePhoto, setPlacePhoto] = useState([]);
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  console.log("tripData: ", tripData);

  useEffect(() => {
    const getPlacePhotos = async () => {
      try {
        const placeName = tripData?.userSelection?.place;
        const photos = await getCountryImagesUnSplash(placeName);
        setPlacePhoto(photos); // Now an array!
      } catch (error) {
        console.error("Error fetching country photos:", error);
      }
    };

    if (tripData?.userSelection?.place) {
      getPlacePhotos();
    }
  }, [tripData]);

  useEffect(() => {
    if (api) {
      const updateSnapData = () => {
        const snaps = api.scrollSnapList();
        setCount(snaps.length);
        setCurrent(api.selectedScrollSnap() + 1);
      };

      updateSnapData(); // run initially
      api.on("select", updateSnapData); // update on slide change
      api.on("reInit", updateSnapData); // update on carousel re-render
    }
  }, [api, placePhoto]); // watch placePhoto too

  const deleteTrip = async () => {
    if (!user) {
      setOpenDialog(true); // trigger login if not authenticated
      return;
    }

    try {
      await deleteDoc(doc(db, "Trips", tripId));
      showToast("white", "green", "Trip deleted successfully!");
      navigate("/"); // go to home or wherever you want after delete
    } catch (error) {
      console.error("Error deleting trip:", error);
      showToast("white", "red", "Failed to delete trip.");
    }
  };

  return (
    <div className="mx-auto">
      <Carousel setApi={setApi} className="rounded-xl">
        <CarouselContent>
          {(placePhoto.length ? placePhoto : [placeholderimg]).map(
            (photo, index) => (
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
            )
          )}
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
                    This action cannot be undone. This will permanently delete
                    your trip and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.preventDefault();
                      if (!user) {
                        setOpenDialog(true); // trigger Google login
                      } else {
                        // proceed with trip deletion
                        deleteTrip(); // make sure you define this function
                      }
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
