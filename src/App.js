import Home from "./component/Home";
import { Navigate, Route, Routes } from "react-router-dom";
import PendingOrder from "./component/PendingOrder";
import EnrouteForPickup from "./component/EnrouteForPickup";
import AtPickup from "./component/AtPickup";
import AtUnloading from "./component/AtUnloading";
import Intransit from "./component/Intransit";
import Completed from "./component/Completed";
import Pod from "./component/Pod";
import Billing from "./component/Billing";
import Payment from "./component/Payment";
import Aside from "./component/Aside";
import TrackingUpdates from "./component/TrackingUpdates";
import Escalations from "./component/Escalations";
import Abnormalities from "./component/Abnormalities";
import OrderForm from "./component/OrderForm";
import FirstPage from "./component/FirstPage";
import MBR from "./component/MBR";
import Charts from "./component/Charts";
import LoginForm from "./component/LoginForm/LoginForm";

function App() {
  return (
    <div className="container">
      <Routes>
        <Route exact path="/" element={<FirstPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="*" element={<Navigate to="/home" />} />
        <Route path="/home" element={[<Aside />, <Home />]} />
        <Route path="/pendingorder" element={[<Aside />, <PendingOrder />]} />
        <Route
          path="/enrouteforpicup"
          element={[<Aside />, <EnrouteForPickup />]}
        />
        <Route path="/atpickup" element={[<Aside />, <AtPickup />]} />
        <Route path="/atunloading" element={[<Aside />, <AtUnloading />]} />
        <Route path="/intransit" element={[<Aside />, <Intransit />]} />
        <Route path="/completed" element={[<Aside />, <Completed />]} />
        <Route path="/orderform" element={[<Aside />, <OrderForm />]} />
        <Route path="/pod" element={[<Aside />, <Pod />]} />
        <Route path="/billing" element={[<Aside />, <Billing />]} />
        <Route path="/payment" element={[<Aside />, <Payment />]} />
        <Route path="/charts" element={[<Aside />, <Charts />]} />
        <Route path="/mbr" element={[<Aside />, <MBR />]} />
        <Route
          path="/trackingupdate"
          element={[<Aside />, <TrackingUpdates />]}
        />
        <Route path="/escalations" element={[<Aside />, <Escalations />]} />
        <Route path="/abnormalities" element={[<Aside />, <Abnormalities />]} />
      </Routes>
    </div>
  );
}

export default App;
