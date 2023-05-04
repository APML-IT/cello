import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./Loader";
import { FaTruckLoading } from "react-icons/fa";
import { WorkBook, WorkSheet, utils, writeFile } from "xlsx";
import { useNavigate } from "react-router-dom";

const AtPickup = () => {
  const token = sessionStorage.getItem("token");
  const nagivate = useNavigate();
  const [combo, setCombo] = useState([]);
  const [loader, setLoader] = useState(true);
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

  const url1 =
    "https://apis.fretron.com/automate/autoapi/run/255ab0db-70ed-4933-a0cc-b30b67b70955";
  const url2 =
    "https://apis.fretron.com/automate/autoapi/run/67953f4a-fb2d-4548-a86f-7b4ce2d710d2";

  function fetching() {
    const promise1 = axios.post(url1, url1Data, headers);
    const promise2 = axios.post(url2, url2Data, headers);

    Promise.all([promise1, promise2]).then((message) => {
      let pendingResponse = [];
      for (let i = 0; i < message[1].data.data.length; i++) {
        if (
          message[1].data.data[i].shipmentTrackingStatus === "At Pickup Point"
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
      setLoader(false);
    });
  }

  function status_color(a) {
    if (a != null) {
      return true;
    } else {
      return false;
    }
  }

  function atvsnow(a) {
    const millis = new Date().getTime();
    const difference = millis - a;
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const re = `${days}D ${hours}H ${minutes}M`;
    return re.toString();
  }

  function subtractDates1(date1, date2) {
    const difference = date1 - date2;
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const re = `${days} days ${hours} hours ${minutes} minutes`;
    return re.toString();
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
            <FaTruckLoading
              className="heading-icon"
              style={{ color: "orange" }}
            />
            <h1>
              AT PICKUP <span>{combo.length}</span>
            </h1>
          </div>
        </div>
        {loader ? (
          <Loader />
        ) : (
          <>
            <table className="main-table" id="excel_table">
              <thead>
              <tr>
                  <th className="table-th">order number </th>
                  
                  <th className="table-th">Vehicle No. </th>
                  <th className="table-th">Consignor</th>
                  <th className="table-th">Consignee</th>
                  <th className="table-th">Vehicle Type </th>
                  <th className="table-th">shipment created </th>
                  <th className="table-th">target time</th>
                  {/* <th className="table-th">SHPL instructions </th> */}
                  <th className="table-th">Special Instruction </th>
                  <th className="table-th">At | GI | LS | LE</th>
                  <th className="table-th">Now Vs arrivalTime </th>
                  <th className="table-th">gateInTime vs arrivalTime </th>
                  <th className="table-th">Load. start Vs gateInTime </th>
                  <th className="table-th">Load.End Vs Load.Start </th>
                </tr>
              </thead>
              <tbody>
                {combo.map((res) => {
                  return (
                    <tr>
                      <td className="td-main">{res.order.orderNumber}</td>
                     
                      <td className="td-main">
                        {
                          res.shipment.fleetInfo.vehicle
                            .vehicleRegistrationNumber
                        }
                      </td>
                      <td className="td-main">
                      {res.order.lineItems[0].consigner.name}
                      </td>
                      <td
                        className="td-main"
                        style={{
                          color: "rgb(16, 177, 231)",
                          fontWeight: "bold",
                        }}
                      >
                         {res.order.customFields
                          .filter((res) => res.fieldKey === "destination")
                          .map((res) => {
                            return <>{res.value}</>;
                          })}
                      </td>
                      <td className="td-main">
                      {res.order.lineItems[0].allowedLoadTypes[0]?.name}
                      </td>
                      <td className="td-main">
                      {
                          differentdate(res.shipment.creationTime) 
                        }
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
                            (res) =>
                              res.fieldKey === "expected pickup date"
                          )
                          .map((res) => {
                            return <>{differentdate(res.value)}</>;
                          })}
                      </td>
                      <td className="td-main">
                      {res.order.customFields
                          .filter((res) => res.fieldKey === "SpecialInstruction")
                          .map((res) => {
                            return <>{res.value ? res.value : "no remark"}</>;
                          })}
                      </td>
                      <td className="td-main">
                        <button
                          className="color-button"
                          style={{
                            backgroundColor: status_color(
                              res.shipment.shipmentStages[0].arrivalTime
                            )
                              ? "#00ff00"
                              : "red",
                          }}
                        ></button>
                        <button
                          className="color-button"
                          style={{
                            backgroundColor: status_color(
                              res.shipment.shipmentStages[0].gateInTime
                            )
                              ? "#00ff00"
                              : "red",
                          }}
                        ></button>
                        <button
                          className="color-button"
                          style={{
                            backgroundColor: status_color(
                              res.shipment.shipmentStages[0]
                                .actualActivityStartTime
                            )
                              ? "#00ff00"
                              : "red",
                          }}
                        ></button>
                        <button
                          className="color-button"
                          style={{
                            backgroundColor: status_color(
                              res.shipment.shipmentStages[0]
                                .actualActivityEndTime
                            )
                              ? "#00ff00"
                              : "red",
                          }}
                        ></button>
                      </td>

                      <td
                        className="td-main"
                        style={{
                          fontWeight: "bold",
                          color:
                            atvsnow(
                              res.shipment.shipmentStages[0].arrivalTime
                            ) > "-1 days 0 hours 0 minutes"
                              ? "#00ff00"
                              :  atvsnow(
                                res.shipment.shipmentStages[0].arrivalTime
                              ) <= '-1 days 0 hours 0 minutes' ?  "red" : ""
                        }}
                      >
                        {" "}
                        {atvsnow(res.shipment.shipmentStages[0].arrivalTime)}
                      </td>
                      <td
                        className="td-main"
                        style={{
                          fontWeight: "bold",
                          color:
                            subtractDates1(
                              res.shipment.shipmentStages[0].gateInTime,
                              res.shipment.shipmentStages[0].arrivalTime
                            ) > "-1 days 0 hours 0 minutes"
                              ? "#00ff00"
                              : subtractDates1(
                                  res.shipment.shipmentStages[0].gateInTime,
                                  res.shipment.shipmentStages[0].arrivalTime
                                ) <= '-1 days 0 hours 0 minutes'
                              ? "red"
                              : "",
                        }}
                      >
                        {subtractDates1(
                          res.shipment.shipmentStages[0].gateInTime,
                          res.shipment.shipmentStages[0].arrivalTime
                        ) }
                      </td>

                      <td
                        className="td-main"
                        style={{
                          fontWeight: "bold",
                          color:
                            subtractDates1(
                              res.shipment.shipmentStages[0]
                                .actualActivityStartTime,
                              res.shipment.shipmentStages[0].gateInTime
                            ) > "-1 days 0 hours 0 minutes"
                            ? "#00ff00"
                              : subtractDates1(
                                  res.shipment.shipmentStages[0]
                                    .actualActivityStartTime,
                                  res.shipment.shipmentStages[0].gateInTime
                                )  <= '-1 days 0 hours 0 minutes'
                                ? "red"
                                : "",
                        }}
                      >
                        {subtractDates1(
                          res.shipment.shipmentStages[0]
                            .actualActivityStartTime,
                          res.shipment.shipmentStages[0].gateInTime
                        )}
                      </td>

                      <td
                        className="td-main"
                        style={{
                          fontWeight: "bold",
                          color:
                            subtractDates1(
                              res.shipment.shipmentStages[0]
                                .actualActivityEndTime,
                              res.shipment.shipmentStages[0]
                                .actualActivityStartTime
                            ) > "-1 days 0 hours 0 minutes"
                            ? "#00ff00"
                              : subtractDates1(
                                  res.shipment.shipmentStages[0]
                                    .actualActivityEndTime,
                                  res.shipment.shipmentStages[0]
                                    .actualActivityStartTime
                                ) <= '-1 days 0 hours 0 minutes'
                                ? "red"
                                : "",
                        }}
                      >
                        {subtractDates1(
                          res.shipment.shipmentStages[0].actualActivityEndTime,
                          res.shipment.shipmentStages[0].actualActivityStartTime
                        ) }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </main>
    </>
  );
};

export default AtPickup;
