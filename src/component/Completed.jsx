import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "./Loader";
import { RiTruckFill } from "react-icons/ri";
import { WorkBook, WorkSheet, utils, writeFile } from "xlsx";
import { useNavigate } from "react-router-dom";

const Completed = () => {
  const token = sessionStorage.getItem("token");
  const nagivate = useNavigate();
  const [combo, setCombo] = useState([]);
  const [completeRes, setCompleteRes] = useState([]);
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
      shipmentStatus: ["Completed"],
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
      for (let i = 0; i < message[1].data.data.length; i++) {
        if (message[1].data.data[i].shipmentStatus === "Completed") {
          pendingResponse.push(message[1].data.data[i]);
        }
      }
      setCompleteRes(pendingResponse);

      const pink = [];
      pendingResponse.map((res) => {
        for (let i = 0; i < message[0].data.data.length; i++) {
          if (
            res.freightUnitLineItemId ===
            message[0].data.data[i]?.lineItems[0].freightUnitLineItemIds[0]
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

  function subtractDates1(date1, date2) {
    const difference = date1 - date2;
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const re = `${days}D ${hours}H`;
    return re.toString();
  }

  function date(a) {
    let milisecondValue = a;
    let date = new Date(milisecondValue);
    return date.toString();
  }

  function todaysdate(date1) {
    var currentDate = new Date();
    var currentTimeInMs = currentDate.getTime();
    const difference = currentTimeInMs - date1;
    // Calculate the difference in days, hours, and minutes
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    // Return the difference as a string in the format "X days Y hours Z minutes"
    const re = `${days}D ${hours}H`;
    return re.toString();
  }

  function issue_escl(a) {
    var issuename = [];
    if (a != null) {
      for (let i = 0; i < a.length; i++) {
        if (a[i].issueType === "Escalations") {
          issuename.push(a[i].issueType);
        }
      }
      return issuename.length;
    } else {
      return "0";
    }
  }

  function issue_track(a) {
    var issuename = [];
    if (a != null) {
      for (let i = 0; i < a.length; i++) {
        if (a[i].issueType === "Tracking Update") {
          issuename.push(a[i].issueType);
        }
      }
      return issuename.length;
    } else {
      return "0";
    }
  }

  function issue_abnorm(a) {
    var issuename = [];
    if (a != null) {
      for (let i = 0; i < a.length; i++) {
        if (a[i].issueType === "Abnormalities") {
          issuename.push(a[i].issueType);
        }
      }
      return issuename.length;
    } else {
      return "0";
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

  function totaldis(a) {
    var abc;
    for (let i = 0; i < a.length; i++) {
      if (a[i]["fieldKey"] === "TOTAL DISTANCE") {
        abc = a[i]["value"];
        break;
      } else {
        abc = "--";
      }
    }
    return abc;
  }

  function vehicletype(a) {
    let x;
    for (let i = 0; i < a.length; i++) {
      if (a[i]["fieldKey"] === "Vehicle-type") {
        x = a[i]["value"];
        break;
      }
    }
    return x;
  }

  function early_delay(a, b, c, d) {
    if (a === "" || a === null) {
      return "enter the km";
    }
    if (b === "20FT AIR SUSPENSION" || b === "40 FT AIR SUSPENSION") {
      var number_days = Number(a) / 200;
      const days = Math.floor(number_days) + 2;
      const DaysInMilliseconds = days * 24 * 60 * 60 * 1000;
      const timestamp = c + DaysInMilliseconds;
      var expecteddate = d;
      const timestamp1 = timestamp;
      const timestamp2 = expecteddate;
      const timeDiff = Math.abs(timestamp1 - timestamp2); // Calculate the absolute difference in milliseconds
      const oneDayInMilliseconds = 86400000;
      if (timeDiff >= oneDayInMilliseconds) {
        return "Early"; // Difference is greater than 1 day
      } else if (timeDiff >= 0.9 * oneDayInMilliseconds) {
        return "On time"; // Difference is approximately equal to 1 day
      } else {
        return "Delayed"; // Difference is less than 1 day
      }
    } else {
      var number_days = Number(a) / 300;
      const days = Math.floor(number_days) + 2;
      const DaysInMilliseconds = days * 24 * 60 * 60 * 1000;
      const timestamp = c + DaysInMilliseconds;
      var expecteddate = d;
      const timestamp1 = timestamp;
      const timestamp2 = expecteddate;
      const timeDiff = Math.abs(timestamp1 - timestamp2); // Calculate the absolute difference in milliseconds
      const oneDayInMilliseconds = 86400000;
      if (timeDiff >= oneDayInMilliseconds) {
        return "Early"; // Difference is greater than 1 day
      } else if (timeDiff >= 0.9 * oneDayInMilliseconds) {
        return "On time"; // Difference is approximately equal to 1 day
      } else {
        return "Delayed"; // Difference is less than 1 day
      }
      return timestamp;
    }
  }

  function gcimg(a) {
    var abc;
    for (let i = 0; i < a.length; i++) {
      if (a[i]["fieldKey"] === "GC Copy Image") {
        if (a[i]["value"] !== null && a[i].value !== "[]") {
          abc = a[i]["value"].split(':"')[1].split('","')[0];
          console.log(abc);
          break;
        } else {
          abc = "https://static.dieuhau.com/2016/10/uploadfailed.jpg";
        }
      } else {
        abc = "https://static.dieuhau.com/2016/10/uploadfailed.jpg";
      }
    }
    return abc;
  }
  console.log(combo);

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
            <RiTruckFill className="heading-icon" style={{ color: "orange" }} />
            <h1>
              COMPLETED <span>{combo.length}</span>
            </h1>
          </div>
        </div>
        {
          <>
            {loader ? (
              <Loader />
            ) : (
              <table className="main-table" id="excel_table">
                <thead>
                  <tr>
                    <th className="table-th">Shipment Number </th>

                    <th className="table-th">GC Number </th>
                    <th className="table-th">Stages</th>
                    <th className="table-th">Vehicle No. </th>
                    <th className="table-th">Vehicle type </th>
                    <th className="table-th">shipment created </th>
                    <th className="table-th">Material Name </th>
                    <th className="table-th">Escalations</th>
                    <th className="table-th">Tracking Update </th>
                    <th className="table-th">abnormalities</th>
                    <th className="table-th">CONSIGNOR</th>
                    <th className="table-th">CONSIGNEE</th>
                    <th className="table-th">Actual Arrival </th>
                    <th className="table-th">at vs gt </th>
                    <th className="table-th">gt vs dt </th>
                    <th className="table-th">gt vs ls </th>
                    <th className="table-th">ls vs le </th>
                    <th className="table-th">le vs dt </th>
                    <th className="table-th">at vs dt </th>
                    <th className="table-th">Transit time </th>
                    <th className="table-th">unloading at vs unls</th>
                    <th className="table-th">unloading unls vs unle</th>
                    <th className="table-th">unloading unle vs dt</th>
                    <th className="table-th">unloading at vs dt</th>
                    <th className="table-th">Total unloading Time</th>
                    <th className="table-th">Pod</th>
                    <th className="table-th">Pod since </th>
                    <th className="table-th">Pod Pic</th>
                  </tr>
                </thead>
                <tbody>
                  {combo.map((res) => {
                    return (
                      <tr>
                        <td className="td-main">
                          {res.shipment.shipmentNumber}
                        </td>

                        <td
                          className="td-main"
                          style={{ paddingRight: "12rem" }}
                        >
                          {" "}
                          <a
                            href={gcimg(
                              res.shipment.consignments[0].customFields
                            )}
                            target="_blank"
                            style={{
                              fontWeight: "bolder",
                              color:
                                gcimg(
                                  res.shipment.consignments[0].customFields
                                ) ===
                                "https://static.dieuhau.com/2016/10/uploadfailed.jpg"
                                  ? "red"
                                  : gcimg(
                                      res.shipment.consignments[0].customFields
                                    ) !==
                                    "https://static.dieuhau.com/2016/10/uploadfailed.jpg"
                                  ? "#02ff02"
                                  : "",
                            }}
                          >
                            {res.shipment.consignments[0].consignmentNo}
                          </a>{" "}
                        </td>
                        <td
                          style={{ padding: "0px" }}
                          className={
                            early_delay(
                              totaldis(
                                res.shipment.consignments[0].customFields
                              ),
                              vehicletype(res.order["customFields"]),
                              res.shipment["shipmentStages"][0][
                                "departureTime"
                              ],
                              res.shipment["shipmentStages"][1]["arrivalTime"]
                            ) === "Early"
                              ? "early"
                              : early_delay(
                                  totaldis(
                                    res.shipment.consignments[0].customFields
                                  ),
                                  vehicletype(res.order["customFields"]),
                                  res.shipment["shipmentStages"][0][
                                    "departureTime"
                                  ],
                                  res.shipment["shipmentStages"][1][
                                    "arrivalTime"
                                  ]
                                ) === "Delayed"
                              ? "delay"
                              : early_delay(
                                  totaldis(
                                    res.shipment.consignments[0].customFields
                                  ),
                                  vehicletype(res.order["customFields"]),
                                  res.shipment["shipmentStages"][0][
                                    "departureTime"
                                  ],
                                  res.shipment["shipmentStages"][1][
                                    "arrivalTime"
                                  ]
                                ) === "On time"
                              ? "ontime"
                              : ""
                          }
                        >
                          {early_delay(
                            totaldis(res.shipment.consignments[0].customFields),
                            vehicletype(res.order["customFields"]),
                            res.shipment["shipmentStages"][0]["departureTime"],
                            res.shipment["shipmentStages"][1]["arrivalTime"]
                          )}
                        </td>
                        <td className="td-main">
                          {
                            res.shipment.fleetInfo.vehicle
                              .vehicleRegistrationNumber
                          }
                        </td>
                        <td className="td-main">
                          {res.order.lineItems[0].allowedLoadTypes[0]?.name}
                        </td>
                        <td className="td-main">
                          {differentdate(res.shipment.creationTime)}
                        </td>
                        <td className="td-main">
                          {res.order.customFields
                            .filter((res) => res.fieldKey === "Material")
                            .map((res) => {
                              return <td className="td-main">{res.value}</td>;
                            })}
                        </td>
                        <td
                          className="td-main"
                          style={{
                            fontWeight: "bolder",
                            color:
                              issue_escl(res.shipment.issues) > 0
                                ? "red"
                                : "#00ff00",
                          }}
                        >
                          {issue_escl(res.shipment.issues)}
                        </td>
                        <td
                          className="td-main"
                          style={{
                            fontWeight: "bolder",
                            color:
                              issue_track(res.shipment.issues) > 0
                                ? "red"
                                : "#00ff00",
                          }}
                        >
                          {issue_track(res.shipment.issues)}
                        </td>
                        <td
                          className="td-main"
                          style={{
                            fontWeight: "bolder",
                            color:
                              issue_abnorm(res.shipment.issues) > 0
                                ? "red"
                                : "#00ff00",
                          }}
                        >
                          {issue_abnorm(res.shipment.issues)}
                        </td>
                        <td className="td-main">
                          {" "}
                          {res.shipment.consignments[0].consigner.name}
                        </td>
                        <td className="td-main">
                          {res.order.customFields
                            .filter((res) => res.fieldKey === "destination")
                            .map((res) => {
                              return <>{res.value ? res.value : "--"}</>;
                            })}
                        </td>
                        <td className="td-main">
                          {" "}
                          {date(res.shipment.shipmentStages[0].arrivalTime)}
                        </td>
                        <td
                          className="td-main"
                          style={{
                            fontWeight: "bold",
                            color:
                              subtractDates1(
                                res.shipment["shipmentStages"][0]["gateInTime"],
                                res.shipment["shipmentStages"][0]["arrivalTime"]
                              ) < "0D 1H"
                                ? "#00ff00"
                                : "red",
                          }}
                        >
                          {subtractDates1(
                            res.shipment["shipmentStages"][0]["gateInTime"],
                            res.shipment["shipmentStages"][0]["arrivalTime"]
                          )}
                        </td>
                        <td
                          className="td-main"
                          style={{
                            fontWeight: "bold",
                            color:
                              subtractDates1(
                                res.shipment["shipmentStages"][0][
                                  "departureTime"
                                ],
                                res.shipment["shipmentStages"][0]["gateInTime"]
                              ) < "0D 5H"
                                ? "#00ff00"
                                : "red",
                          }}
                        >
                          {subtractDates1(
                            res.shipment["shipmentStages"][0]["departureTime"],
                            res.shipment["shipmentStages"][0]["gateInTime"]
                          )}
                        </td>
                        <td
                          className="td-main"
                          style={{
                            fontWeight: "bold",
                            color:
                              subtractDates1(
                                res.shipment["shipmentStages"][0][
                                  "actualActivityStartTime"
                                ],
                                res.shipment["shipmentStages"][0]["gateInTime"]
                              ) < "0D 6H"
                                ? "#00ff00"
                                : "red",
                          }}
                        >
                          {" "}
                          {subtractDates1(
                            res.shipment["shipmentStages"][0][
                              "actualActivityStartTime"
                            ],
                            res.shipment["shipmentStages"][0]["gateInTime"]
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
                              ) < "0D 6H"
                                ? "#00ff00"
                                : "red",
                          }}
                        >
                          {" "}
                          {subtractDates1(
                            res.shipment.shipmentStages[0]
                              .actualActivityEndTime,
                            res.shipment.shipmentStages[0]
                              .actualActivityStartTime
                          )}
                        </td>
                        <td
                          className="td-main"
                          style={{
                            fontWeight: "bold",
                            color:
                              subtractDates1(
                                res.shipment["shipmentStages"][0][
                                  "departureTime"
                                ],
                                res.shipment["shipmentStages"][0][
                                  "actualActivityEndTime"
                                ]
                              ) < "0D 6H"
                                ? "#00ff00"
                                : "red",
                          }}
                        >
                          {" "}
                          {subtractDates1(
                            res.shipment["shipmentStages"][0]["departureTime"],
                            res.shipment["shipmentStages"][0][
                              "actualActivityEndTime"
                            ]
                          )}
                        </td>
                        <td
                          className="td-main"
                          style={{
                            fontWeight: "bold",
                            color:
                              subtractDates1(
                                res.shipment["shipmentStages"][0][
                                  "departureTime"
                                ],
                                res.shipment["shipmentStages"][0]["arrivalTime"]
                              ) < "0D 6H"
                                ? "#00ff00"
                                : "red",
                          }}
                        >
                          {" "}
                          {subtractDates1(
                            res.shipment["shipmentStages"][0]["departureTime"],
                            res.shipment["shipmentStages"][0]["arrivalTime"]
                          )}
                        </td>
                        <td
                          className="td-main"
                          style={{
                            fontWeight: "bold",
                            color:
                              subtractDates1(
                                res.shipment["shipmentStages"][1][
                                  "arrivalTime"
                                ],
                                res.shipment["shipmentStages"][0][
                                  "departureTime"
                                ]
                              ) < "0D 5H"
                                ? "#00ff00"
                                : "red",
                          }}
                        >
                          {" "}
                          {subtractDates1(
                            res.shipment["shipmentStages"][1]["arrivalTime"],
                            res.shipment["shipmentStages"][0]["departureTime"]
                          )}
                        </td>
                        <td
                          className="td-main"
                          style={{
                            fontWeight: "bold",
                            color:
                              subtractDates1(
                                res.shipment["shipmentStages"][1][
                                  "actualActivityStartTime"
                                ],
                                res.shipment["shipmentStages"][1]["arrivalTime"]
                              ) < "0D 5H"
                                ? "#00ff00"
                                : "red",
                          }}
                        >
                          {" "}
                          {subtractDates1(
                            res.shipment["shipmentStages"][1][
                              "actualActivityStartTime"
                            ],
                            res.shipment["shipmentStages"][1]["arrivalTime"]
                          )}
                        </td>
                        <td
                          className="td-main"
                          style={{
                            fontWeight: "bold",
                            color:
                              subtractDates1(
                                res.shipment["shipmentStages"][1][
                                  "actualActivityEndTime"
                                ],
                                res.shipment["shipmentStages"][1][
                                  "actualActivityStartTime"
                                ]
                              ) < "0D 6H"
                                ? "#00ff00"
                                : "red",
                          }}
                        >
                          {" "}
                          {subtractDates1(
                            res.shipment["shipmentStages"][1][
                              "actualActivityEndTime"
                            ],
                            res.shipment["shipmentStages"][1][
                              "actualActivityStartTime"
                            ]
                          )}
                        </td>
                        <td
                          className="td-main"
                          style={{
                            fontWeight: "bold",
                            color:
                              subtractDates1(
                                res.shipment["shipmentStages"][1][
                                  "departureTime"
                                ],
                                res.shipment["shipmentStages"][1][
                                  "actualActivityEndTime"
                                ]
                              ) < "0D 6H"
                                ? "#00ff00"
                                : "red",
                          }}
                        >
                          {" "}
                          {subtractDates1(
                            res.shipment["shipmentStages"][1]["departureTime"],
                            res.shipment["shipmentStages"][1][
                              "actualActivityEndTime"
                            ]
                          )}
                        </td>
                        <td
                          className="td-main"
                          style={{
                            fontWeight: "bold",
                            color:
                              subtractDates1(
                                res.shipment["shipmentStages"][1][
                                  "departureTime"
                                ],
                                res.shipment["shipmentStages"][1]["arrivalTime"]
                              ) < "0D 6H"
                                ? "#00ff00"
                                : "red",
                          }}
                        >
                          {" "}
                          {subtractDates1(
                            res.shipment["shipmentStages"][1]["departureTime"],
                            res.shipment["shipmentStages"][1]["arrivalTime"]
                          )}
                        </td>
                        <td
                          className="td-main"
                          style={{
                            fontWeight: "bold",
                            color:
                              subtractDates1(
                                res.shipment["shipmentStages"][1][
                                  "departureTime"
                                ],
                                res.shipment["shipmentStages"][1]["arrivalTime"]
                              ) < "0D 5H"
                                ? "#00ff00"
                                : "red",
                          }}
                        >
                          {" "}
                          {subtractDates1(
                            res.shipment["shipmentStages"][1]["departureTime"],
                            res.shipment["shipmentStages"][1]["arrivalTime"]
                          )}
                        </td>
                        <td
                          className="td-main"
                          style={{
                            fontWeight: "bolder",
                            color:
                              res.shipment.consignments[0]?.pod &&
                              res.shipment.consignments[0]?.pod?.status ===
                                "PENDING"
                                ? "red"
                                : res.shipment.consignments[0]?.pod?.status ===
                                  "SUBMITTED"
                                ? "#00ff00"
                                : "red",
                          }}
                        >
                          {" "}
                          {res.shipment.consignments[0].pod
                            ? res.shipment.consignments[0].pod.status
                            : "PENDING"}
                        </td>
                        <td className="td-main">
                          {" "}
                          {todaysdate(
                            res.shipment.shipmentStages[1].departureTime
                          )}
                        </td>
                        <td className="td-main" style={{ lineHeight: "2rem" }}>
                          {" "}
                          <span>
                            {res.shipment.consignments[0]?.pod &&
                            res.shipment.consignments[0]?.pod?.documents ? (
                              <a
                                style={{ color: "#ff06ff", fontWeight: "bold" }}
                                href={
                                  res.shipment.consignments[0]?.pod
                                    ?.documents[0].downloadUrl
                                }
                                target="_blank"
                                rel="noreferrer"
                              >
                                FRONT PIC
                              </a>
                            ) : (
                              "WATING"
                            )}
                          </span>
                          <br />
                          <span>
                            {res.shipment.consignments[0]?.pod &&
                            res.shipment.consignments[0]?.pod?.documents ? (
                              <a
                                style={{ color: "#ff06ff", fontWeight: "bold" }}
                                href={
                                  res.shipment.consignments[0]?.pod
                                    ?.documents[0].downloadUrl
                                }
                                target="_blank"
                                rel="noreferrer"
                              >
                                BACK PIC
                              </a>
                            ) : (
                              "FOR PIC"
                            )}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </>
        }
      </main>
    </>
  );
};

export default Completed;
