import { Button } from "@/components/ui/button";
import HeroSection from "./components/custom/HeroSection";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/custom/Header";
import HomePage from "./pages/HomePage";
import ViewTrip from "./pages/ViewTrip";
import CreateTrip from "./pages/CreateTrip";
import MyTrips from "./pages/MyTrips";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<HeroSection />} />
          <Route path="/create-trip" element={<CreateTrip />} />
          <Route path="/view-trip/:tripId" element={<ViewTrip />} />
          <Route path="/my-trips" element={<MyTrips />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
