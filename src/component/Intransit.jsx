import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import Loader from "./Loader";
import { TbTruckDelivery } from "react-icons/tb";
import { WorkBook, WorkSheet, utils, writeFile } from "xlsx";
import { useNavigate } from "react-router-dom";

const Intransit = () => {
  const token = sessionStorage.getItem("token");
  const nagivate = useNavigate();
  const [combo, setCombo] = useState([]);
  const [sheetData, setSheetData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [shee, setShee] = useState();

  const headers = {
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NjQ2MDI2MDIsInVzZXJJZCI6Ijc3N2Q5YzIwLTEyNWYtNDhhZS04MWZjLTUzZWI2ZWM3MjZmZSIsImVtYWlsIjoiZGF0YS5zY2llbmNlQGFnYXJ3YWxwYWNrZXJzLmNvbSIsIm1vYmlsZU51bWJlciI6IjgyOTE4NDk1NjUiLCJvcmdJZCI6IjQwNTJhYjI0LTA1NDMtNGNkNC1iNTE3LTllNzhlZmVlNGZlZCIsIm5hbWUiOiJQcml5YWVzaCBQYXRlbCIsIm9yZ1R5cGUiOiJGTEVFVF9PV05FUiIsImlzR29kIjpmYWxzZSwicG9ydGFsVHlwZSI6ImJhc2ljIn0.cJR4aISn0MMed1zPQqPxkMsZTn0_9N0W9n1D5mCzLMw",
    "Content-Type": "application/json",
  };

  const url1Data = {
    filters: {
     customer:["BHARAT FRITZ WERNER LIMITED"],
      orderDate: {
        from: 1680287400000,
      },
    },
    limit: 5000,
  };

  const url2Data = {
    filters: {
      shipmentStatus: ["Planned", "Created"],
      // customer:["BHARAT FRITZ WERNER LIMITED"],
      customer: ["BHARAT FRITZ WERNER LIMITED"],
      shipmentDate: {
        from: 1680287400000,
      },
    },
  };

  // var config1 = {
  //   method: "get",
  //   maxBodyLength: Infinity,
  //   url: "https://script.googleusercontent.com/a/macros/agarwalpackers.com/echo?user_content_key=liluZGoKsVsI56pRMCbhaWgXdKTyvEzljs8wXtM7ZZwxRvYrxCKbroPEdPlGYY5qa9EQ6vY05Qi1xKcZE-Y8QzE0ZFrkxCriOJmA1Yb3SEsKFZqtv3DaNYcMrmhZHmUMi80zadyHLKCzuoJ5WTSD9188tqLxoWbKVeS6iIHTYzLJN6pUfYvVdeVlG5jFSmZBnga7jA1jJv2Ff-ndfXe0m_cBNwR9NdQAJQvZbyK2Sn14j10FjQKB0WW2AeJY_LhcNDLB45iwYI_Ty7jWPDs9-kALmaJ23tE4L5nWh-m0S0U&lib=Mste7nhVMiwHbCBqAdeBeQ0a1jiuL8Xjw",
  // };

  const url1 =
    "https://apis.fretron.com/automate/autoapi/run/255ab0db-70ed-4933-a0cc-b30b67b70955";
  const url2 =
    "https://apis.fretron.com/automate/autoapi/run/67953f4a-fb2d-4548-a86f-7b4ce2d710d2";

  const url3 =
    "https://script.googleusercontent.com/a/macros/agarwalpackers.com/echo?user_content_key=liluZGoKsVsI56pRMCbhaWgXdKTyvEzljs8wXtM7ZZwxRvYrxCKbroPEdPlGYY5qa9EQ6vY05Qi1xKcZE-Y8QzE0ZFrkxCriOJmA1Yb3SEsKFZqtv3DaNYcMrmhZHmUMi80zadyHLKCzuoJ5WTSD9188tqLxoWbKVeS6iIHTYzLJN6pUfYvVdeVlG5jFSmZBnga7jA1jJv2Ff-ndfXe0m_cBNwR9NdQAJQvZbyK2Sn14j10FjQKB0WW2AeJY_LhcNDLB45iwYI_Ty7jWPDs9-kALmaJ23tE4L5nWh-m0S0U&lib=Mste7nhVMiwHbCBqAdeBeQ0a1jiuL8Xjw";

  async function fetching() {
    const promise1 = await axios.post(url1, url1Data, headers);
    const promise2 = await axios.post(url2, url2Data, headers);
    const promise3 = await axios.get(url3, Infinity);

    Promise.all([promise1, promise2, promise3]).then((message) => {
      let pendingResponse = [];
      for (let i = 0; i < message[1].data.data.length; i++) {
        if (
          message[1].data.data[i].shipmentTrackingStatus ===
          "Enroute For Delivery"
        ) {
          pendingResponse.push(message[1].data.data[i]);
        }
      }

      const pink = [];
      pendingResponse.map((res) => {
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
            pink.push(obj);
          } else {
            pink.push({ noMatch: true, ...res });
          }
        }
      });

      let pink1 = [];
      pink.map((res) => {
        if (res.shipment) {
          pink1.push(res);
        }
        setCombo(pink1);
      });

      var datamain = [];
      for (var i = 0; i < message[2].data.length; i++) {
        if (
          message[2].data[i]?.rc_regn_no !== "" &&
          message[2].data[i]?.rc_regn_no !== "#N/A" &&
          message[2].data[i]?.rc_regn_no !== "Vehicle Number"
        ) {
          var obj = {
            rc_fit_upto: message[2].data[i].rc_fit_upto,
            rc_regn_no: message[2].data[i]?.rc_regn_no,
            rc_insurance_upto: message[2].data[i]?.rc_insurance_upto,
            rc_pucc_upto: message[2].data[i]?.rc_pucc_upto,
            rc_np_upto: message[2].data[i]?.rc_np_upto,
            rc_permit_valid_upto: message[2].data[i]?.rc_permit_valid_upto,
          };
          datamain.push(obj);
        }
      }

      var main = [];
      combo.map((res) => {
        for (var n = 0; n < datamain.length; n++) {
          if (
            datamain[n].rc_regn_no ===
            res.shipment.fleetInfo.vehicle.vehicleRegistrationNumber
          ) {
            main.push(datamain[n]);
          }
          setSheetData(main);
        }
      });
      setLoader(false);
    });
  }

  function subtractDates1(date1, date2) {
    const difference = date1 - date2;
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const re = `${days} D ${hours} H ${minutes} M`;
    return re.toString();
  }

  function remaingkms(a) {
    var kms = Math.floor(a / 1000);
    const re = kms + "kms";
    return re;
  }

  function color(a) {
    for (let i = 0; i < sheetData.length; i++) {
      let fit = a[i].rc_fit_upto;
      let inc = a[i].rc_insurance_upto;
      let puc = a[i].rc_pucc_upto;
      let np = a[i].rc_np_upto;
      let permit = a[i].rc_permit_valid_upto;

      if (fit.rc_fit_upto) {
        return false;
      } else if (inc.rc_insurance_upto) {
        return false;
      } else if (puc.rc_pucc_upto) {
        return false;
      } else if (np.rc_np_upto) {
        return false;
      } else if (permit.rc_permit_valid_upto) {
        return false;
      } else {
        return true;
      }
    }
  }

  const exportExcelFile = () => {
    const element = document.getElementById("excel_table");
    let ws = utils.table_to_sheet(element);
    /* generate workbook and add the worksheet */
    let wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Sheet1");
    /* save to file */
    writeFile(wb, "sample.xlsx");
  };


  function differentdate(a) {
    let date = new Date(a);
    let milliseconds = date.getTime();
    const currentDate = new Date();
    const currentTimestamp = currentDate.getTime();
    const expectedPickupDate = milliseconds;
    const expectedPickupTimestamp = expectedPickupDate;
    let days, hours, minutes;
    if (expectedPickupTimestamp > currentTimestamp) {
      const difference = expectedPickupTimestamp - currentTimestamp;
      days = Math.floor(difference / (1000 * 60 * 60 * 24));
      hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    } else if (currentTimestamp > expectedPickupTimestamp) {
      const difference = currentTimestamp - expectedPickupTimestamp;
      days = Math.floor(difference / (1000 * 60 * 60 * 24)) * -1;
      hours =
        Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) *
        -1;
      minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)) * -1;
    } else {
      days = 0;
      hours = 0;
      minutes = 0;
    }
    const re = days + "d" + hours + "h" + minutes + "m";
    return re;
  }

   // map
   var origindata = [];
   var destinationdata = [];
   var vehicleloaction = [];
   var vehiclenumber = [];
   var remaingkm = [];
 
   for (var i = 0; i < combo.length; i++) {
     remaingkm.push(
       Math.round(
         combo[i].shipment["shipmentStages"][1]["tripPoint"]["remainingDistance"]
       ) / 1000
     );
     var latitude4 =
       combo[i].shipment.currentLocation !== null
         ? Number(combo[i].shipment.currentLocation.latitude)
         : 19.076;
     var longitude4 =
       combo[i].shipment.currentLocation !== null
         ? Number(combo[i].shipment.currentLocation.longitude)
         : 72.8777;
     vehicleloaction.push(latitude4 + "," + longitude4);
     vehiclenumber.push(
       combo[i].shipment.fleetInfo.vehicle.vehicleRegistrationNumber
     );
     if (
       combo[i].shipment.shipmentStages[0].hub !== null &&
       combo[i].shipment.shipmentStages[1].hub
     ) {
       var latitude = Number(
         combo[i].shipment.shipmentStages[0].place.center.latitude
       );
       var longitude = Number(
         combo[i].shipment.shipmentStages[0].place.center.longitude
       );
       origindata.push(latitude + "," + longitude);
       var latitude2 = Number(
         combo[i].shipment.shipmentStages[1].place.center.latitude
       );
       var longitude2 = Number(
         combo[i].shipment.shipmentStages[1].place.center.longitude
       );
       destinationdata.push(latitude2 + "," + longitude2);
     } else {
       // origindata.push(datamain[i].shipmentStages[0].place.center.latitude+','+datamain[i].shipmentStages[0].place.center.longitude)
       // destinationdata.push(datamain[i].shipmentStages[1].place.center.latitude+','+datamain[i].shipmentStages[1].place.center.longitude)
       var latitude = Number(
         combo[i].shipment.shipmentStages[0].place.center.latitude
       );
       var longitude = Number(
         combo[i].shipment.shipmentStages[0].place.center.longitude
       );
       origindata.push(latitude + "," + longitude);
       var latitude2 = Number(
         combo[i].shipment.shipmentStages[1].place.center.latitude
       );
       var longitude2 = Number(
         combo[i].shipment.shipmentStages[1].place.center.longitude
       );
       destinationdata.push(latitude2 + "," + longitude2);
     }
   }
 
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
    axios
      .get("https://fire-hot-hardhat.glitch.me/auth", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.message === "Authorized") {
          fetching();
        }
      })
      .catch((err) => {
        nagivate("/");
      });
  }, []);
  return (
    <>
      <main>
        <div className="main_table-export">
          <div className="export">
            <button onClick={exportExcelFile}>
              <h1> EXPORT</h1>
            </button>
          </div>
        </div>
        <div className="main_table-heading">
          <div className="heading">
            <TbTruckDelivery
              className="heading-icon"
              style={{ color: "orange" }}
            />
            <h1>
              INTRANSIT <span>{combo.length}</span>
            </h1>
          </div>
        </div>
        {loader ? (
          <Loader />
        ) : (
          <>
            <table className=" main-table" id="excel_table">
              <thead>
              <tr>
                  <th className="table-th">order number</th>
                  
                  <th className="table-th">eway exp </th>
                  <th className="table-th">gc Number </th>
                  <th className="table-th">Vehicle No. </th>
                  <th className="table-th">Driver no. </th>
                  <th className="table-th">Vehicle type </th>
                  <th className="table-th">remaing kms </th>
                  <th className="table-th">Current Loc. </th>
                  <th className="table-th"> Consignor </th>
                  <th className="table-th"> Consignee</th>
                  <th className="table-th">expected time </th>
                  <th className="table-th">gateInTime vs arrivalTime </th>
                  <th className="table-th">departureTime vs gateInTime </th>
                </tr>
              </thead>
              <tbody>
                {combo.map((res) => {
                  return (
                    <tr>
                    <td className="td-main">{res.order.orderNumber}</td>
                   
                    <td
                      className="td-main"
                      style={{ fontWeight: "bolder", color: "#00ff00" }}
                    >
                      {differentdate(res.shipment?.consignments[0].eWayBillExpiryDate)  ? differentdate(res.shipment?.consignments[0].eWayBillExpiryDate) :  "--"}
                    </td>
                    <td className="td-main">
                      {res.shipment.consignments[0].consignmentNo}
                    </td>
                    <td className="td-main">
                      {
                        res.shipment.fleetInfo.vehicle
                          .vehicleRegistrationNumber
                      }
                    </td>
                    <td className="td-main">
                      {res.shipment.fleetInfo.driver.mobileNumber
                        ? res.shipment.fleetInfo.driver.mobileNumber
                        : "-"}
                    </td>
                    <td className="td-main">
                    {res.order.lineItems[0].allowedLoadTypes[0]?.name}

                    </td>
                    <td
                      className="td-main"
                      style={{
                        color: "rgb(16, 177, 231)",
                        fontWeight: "bolder",
                      }}
                    >
                      {remaingkms(
                        res.shipment.shipmentStages[1].tripPoint
                          .remainingDistance
                      )}
                    </td>
                    <td
                      className="td-main"
                      style={{ color: "red", fontWeight: "bolder" }}
                    >
                      {res.shipment.currentLocation?.address ? res.shipment.currentLocation?.address : "--"}
                    </td>
                    <td className="td-main">
                      {res.order.lineItems[0].consigner.name}
                    </td>
                    <td
                      className="td-main"
                      style={{
                        color: "rgb(16, 177, 231)",
                        fontWeight: "bolder",
                      }}
                    >
                       {res.order.customFields
                        .filter((res) => res.fieldKey === "destination")
                        .map((res) => {
                          return <>{res ? res.value : "--"}</>;
                        })}
                    </td>
                    <td className="td-main"  style={{
                        fontWeight: "bolder",
                        color:
                          differentdate(res.value) > 86400000
                            ? "#00ff00"
                            : differentdate(res.value) > 21600000 &&
                              differentdate(res.value) < 86400000
                            ? "yellow"
                            : differentdate(res.value) > 0 &&
                              differentdate(res.value) < 21600000
                            ? "orange"
                            : "red",
                      }}>
                      {res.order.customFields
                        .filter(
                          (res) => res.fieldKey === "expected delivery date"
                        )
                        .map((res) => {
                          return <>{differentdate(res.value) }</>;
                        })}
                    </td>
                    <td
                      className="td-main"
                      style={{
                        fontWeight: "bolder",
                        color:
                          subtractDates1(
                            res.shipment.shipmentStages[0].gateInTime,
                            res.shipment.shipmentStages[0].arrivalTime
                          ) > "-1 days 0 hours 0 minutes"
                            ? "#00ff00"
                            :  "red",
                      }}
                    >
                      {" "}
                      {subtractDates1(
                        res.shipment.shipmentStages[0].gateInTime,
                        res.shipment.shipmentStages[0].arrivalTime
                      )}
                    </td>
                    <td
                      className="td-main"
                      style={{
                        fontWeight: "bolder",
                        color:
                          subtractDates1(
                            res.shipment.shipmentStages[0].departureTime,
                            res.shipment.shipmentStages[0].gateInTime
                          ) > "-1 days 0 hours 0 minutes"
                            ? "#00ff00"
                            : "red",
                      }}
                    >
                      {subtractDates1(
                        res.shipment.shipmentStages[0].departureTime,
                        res.shipment.shipmentStages[0].gateInTime
                      )}
                    </td>
                   
                  </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="bottom">
              <div
                className="left"
                style={{
                  color: "black",
                  marginTop: "1.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div class="maps">
                  &nbsp;&nbsp;{" "}
                  
                  <br />
                  <br />
                  <div class="india" id="map"></div>
                </div>
              </div>
            </div>

           
          </>
        )}
      </main>
    </>
  );
};

export default Intransit;
