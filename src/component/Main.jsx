import React from "react";
import { MdFireTruck } from "react-icons/md";
import { FaTruckPickup, FaTruckLoading, FaList } from "react-icons/fa";
import { RiTruckFill } from "react-icons/ri";
import { TbTruckDelivery } from "react-icons/tb";
import { useEffect, useState } from "react";
import axios from "axios";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Loader from "./Loader";

const Main = () => {
  const [pendingStatus, setPendingStatus] = useState([]);
  const [completeStatus, setCompleteStatus] = useState([]);
  const [enrouteForPickup, setEnrouteForPickup] = useState([]);
  const [atPickup, setAtPickup] = useState([]);
  const [atUnloading, setAtUnloading] = useState([]);
  const [intransit, setIntransit] = useState([]);
  const [loader, setLoader] = useState(true);

  const headers = {
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NjQ2MDI2MDIsInVzZXJJZCI6Ijc3N2Q5YzIwLTEyNWYtNDhhZS04MWZjLTUzZWI2ZWM3MjZmZSIsImVtYWlsIjoiZGF0YS5zY2llbmNlQGFnYXJ3YWxwYWNrZXJzLmNvbSIsIm1vYmlsZU51bWJlciI6IjgyOTE4NDk1NjUiLCJvcmdJZCI6IjQwNTJhYjI0LTA1NDMtNGNkNC1iNTE3LTllNzhlZmVlNGZlZCIsIm5hbWUiOiJQcml5YWVzaCBQYXRlbCIsIm9yZ1R5cGUiOiJGTEVFVF9PV05FUiIsImlzR29kIjpmYWxzZSwicG9ydGFsVHlwZSI6ImJhc2ljIn0.cJR4aISn0MMed1zPQqPxkMsZTn0_9N0W9n1D5mCzLMw",
    "Content-Type": "application/json",
  };

  const url1Data = {
    filters: {
      customer: ["CELLO INDUSTRIES PRIVATE LIMITED"],
      orderDate: {
        from: 1680287400000,
      },
    },
    limit: 5000,
  };

  const url2Data = {
    filters: {
      shipmentStatus: ["Planned", "Created", "Completed"],
      //customer: ["CELLO INDUSTRIES PRIVATE LIMITED"],
      customer: ["CELLO INDUSTRIES PRIVATE LIMITED"],
      shipmentDate: {
        from: 1680287400000,
      },
    },
  };

  const url1 =
    "https://apis.fretron.com/automate/autoapi/run/255ab0db-70ed-4933-a0cc-b30b67b70955";
  const url2 =
    "https://apis.fretron.com/automate/autoapi/run/67953f4a-fb2d-4548-a86f-7b4ce2d710d2";

  function fetching() {
    const promise1 = axios.post(url1, url1Data, headers);
    const promise2 = axios.post(url2, url2Data, headers);

    Promise.all([promise1, promise2]).then((message) => {
      let pendingResponse = [];
      for (let i = 0; i < message[0].data.data.length; i++) {
        if (
          message[0].data.data[i].secondaryStatus === "PARTIALLY_PLANNED" ||
          message[0].data.data[i].secondaryStatus === "CREATED"
        ) {
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
      //  atunloading
      const unlo = [];
      atunloading.map((res) => {
        for (let i = 0; i < message[0].data.data.length; i++) {
          if (
            res.freightUnitLineItemId ===
              message[0].data.data[i]?.lineItems[0]
                ?.freightUnitLineItemIds[0] ||
            res.freightUnitLineItemId ===
              message[0].data.data[i]?.lineItems[1]
                ?.freightUnitLineItemIds[0] ||
            res.freightUnitLineItemId ===
              message[0].data.data[i]?.lineItems[2]
                ?.freightUnitLineItemIds[0] ||
            res.freightUnitLineItemId ===
              message[0].data.data[i]?.lineItems[3]?.freightUnitLineItemIds[0]
          ) {
            var obj = {
              order: message[0].data.data[i],
              shipment: res,
            };
            unlo.push(obj);
          }
        }
      });

      let unlo1 = [];
      unlo.map((res) => {
        if (res.shipment) {
          unlo1.push(res);
        }
        setAtUnloading(unlo1);
      });

      // atpickup
      const atpi = [];
      atpickup.map((res) => {
        for (let i = 0; i < message[0].data.data.length; i++) {
          if (
            res.freightUnitLineItemId ===
              message[0].data.data[i]?.lineItems[0]
                ?.freightUnitLineItemIds[0] ||
            res.freightUnitLineItemId ===
              message[0].data.data[i]?.lineItems[1]
                ?.freightUnitLineItemIds[0] ||
            res.freightUnitLineItemId ===
              message[0].data.data[i]?.lineItems[2]
                ?.freightUnitLineItemIds[0] ||
            res.freightUnitLineItemId ===
              message[0].data.data[i]?.lineItems[3]?.freightUnitLineItemIds[0]
          ) {
            var obj = {
              order: message[0].data.data[i],
              shipment: res,
            };
            atpi.push(obj);
          }
        }
      });

      let atpi1 = [];
      atpi.map((res) => {
        if (res.shipment) {
          atpi1.push(res);
        }
        setAtPickup(atpi1);
      });

      // enrouteForPickup
      const enro = [];
      enrouteforpickup.map((res) => {
        for (let i = 0; i < message[0].data.data.length; i++) {
          if (
            res.freightUnitLineItemId ===
              message[0].data.data[i]?.lineItems[0]
                ?.freightUnitLineItemIds[0] ||
            res.freightUnitLineItemId ===
              message[0].data.data[i]?.lineItems[1]
                ?.freightUnitLineItemIds[0] ||
            res.freightUnitLineItemId ===
              message[0].data.data[i]?.lineItems[2]
                ?.freightUnitLineItemIds[0] ||
            res.freightUnitLineItemId ===
              message[0].data.data[i]?.lineItems[3]?.freightUnitLineItemIds[0]
          ) {
            var obj = {
              order: message[0].data.data[i],
              shipment: res,
            };
            enro.push(obj);
          }
        }
      });

      let enro1 = [];
      enro.map((res) => {
        if (res.shipment) {
          enro1.push(res);
        }
        setEnrouteForPickup(enro1);
      });

      // intransit

      const intra = [];
      intransit.map((res) => {
        for (let i = 0; i < message[0].data.data.length; i++) {
          if (
            res.freightUnitLineItemId ===
              message[0].data.data[i]?.lineItems[0]
                ?.freightUnitLineItemIds[0] ||
            res.freightUnitLineItemId ===
              message[0].data.data[i]?.lineItems[1]
                ?.freightUnitLineItemIds[0] ||
            res.freightUnitLineItemId ===
              message[0].data.data[i]?.lineItems[2]
                ?.freightUnitLineItemIds[0] ||
            res.freightUnitLineItemId ===
              message[0].data.data[i]?.lineItems[3]?.freightUnitLineItemIds[0]
          ) {
            var obj = {
              order: message[0].data.data[i],
              shipment: res,
            };
            intra.push(obj);
          } else {
            intra.push({ noMatch: true, ...res });
          }
        }
      });

      let intra1 = [];
      intra.map((res) => {
        if (res.shipment) {
          intra1.push(res);
        }
        setIntransit(intra1);
      });

      setLoader(false);
    });
  }

  // map
  var origindata = [];
  var destinationdata = [];
  var vehicleloaction = [];
  var vehiclenumber = [];
  var remaingkm = [];

  navigator.geolocation.getCurrentPosition((position) => {
    var coordinates = origindata;
    var datatr = coordinates.map((x) => [
      parseFloat(x.split(",")[0]),
      parseFloat(x.split(",")[1]),
    ]);
    var coordinates12 = destinationdata;
    var datatr12 = coordinates12.map((x) => [
      parseFloat(x.split(",")[0]),
      parseFloat(x.split(",")[1]),
    ]);
    var coordinates14 = vehicleloaction;
    var datatr14 = coordinates14.map((x) => [
      parseFloat(x.split(",")[0]),
      parseFloat(x.split(",")[1]),
    ]);
    var coordinates15 = vehiclenumber;
    var datatr15 = coordinates15;
    var coordinates16 = remaingkm;
    var datatr16 = coordinates16;
    var statelatlong = [
      {
        state: "Andhra Pradesh",
        capital: "Amaravati",
        latitude: 16.5745,
        longitude: 80.3736,
      },
      {
        state: "Arunachal Pradesh",
        capital: "Itanagar",
        latitude: 27.102,
        longitude: 93.692,
      },
      {
        state: "Assam",
        capital: "Dispur",
        latitude: 26.1433,
        longitude: 91.7898,
      },
      {
        state: "Bihar",
        capital: "Patna",
        latitude: 25.5941,
        longitude: 85.1376,
      },
      {
        state: "Chhattisgarh",
        capital: "Raipur",
        latitude: 21.2514,
        longitude: 81.6296,
      },
      {
        state: "Goa",
        capital: "Panaji",
        latitude: 15.4909,
        longitude: 73.8278,
      },
      {
        state: "Gujarat",
        capital: "Gandhinagar",
        latitude: 23.2156,
        longitude: 72.6369,
      },
      {
        state: "Haryana",
        capital: "Chandigarh",
        latitude: 30.7333,
        longitude: 76.7794,
      },
      {
        state: "Himachal Pradesh",
        capital: "Shimla",
        latitude: 31.1048,
        longitude: 77.1734,
      },
      {
        state: "Jharkhand",
        capital: "Ranchi",
        latitude: 23.3441,
        longitude: 85.3096,
      },
      {
        state: "Karnataka",
        capital: "Bengaluru",
        latitude: 12.9716,
        longitude: 77.5946,
      },
      {
        state: "Kerala",
        capital: "Thiruvananthapuram",
        latitude: 8.5241,
        longitude: 76.9366,
      },
      {
        state: "Madhya Pradesh",
        capital: "Bhopal",
        latitude: 23.2599,
        longitude: 77.4126,
      },
      {
        state: "Maharashtra",
        capital: "Mumbai",
        latitude: 19.076,
        longitude: 72.8777,
      },
      {
        state: "Manipur",
        capital: "Imphal",
        latitude: 24.817,
        longitude: 93.9368,
      },
      {
        state: "Meghalaya",
        capital: "Shillong",
        latitude: 25.5788,
        longitude: 91.8933,
      },
      {
        state: "Mizoram",
        capital: "Aizawl",
        latitude: 23.7367,
        longitude: 92.7146,
      },
      {
        state: "Nagaland",
        capital: "Kohima",
        latitude: 25.6747,
        longitude: 94.11,
      },
      {
        state: "Odisha",
        capital: "Bhubaneswar",
        latitude: 20.2961,
        longitude: 85.8245,
      },
      {
        state: "Punjab",
        capital: "Chandigarh",
        latitude: 30.7333,
        longitude: 76.7794,
      },
      {
        state: "Rajasthan",
        capital: "Jaipur",
        latitude: 26.9124,
        longitude: 75.7873,
      },
      {
        state: "Sikkim",
        capital: "Gangtok",
        latitude: 27.3389,
        longitude: 88.6065,
      },
      {
        state: "Tamil Nadu",
        capital: "Chennai",
        latitude: 13.0827,
        longitude: 80.2707,
      },
      {
        state: "Telangana",
        capital: "Hyderabad",
        latitude: 17.385,
        longitude: 78.4867,
      },
      {
        state: "Tripura",
        capital: "Agartala",
        latitude: 23.8315,
        longitude: 91.2868,
      },
      {
        state: "Uttar Pradesh",
        capital: "Lucknow",
        latitude: 26.8467,
        longitude: 80.9462,
      },
      {
        state: "Uttarakhand",
        capital: "Dehradun",
        latitude: 30.3165,
        longitude: 78.0322,
      },
      {
        state: "West Bengal",
        capital: "Kolkata",
        latitude: 22.5726,
        longitude: 88.3639,
      },
    ];
    const latLong1 = [19.8628, 76.9629];
    let mymap = L.map("map").setView(latLong1, 4);
    var NASAGIBS_ViirsEarthAtNight2012 = L.tileLayer(
      "https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}",
      {
        attribution:
          'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
        bounds: [
          [-85.0511287776, -179.999999975],
          [85.0511287776, 179.999999975],
        ],
        minZoom: 1,
        maxZoom: 8,
        format: "jpg",
        time: "",
        tilematrixset: "GoogleMapsCompatible_Level",
      }
    );
    var Stamen_TonerLite = L.tileLayer(
      "https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}",
      {
        attribution:
          'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: "abcd",
        minZoom: 0,
        maxZoom: 20,
        ext: "png",
      }
    );
    var Stadia_AlidadeSmoothDark = L.tileLayer(
      "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 20,
        attribution:
          '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
      }
    );
    mymap.addLayer(Stadia_AlidadeSmoothDark);
    let DefaultIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
      iconSize: [25, 41],
    });
    L.Marker.prototype.options.icon = DefaultIcon;
    for (var i = 0; i < datatr12.length; i++) {
      let marker5 = new L.marker([datatr14[i][0], datatr14[i][1]])
        .bindPopup(datatr14[i][0])
        .addTo(mymap);
      marker5.bindPopup(
        `<b>${datatr15[i]}<br><span style="color:red;">${datatr16[i]}kms.</span></b>`
      );
      var polygon = L.polyline([
        [datatr12[i][0], datatr12[i][1]],
        [datatr14[i][0], datatr14[i][1]],
      ]).addTo(mymap);
      var polygon1 = L.polyline([
        [datatr[i][0], datatr[i][1]],
        [datatr14[i][0], datatr14[i][1]],
      ]).addTo(mymap);
      polygon.setStyle({
        color: "red",
        dashArray: "5, 5",
        dashOffset: "0",
      });
      polygon1.setStyle({
        color: "green",
        dashArray: "15, 15",
        dashOffset: "0",
      });
      let circle1 = L.circle([datatr[i][0], datatr[i][1]], {
        color: "yellow",
        fillColor: "#f03",
        fillOpacity: 0.5,
        radius: 5000,
      }).addTo(mymap);
      let circle = L.circle([datatr12[i][0], datatr12[i][1]], {
        color: "red",
        fillColor: "#252525",
        fillOpacity: 0.5,
        radius: 5000,
      }).addTo(mymap);
    }
    for (var i = 0; i < statelatlong.length; i++) {
      let marker51 = new L.marker(
        [statelatlong[i].latitude, statelatlong[i].longitude],
        {
          icon: L.icon({
            iconUrl: "https://cdn-icons-png.flaticon.com/512/3995/3995483.png",
            iconSize: [11, 13],
          }),
          iconSize: [45, 45],
        }
      )
        .bindPopup(statelatlong[i].capital)
        .addTo(mymap);
    }
  });

  useEffect(() => {
    fetching();
  }, []);

  return (
    <div>
      {loader ? (
        <Loader />
      ) : (
        <>
          {" "}
          <div className="top"></div>
          <div className="middle">
            <div className="card">
              <div className="pending-order">
                <div className="first">
                  <FaList className="icon" style={{ color: "orange" }} />
                  <h1>PENDING ORDERS</h1>
                </div>
                <div className="last">{pendingStatus.length}</div>
              </div>

              <div className="pending-order">
                <div className="first">
                  <FaTruckPickup className="icon" style={{ color: "green" }} />
                  <h1>ENROUTE FOR PICKUP</h1>
                </div>
                <div className="last">{enrouteForPickup.length}</div>
              </div>

              <div className="pending-order">
                <div className="first">
                  <FaTruckLoading
                    className="icon"
                    style={{ color: "#c94c4c" }}
                  />
                  <h1>AT PICKUP</h1>
                </div>
                <div className="last">{atPickup.length}</div>
              </div>

              <div className="pending-order" style={{ marginTop: "1.5rem" }}>
                <div className="first">
                  <MdFireTruck className="icon" style={{ color: "#80ced6" }} />
                  <h1>AT UNLOADING</h1>
                </div>
                <div className="last">{atUnloading.length}</div>
              </div>

              <div className="pending-order" style={{ marginTop: "1.5rem" }}>
                <div className="first">
                  <TbTruckDelivery
                    className="icon"
                    style={{ color: "#FFCC00" }}
                  />
                  <h1>INTRANSIT</h1>
                </div>
                <div className="last">{intransit.length}</div>
              </div>

              <div className="pending-order" style={{ marginTop: "1.5rem" }}>
                <div className="first">
                  <RiTruckFill className="icon" style={{ color: "green" }} />
                  <h1>COMPLETED</h1>
                </div>
                <div className="last">{completeStatus.length}</div>
              </div>
            </div>
          </div>
          <div className="bottom">
            <div
              className="left"
              style={{ color: "black", marginTop: "1.5rem" }}
            >
              <div class="maps">
                &nbsp;&nbsp;{" "}
                <span
                  class="counter"
                  style={{ fontSize: "25px", color: "aliceblue" }}
                >
                  {" "}
                  <i
                    class="fa-solid fa-truck-fast"
                    style={{ color: "green" }}
                  />{" "}
                  Transit Vehicle Map
                </span>
                <br />
                <br />
                <div class="india" id="map"></div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Main;
