import img1 from "../assets/logo1.png";
import {
  MdOutlinePendingActions,
  MdOutlinePayment,
  MdSpatialTracking,
  MdOutlineEscalator,
} from "react-icons/md";
import {
  AiOutlineFileDone,
  AiOutlineAreaChart,
  AiOutlineLineChart,
  AiOutlineLogout,
} from "react-icons/ai";
import {
  FaTruckPickup,
  FaTruckLoading,
  FaCreativeCommonsSa,
  FaWpforms,
} from "react-icons/fa";
import { BsMinecartLoaded } from "react-icons/bs";
import { GiTruck } from "react-icons/gi";
import { RxDashboard } from "react-icons/rx";
import { GrCompliance } from "react-icons/gr";
import { VscVmRunning } from "react-icons/vsc";
import { RiBilliardsFill } from "react-icons/ri";
import { SiCodereview } from "react-icons/si";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import logo1 from "../assets/glovis.png";

const Aside = () => {
  const navigate = useNavigate();
  const [pendingStatus, setPendingStatus] = useState([]);
  const [completeStatus, setCompleteStatus] = useState([]);
  const [enrouteForPickup, setEnrouteForPickup] = useState([]);
  const [atPickup, setAtPickup] = useState([]);
  const [atUnloading, setAtUnloading] = useState([]);
  const [intransit, setIntransit] = useState([]);
  const [payment, setPayment] = useState([]);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  const headers = {
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NjQ2MDI2MDIsInVzZXJJZCI6Ijc3N2Q5YzIwLTEyNWYtNDhhZS04MWZjLTUzZWI2ZWM3MjZmZSIsImVtYWlsIjoiZGF0YS5zY2llbmNlQGFnYXJ3YWxwYWNrZXJzLmNvbSIsIm1vYmlsZU51bWJlciI6IjgyOTE4NDk1NjUiLCJvcmdJZCI6IjQwNTJhYjI0LTA1NDMtNGNkNC1iNTE3LTllNzhlZmVlNGZlZCIsIm5hbWUiOiJQcml5YWVzaCBQYXRlbCIsIm9yZ1R5cGUiOiJGTEVFVF9PV05FUiIsImlzR29kIjpmYWxzZSwicG9ydGFsVHlwZSI6ImJhc2ljIn0.cJR4aISn0MMed1zPQqPxkMsZTn0_9N0W9n1D5mCzLMw",
    "Content-Type": "application/json",
  };

  const url1Data = {
    filters: {
      consigner: [
        "SHPL- KOLKATA AIRPORT- SIEMENS HEALTHCARE PVT.LTD.",
        "SHPL- CHENNAI SEAPORT- SIEMENS HEALTHCARE PVT.LTD.",
        "SHPL- DELHI AIRPORT- SIEMENS HEALTHCARE PVT.LTD.",
        "SHPL - APML BHIWANDI- SIEMENS HEALTHCARE PVT LTD",
        "SHPL- BANGALORE AIRPORT- SIEMENS HEALTHCARE PVT.LTD.",
        "SHPL-APML CHENNAI- SIEMENS HEALTHCARE PVT.LTD.",
        "SHPL-KOLKATA WAREHOUSE- SIEMENS HEALTHCARE PVT.LTD.",
        "SHPL-BANGALORE WAREHOUSE- SIEMENS HEALTHCARE PVT.LTD.",
        "SHPL-CHENNAI WAREHOUSE- SIEMENS HEALTHCARE PVT.LTD.",
        "SHPL-DELHI WAREHOUSE- SIEMENS HEALTHCARE PVT.LTD.",
        "SHPL - NAVA SHEVA- SIEMENS HEALTHCARE PVT LTD",
        "SHPL- KOLKATA SEAPORT- SIEMENS HEALTHCARE PVT.LTD.",
        "SHPL- CHENNAI AIRPORT- SIEMENS HEALTHCARE PVT.LTD",
        "SHPL - BGR WAREHOUSE- SIEMENS HEALTHCARE PVT.LTD",
        "SHPL-APML BANGALORE- SIEMENS HEALTHCARE PVT.LTD.",
        "SHPL - APML CHOWK - SIEMENS HEALTHCARE PVT LTD",
        "SHPL - MUMBAI AIRPORT - SIEMENS HEALTHCARE PVT LTD",
        "SHPL - PRESS METAL COMPANY - SIEMENS HEALTHCARE PVT. LTD.",
        "SHPL - RAJLAXMI LOGISTICS PARK- SIEMENS HEALTHCARE PVT LTD",
      ],
      orderDate: {
        from: 1680287400000,
      },
    },
    limit: 5000,
  };

  const url2Data = {
    filters: {
      shipmentStatus: ["Planned", "Created", "Completed"],
      customer: ["BHARAT FRITZ WERNER LIMITED"],
      shipmentDate: {
        from: 1680287400000,
      },
    },
  };

  const url3Data = {
    filters: {
      shipmentStatus: ["Planned", "Created"],
      customer: ["BHARAT FRITZ WERNER LIMITED"],
    },
  };

  const url1 =
    "https://apis.fretron.com/automate/autoapi/run/255ab0db-70ed-4933-a0cc-b30b67b70955";
  const url2 =
    "https://apis.fretron.com/automate/autoapi/run/67953f4a-fb2d-4548-a86f-7b4ce2d710d2";

  function fetching() {
    const promise1 = axios.post(url1, url1Data, headers);
    const promise2 = axios.post(url2, url2Data, headers);
    const promise3 = axios.post(url2, url3Data, headers);

    Promise.all([promise1, promise2, promise3]).then((message) => {
      setPayment(message[2].data.data);
      let pendingResponse = [];
      for (let i = 0; i < message[0].data.data.length; i++) {
        if (message[0].data.data[i].secondaryStatus === "CREATED") {
          pendingResponse.push(message[0].data.data[i]);
        }
      }
      setPendingStatus(pendingResponse);

      let completeResponse = [];
      for (let i = 0; i < message[1].data.data.length; i++) {
        if (message[1].data.data[i].shipmentStatus === "Completed") {
          completeResponse.push(message[1].data.data[i]);
        }
      }
      setCompleteStatus(completeResponse);

      let enrouteforpickup = [];
      let atpickup = [];
      let atunloading = [];
      let intransit = [];
      for (let i = 0; i < message[1].data.data.length; i++) {
        if (
          message[1].data.data[i].shipmentTrackingStatus ===
          "Enroute For Pickup"
        ) {
          enrouteforpickup.push(message[1].data.data[i]);
        } else if (
          message[1].data.data[i].shipmentTrackingStatus === "At Delivery Point"
        ) {
          atunloading.push(message[1].data.data[i]);
        } else if (
          message[1].data.data[i].shipmentTrackingStatus === "At Pickup Point"
        ) {
          atpickup.push(message[1].data.data[i]);
        } else if (
          message[1].data.data[i].shipmentTrackingStatus ===
          "Enroute For Delivery"
        ) {
          intransit.push(message[1].data.data[i]);
        }
      }
      setEnrouteForPickup(enrouteforpickup);
      setAtPickup(atpickup);
      setAtUnloading(atunloading);
      setIntransit(intransit);
    });
  }

  const activeLink = "active";
  const normalLink = "";

  useEffect(() => {
    fetching();
  }, []);

  return (
    <div className="container">
      <div className="back-style">
        <aside>
          <div className="top">
            <div className="logo">
              <img src={img1} alt="" className="img1" />
              <>
                {/* <h5>
                EPIROC 
              </h5> */}
                <img
                  src="https://www.cellowriting.com/public/img/cello-logo.png"
                  alt=""
                  className="logo1"
                />
              </>
            </div>
          </div>

          <div className="side-bar">
            <NavLink
              to="/home"
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <span>
                <RxDashboard className="custome-svg" />
              </span>
              <h3>DASHBOARD </h3>
            </NavLink>

            <div
              style={{
                borderBottom: "3px solid black",
                marginTop: "1rem",
                marginBottom: "1rem",
              }}
            ></div>

            <NavLink
              to="/orderform"
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <span>
                {" "}
                <FaWpforms className="custome-svg" />
              </span>
              <h3>ORDER FORM</h3>
            </NavLink>

            <NavLink
              to="/pendingorder"
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <span>
                <MdOutlinePendingActions className="custome-svg" />
              </span>
              <h3>PENDING ORDERS </h3>
            </NavLink>

            <NavLink
              to="/enrouteforpicup"
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <span>
                {" "}
                <FaTruckPickup className="custome-svg" />
              </span>
              <h3>ENROUTE FOR PICKUP </h3>
            </NavLink>

            <NavLink
              to="/atpickup"
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <span>
                {" "}
                <FaTruckLoading className="custome-svg" />
              </span>
              <h3>AT PICKUP</h3>
            </NavLink>

            <NavLink
              to="/intransit"
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <span>
                {" "}
                <GiTruck className="custome-svg" />
              </span>
              <h3>INTRANSIT </h3>
            </NavLink>

            <NavLink
              to="/atunloading"
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <span>
                {" "}
                <BsMinecartLoaded className="custome-svg" />
              </span>
              <h3>AT UNLOADING </h3>
            </NavLink>

            <NavLink
              to="/completed"
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <span>
                {" "}
                <AiOutlineFileDone className="custome-svg" />
              </span>
              <h3>COMPLETE </h3>
            </NavLink>

            <NavLink
              to="/pod"
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <span>
                {" "}
                <VscVmRunning className="custome-svg" />
              </span>
              <h3>POD</h3>
            </NavLink>

            <NavLink
              to="/billing"
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <span>
                {" "}
                <RiBilliardsFill className="custome-svg" />
              </span>
              <h3>BILLING </h3>
            </NavLink>

            <NavLink
              to="/payment"
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <span>
                {" "}
                <MdOutlinePayment className="custome-svg" />
              </span>
              <h3>PAYMENT</h3>
            </NavLink>

            {/* <NavLink
              to="/charts"
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <span>
                {" "}
                <AiOutlineAreaChart className="custome-svg" />
              </span>
              <h3>CHARTS</h3>
            </NavLink> */}

            {/* <NavLink
              to="/mbr"
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <span>
                {" "}
                <AiOutlineLineChart className="custome-svg" />
              </span>
              <h3>
                MBR 
              </h3>
            </NavLink> */}

            {/* <NavLink to="/qbr"  className={({isActive}) => isActive ? activeLink : normalLink}>
            <span>
              {" "}
              <SiCodereview className="custome-svg" />
            </span>
            <h3>
              QBR <span className="message-count">{payment.length}</span>
            </h3>
          </NavLink> */}

            <div
              style={{
                borderBottom: "3px solid black",
                marginTop: "1rem",
                marginBottom: "1rem",
              }}
            ></div>

            <NavLink
              to="/trackingupdate"
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <span>
                {" "}
                <MdSpatialTracking className="custome-svg" />
              </span>
              <h3>TRACKING UPDATE</h3>
            </NavLink>

            <NavLink
              to="/escalations"
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <span>
                {" "}
                <MdOutlineEscalator className="custome-svg" />
              </span>
              <h3>ESCALATIONS</h3>
            </NavLink>

            <NavLink
              to="/abnormalities"
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <span>
                {" "}
                <FaCreativeCommonsSa className="custome-svg" />
              </span>
              <h3>ABNORMALITIES</h3>
            </NavLink>

            <div
              style={{
                borderBottom: "3px solid black",
                marginTop: "1rem",
                marginBottom: "1rem",
              }}
            ></div>
            <div className="logout-main">
              <span>
                <AiOutlineLogout className="custome-svg" />
              </span>
              <button className="button__logout" onClick={handleLogout}>
                Log Out
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Aside;
