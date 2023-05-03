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
      // customer: ["EPIROC"],
      customer: ["EPIROC"],
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
                  <th className="table-th">Job Number </th>
                  <th className="table-th">eway exp </th>
                  <th className="table-th">gc Number </th>
                  <th className="table-th">Vehicle No. </th>
                  <th className="table-th">Driver no. </th>
                  <th className="table-th">Vehicle type </th>
                  <th className="table-th">remaing kms </th>
                  <th className="table-th">Current Loc. </th>
                  <th className="table-th"> Consignor </th>
                  <th className="table-th"> Consignee</th>
                  <th className="table-th">Fit | INC | PUC | NP | PERMIT </th>
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
                    <td className="td-main">
                          {res.order.customFields
                            .filter((res) => res.fieldKey === "job no")
                            .map((res) => {
                              return <td className="td-main">{res.value}</td>;
                            })}
                        </td>
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
                  

                    <td className="td-main">
                      <button
                        className="color-button"
                        style={{
                          backgroundColor: color(sheetData)
                            ? "#00ff00"
                            : "red",
                        }}
                      ></button>

                      <button
                        className="color-button"
                        style={{
                          backgroundColor: color(sheetData)
                            ? "#00ff00"
                            : "red",
                        }}
                      ></button>
                      <button
                        className="color-button"
                        style={{
                          backgroundColor: color(sheetData)
                            ? "#00ff00"
                            : "red",
                        }}
                      ></button>
                      <button
                        className="color-button"
                        style={{
                          backgroundColor: color(sheetData)
                            ? "#00ff00"
                            : "red",
                        }}
                      ></button>
                      <button
                        className="color-button"
                        style={{
                          backgroundColor: color(sheetData)
                            ? "#00ff00"
                            : "red",
                        }}
                      ></button>
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
           
          </>
        )}
      </main>
    </>
  );
};

export default Intransit;
