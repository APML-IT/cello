import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./Loader";
import { MdSpatialTracking } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const TrackingUpdates = () => {
  const token = sessionStorage.getItem("token");
  const nagivate = useNavigate();
  const [pendingShipmentX, setPendingShipmentX] = useState([]);
  const [completeShipmentX, setCompleteShipmentX] = useState([]);
  const [loader, setLoader] = useState(true);

  const urlOrder1 =
    "https://apis.fretron.com/automate/autoapi/run/255ab0db-70ed-4933-a0cc-b30b67b70955";
  const urlShipment1 =
    "https://apis.fretron.com/automate/autoapi/run/67953f4a-fb2d-4548-a86f-7b4ce2d710d2";
  const urlOrder2 =
    "https://apis.fretron.com/automate/autoapi/run/255ab0db-70ed-4933-a0cc-b30b67b70955";
  const urlShipment2 =
    "https://apis.fretron.com/automate/autoapi/run/67953f4a-fb2d-4548-a86f-7b4ce2d710d2";

  var param1 = {
    filters: {
      shipmentStatus: ["Planned", "Created"],
      customer: ["CELLO INDUSTRIES PRIVATE LIMITED"],
      // "origin": ["Navi Mumbai","Mumbai","Bhiwandi","Hyderabad","Bangalore","Chennai"],
      shipmentDate: {
        from: 1680287400000,
      },
    },
  };

  var data1 = {
    filters: {
      customer: ["CELLO INDUSTRIES PRIVATE LIMITED"],
      orderDate: {
        from: 1680287400000,
      },
    },
    limit: 5000,
  };

  var param2 = {
    filters: {
      shipmentStatus: ["Completed"],
      customer: ["CELLO INDUSTRIES PRIVATE LIMITED"],
      // "origin": ["Navi Mumbai","Mumbai","Bhiwandi","Hyderabad","Bangalore","Chennai"],
      shipmentDate: {
        from: 1680287400000,
      },
    },
  };

  var data2 = {
    filters: {
      customer: ["CELLO INDUSTRIES PRIVATE LIMITED"],
      orderDate: {
        from: 1680287400000,
      },
    },
    limit: 5000,
  };

  var headers = {
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NjQ2MDI2MDIsInVzZXJJZCI6Ijc3N2Q5YzIwLTEyNWYtNDhhZS04MWZjLTUzZWI2ZWM3MjZmZSIsImVtYWlsIjoiZGF0YS5zY2llbmNlQGFnYXJ3YWxwYWNrZXJzLmNvbSIsIm1vYmlsZU51bWJlciI6IjgyOTE4NDk1NjUiLCJvcmdJZCI6IjQwNTJhYjI0LTA1NDMtNGNkNC1iNTE3LTllNzhlZmVlNGZlZCIsIm5hbWUiOiJQcml5YWVzaCBQYXRlbCIsIm9yZ1R5cGUiOiJGTEVFVF9PV05FUiIsImlzR29kIjpmYWxzZSwicG9ydGFsVHlwZSI6ImJhc2ljIn0.cJR4aISn0MMed1zPQqPxkMsZTn0_9N0W9n1D5mCzLMw",
    "Content-Type": "application/json",
  };

  function fetching() {
    const orderPromise1 = axios.post(urlOrder1, data1, headers);
    const shipmentPromise1 = axios.post(urlShipment1, param1, headers);
    const orderPromise2 = axios.post(urlOrder2, data2, headers);
    const shipmentPromise2 = axios.post(urlShipment2, param2, headers);

    Promise.all([
      orderPromise1,
      shipmentPromise1,
      orderPromise2,
      shipmentPromise2,
    ]).then((message) => {
      // tracking update complete shipment
      var pendingShipement = [];
      for (let i = 0; i < message[1].data.data.length; i++) {
        if (
          message[1].data.data[i].issues != null &&
          message[1].data.data[i].issues[0]?.issueType === "Tracking Update"
        ) {
          pendingShipement.push(message[1].data.data[i]);
          setPendingShipmentX(pendingShipement);
        }
      }

      // tracking update complete shipment
      var completeShipement = [];
      for (let i = 0; i < message[3].data.data.length; i++) {
        if (
          message[3].data.data[i].issues != null &&
          message[3].data.data[i].issues[0]?.issueType === "Tracking Update"
        ) {
          completeShipement.push(message[3].data.data[i]);
        }
      }
      setCompleteShipmentX(completeShipement);
      setLoader(false);
    });
  }

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
        <div className="main_table-heading">
          <div className="heading">
            <MdSpatialTracking
              className="heading-icon"
              style={{ color: "orange" }}
            />
            <h1>TRACKING UPDATES </h1>
          </div>
        </div>
        {loader ? (
          <Loader />
        ) : (
          <>
            <h1 style={{ color: "black", fontWeight: "500" }}>
              PENDING &nbsp;{pendingShipmentX.length}{" "}
            </h1>
            <div className="two-tables">
              <table className="first-table">
                <thead>
                  <tr>
                    <th className="table-th-short">gc Number </th>
                    <th className="table-th-short">consigner</th>
                    <th className="table-th-short">consignee</th>
                    <th className="table-th-short">Issue Name </th>
                    <th className="table-th-short">Created at </th>
                    <th className="table-th-short">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingShipmentX.map((res) => {
                    return (
                      <tr>
                        <td className="table-td-short">
                          {res.consignments[0].consignmentNo}
                        </td>
                        <td className="table-td-short">
                          {res.consignments[0].consigner.name}
                        </td>
                        <td className="table-td-short">
                          {res.customFields
                            .filter((res) => res.fieldKey === "destination")
                            .map((res) => {
                              return <>{res.value}</>;
                            })}
                        </td>
                        <td className="table-td-short">
                          {res.issues && res.issues[0].issueType}
                        </td>
                        <td className="table-td-short">
                          {differentdate(res.shipment.creationTime)}
                        </td>
                        <td className="table-td-short">
                          {res.issues[0].customFields
                            .filter((res) => res.fieldKey === "Remarks : ")
                            .map((res) => {
                              return <>{res.value}</>;
                            })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div>
                <div style={{ marginTop: "-3.2rem" }}>
                  <h1 style={{ color: "black", fontWeight: "500" }}>
                    COMPLETED &nbsp;{completeShipmentX.length}
                  </h1>
                </div>

                <table className="second-table">
                  <thead>
                    <tr>
                      <th className="table-th-short">gc Number </th>
                      <th className="table-th-short">consigner</th>
                      <th className="table-th-short">consignee</th>
                      <th className="table-th-short">Issue Name </th>
                      <th className="table-th-short">Created at </th>
                      <th className="table-th-short">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completeShipmentX.map((res) => {
                      return (
                        <tr>
                          <td className="table-td-short">
                            {res.consignments[0].consignmentNo}
                          </td>
                          <td className="table-td-short">
                            {res.consignments[0].consigner.name}
                          </td>
                          <td className="table-td-short">
                            {res.customFields
                              .filter((res) => res.fieldKey === "destination")
                              .map((res) => {
                                return <>{res.value}</>;
                              })}
                          </td>
                          <td className="table-td-short">
                            {res.issues && res.issues[0].issueType}
                          </td>
                          <td className="table-td-short">
                            {differentdate(res.shipment.creationTime)}
                          </td>
                          <td className="table-td-short">
                            {res.issues[0].customFields
                              .filter((res) => res.fieldKey === "Remarks : ")
                              .map((res) => {
                                return <>{res.value}</>;
                              })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default TrackingUpdates;
