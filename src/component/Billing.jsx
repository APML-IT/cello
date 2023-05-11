import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "./Loader";
import { RiBilliardsFill } from "react-icons/ri";
import { WorkBook, WorkSheet, utils, writeFile } from "xlsx";
import { useNavigate } from "react-router-dom";

function Billing() {
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

  const exportExcelFile = () => {
    const element = document.getElementById("excel_table");
    let ws = utils.table_to_sheet(element);
    /* generate workbook and add the worksheet */
    let wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Sheet1");
    /* save to file */
    writeFile(wb, "sample.xlsx");
  };

  function poname(a) {
    var abc;
    for (let i = 0; i < a.length; i++) {
      if (a[i]["fieldKey"] === "PO NAME") {
        abc = a[i]["value"];
        break;
      } else if (!a[i]["fieldKey"]) {
        abc = "--";
      } else {
        abc = "--";
      }
    }
    return abc;
  }
  function podate(a) {
    var abc;
    for (let i = 0; i < a.length; i++) {
      if (a[i]["fieldKey"] === "PO DATE") {
        abc = a[i]["value"];
        break;
      } else if (!a[i]["fieldKey"]) {
        abc = "--";
      } else {
        abc = "--";
      }
    }
    return abc;
  }

  function typeoftrip(a) {
    var abc;
    for (let i = 0; i < a.length; i++) {
      if (a[i]["fieldKey"] === "Type of Trip") {
        abc = a[i]["value"];
        break;
      } else if (!a[i]["fieldKey"]) {
        abc = "--";
      } else {
        abc = "--";
      }
    }
    return abc;
  }

  function pincode(a) {
    var abc;
    for (let i = 0; i < a.length; i++) {
      if (a[i]["fieldKey"] === "PINCODE") {
        abc = a[i]["value"];
        break;
      } else if (!a[i]["fieldKey"]) {
        abc = "--";
      } else {
        abc = "--";
      }
    }
    return abc;
  }

  function billnumber(a) {
    var abc;
    for (let i = 0; i < a.length; i++) {
      if (a[i]["fieldKey"] === "BILL NUMBER") {
        abc = a[i]["value"];
        break;
      } else if (!a[i]["fieldKey"]) {
        abc = "--";
      } else {
        abc = "--";
      }
    }
    return abc;
  }

  function billdate(a) {
    var abc;
    for (let i = 0; i < a.length; i++) {
      if (a[i]["fieldKey"] === "BILL DATE") {
        abc = a[i]["value"];
        break;
      } else if (!a[i]["fieldKey"]) {
        abc = "--";
      } else {
        abc = "--";
      }
    }
    return abc;
  }

  function billsuborgenr(a) {
    var abc;
    for (let i = 0; i < a.length; i++) {
      if (a[i]["fieldKey"] === "BILL SUBMITED OR GENR.") {
        abc = a[i]["value"];
        break;
      } else if (!a[i]["fieldKey"]) {
        abc = "--";
      } else {
        abc = "--";
      }
    }
    return abc;
  }

  function grmnumber(a) {
    var abc;
    for (let i = 0; i < a.length; i++) {
      if (a[i]["fieldKey"] === "GRM NUMBER") {
        abc = a[i]["value"];
        break;
      } else if (!a[i]["fieldKey"]) {
        abc = "--";
      } else {
        abc = "--";
      }
    }
    return abc;
  }

  function grndate(a) {
    var abc;
    for (let i = 0; i < a.length; i++) {
      if (a[i]["fieldKey"] === "grn date") {
        abc = a[i]["value"];
        break;
      } else if (!a[i]["fieldKey"]) {
        abc = "--";
      } else {
        abc = "--";
      }
    }
    return abc;
  }

  function totaldistance(a) {
    var abc;
    for (let i = 0; i < a.length; i++) {
      if (a[i]["fieldKey"] === "TOTAL DISTANCE") {
        abc = a[i]["value"];
        break;
      } else if (!a[i]["fieldKey"]) {
        abc = "--";
      } else {
        abc = "--";
      }
    }
    return abc;
  }

  function additionaldistance(a) {
    var abc;
    for (let i = 0; i < a.length; i++) {
      if (a[i]["fieldKey"] === "ADDITIONAL DISTANCE") {
        abc = a[i]["value"];
        break;
      } else if (!a[i]["fieldKey"]) {
        abc = "--";
      } else {
        abc = "--";
      }
    }
    return abc;
  }

  function zone(a) {
    var abc;
    for (let i = 0; i < a.length; i++) {
      if (a[i]["fieldKey"] === "ZONE") {
        abc = a[i]["value"];
        break;
      } else if (!a[i]["fieldKey"]) {
        abc = "--";
      } else {
        abc = "--";
      }
    }
    return abc;
  }

  function rate(a) {
    var abc;
    for (let i = 0; i < a.length; i++) {
      if (a[i]["fieldKey"] === "RATE") {
        abc = a[i]["value"];
        break;
      } else if (!a[i]["fieldKey"]) {
        abc = "--";
      } else {
        abc = "--";
      }
    }
    return abc;
  }

  function loading(a) {
    var abc;
    for (let i = 0; i < a.length; i++) {
      if (a[i]["fieldKey"] === "LOADING") {
        abc = a[i]["value"];
        break;
      } else if (!a[i]["fieldKey"]) {
        abc = "--";
      } else {
        abc = "--";
      }
    }
    return abc;
  }

  function unloading(a) {
    var abc;
    for (let i = 0; i < a.length; i++) {
      if (a[i]["fieldKey"] === "UNLOADING") {
        abc = a[i]["value"];
        break;
      } else if (!a[i]["fieldKey"]) {
        abc = "--";
      } else {
        abc = "--";
      }
    }
    return abc;
  }

  function haltingcharger(a) {
    var abc;
    for (let i = 0; i < a.length; i++) {
      if (a[i]["fieldKey"] === "HALTING CHARGER") {
        abc = a[i]["value"];
        break;
      } else if (!a[i]["fieldKey"]) {
        abc = "--";
      } else {
        abc = "--";
      }
    }
    return abc;
  }

  function twopointlounlo(a) {
    var abc;
    for (let i = 0; i < a.length; i++) {
      if (a[i]["fieldKey"] === "TWO POINT LOADING /UNLOADING") {
        abc = a[i]["value"];
        break;
      } else if (!a[i]["fieldKey"]) {
        abc = "--";
      } else {
        abc = "--";
      }
    }
    return abc;
  }

  function status(a) {
    var abc;
    var def;
    var twopoilounlos;
    var halt;
    var ghi;

    for (let i = 0; i < a.length; i++) {
      if (a[i]["fieldKey"] === "HALTING CHARGER") {
        def = a[i]["value"];
        break;
      } else if (!a[i]["fieldKey"]) {
        def = "--";
      } else {
        def = "--";
      }
    }
    halt = def;

    for (let i = 0; i < a.length; i++) {
      if (a[i]["fieldKey"] === "TWO POINT LOADING /UNLOADING") {
        abc = a[i]["value"];
        break;
      } else if (!a[i]["fieldKey"]) {
        abc = "--";
      } else {
        abc = "--";
      }
    }
    twopoilounlos = abc;

    if (halt === null && twopoilounlos === null) {
      ghi = "PENDING";
    } else if (halt === "0" && twopoilounlos === "0") {
      ghi = "APPROVED";
    } else {
      ghi = "--";
    }
    return ghi;
  }

  function additionalcost(a) {
    var abc;
    for (let i = 0; i < a.length; i++) {
      if (a[i]["fieldKey"] === "ADDITIONAL COST") {
        abc = a[i]["value"];
        break;
      } else if (!a[i]["fieldKey"]) {
        abc = "--";
      } else {
        abc = "--";
      }
    }
    return abc;
  }

  function taxablevalue(a) {
    var abc;
    for (let i = 0; i < a.length; i++) {
      if (a[i]["fieldKey"] === "TAXABLE VALUE") {
        abc = a[i]["value"];
        break;
      } else if (!a[i]["fieldKey"]) {
        abc = "--";
      } else {
        abc = "--";
      }
    }
    return abc;
  }

  function gst(a) {
    var abc;
    for (let i = 0; i < a.length; i++) {
      if (a[i]["fieldKey"] === "GST") {
        abc = a[i]["value"];
        break;
      } else if (!a[i]["fieldKey"]) {
        abc = "--";
      } else {
        abc = "--";
      }
    }
    return abc;
  }

  function grandtotal(a) {
    var abc;
    for (let i = 0; i < a.length; i++) {
      if (a[i]["fieldKey"] === "GRAND TOTAL") {
        abc = a[i]["value"];
        break;
      } else if (!a[i]["fieldKey"]) {
        abc = "--";
      } else {
        abc = "--";
      }
    }
    return abc;
  }

  function remark(a) {
    var abc;
    for (let i = 0; i < a.length; i++) {
      if (a[i]["fieldKey"] === "REMARKS") {
        abc = a[i]["value"];
        break;
      } else if (!a[i]["fieldKey"]) {
        abc = "--";
      } else {
        abc = "--";
      }
    }
    return abc;
  }

  function invoice(a) {
    var abc;
    for (let i = 0; i < a.length; i++) {
      if (a[i]["fieldKey"] === "invoice") {
        abc = true;
        break;
      } else {
        abc = false;
      }
    }
    return abc;
  }

  function dis(a) {
    var abc;
    for (let i = 0; i < a.length; i++) {
      if (a[i]["fieldKey"] === "dis") {
        abc = true;
        break;
      } else {
        abc = false;
      }
    }
    return abc;
  }

  function eway(a) {
    var abc;
    for (let i = 0; i < a.length; i++) {
      if (a[i]["fieldKey"] === "eway") {
        abc = true;
        break;
      } else {
        abc = false;
      }
    }
    return abc;
  }

  function packinglist(a) {
    var abc;
    for (let i = 0; i < a.length; i++) {
      if (a[i]["fieldKey"] === "packing list") {
        abc = true;
        break;
      } else {
        abc = false;
      }
    }
    return abc;
  }

  function sonumber(a) {
    var abc;
    for (let i = 0; i < a.length; i++) {
      if (a[i]["fieldKey"] == "S.O Number/PO") {
        abc = a[i]["value"];
        break;
      } else {
        abc = "--";
      }
    }
    return abc;
  }
  function wbcost(a) {
    var abc;
    for (let i = 0; i < a.length; i++) {
      if (a[i]["fieldKey"] == "WBS/COST") {
        abc = a[i]["value"];
        break;
      } else {
        abc = "--";
      }
    }
    return abc;
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
            <RiBilliardsFill
              className="heading-icon"
              style={{ color: "orange" }}
            />
            <h1>
              BILLING <span>{combo.length}</span>
            </h1>
          </div>
        </div>
        {loader ? (
          <Loader />
        ) : (
          <>
            {" "}
            <table className="main-table" id="excel_table">
              <thead>
                <tr>
                  <th className="table-th">GC number </th>
                  {/* <th className="table-th">S.O NUMBER/PO </th>
                  <th className="table-th">WBS/COST </th> */}

                  {/* <th className="table-th">po name </th>
                  <th className="table-th">po date </th> */}
                  {/* <th className="table-th">type of trip </th> */}
                  <th className="table-th">Ship To Name</th>
                  <th className="table-th">Ship To Address</th>
                  {/* <th className="table-th">city</th> */}
                  <th className="table-th">maiteral</th>
                  <th className="table-th">bill number </th>
                  <th className="table-th">bill Date </th>
                  <th className="table-th">bill submited or genr. </th>
                  <th className="table-th">GRN number </th>
                  <th className="table-th">GRN date </th>
                  <th className="table-th">total distance </th>
                  <th className="table-th">additional distance </th>
                  <th className="table-th">zone</th>
                  <th className="table-th">rate</th>
                  <th className="table-th">loading </th>
                  <th className="table-th">unloading</th>
                  <th className="table-th">halting charger </th>
                  <th className="table-th">two point loading /unloading </th>
                  <th className="table-th">Status </th>
                  <th className="table-th">additonal cost </th>
                  <th className="table-th">taxable value </th>
                  <th className="table-th">GST</th>
                  <th className="table-th">Grand total </th>
                  <th className="table-th">remarks</th>
                  <th className="table-th" style={{ lineHeight: "1rem" }}>
                    DOCUMENTS{" "}
                    <span style={{ display: "block" }}>
                      IN || DIS || EWAY || PAC.LIST
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {combo.map((res) => {
                  return (
                    <tr>
                      <td className="td-main">
                        {res.shipment.consignments[0].consignmentNo}
                      </td>

                      <td className="td-main">
                        {" "}
                        {res.shipment.consignments[0].consigner.name}
                      </td>
                      <td className="td-main">
                        {res.order.customFields
                          .filter((res) => res.fieldKey === "destination")
                          .map((res) => {
                            return <>{res.value}</>;
                          })}
                      </td>

                      <td className="td-main">
                        {res.order.customFields
                          .filter((res) => res.fieldKey === "Material")
                          .map((res) => {
                            return <>{res.value}</>;
                          })}
                      </td>
                      <td className="td-main">
                        {billnumber(res.shipment.consignments[0].customFields)
                          ? billnumber(
                              res.shipment.consignments[0].customFields
                            )
                          : "--"}
                      </td>
                      <td className="td-main">
                        {billdate(res.shipment.consignments[0].customFields)
                          ? billdate(res.shipment.consignments[0].customFields)
                          : "--"}
                      </td>
                      <td className="td-main">
                        {billsuborgenr(
                          res.shipment.consignments[0].customFields
                        )
                          ? billsuborgenr(
                              res.shipment.consignments[0].customFields
                            )
                          : "--"}
                      </td>
                      <td className="td-main">
                        {grmnumber(res.shipment.consignments[0].customFields)
                          ? grmnumber(res.shipment.consignments[0].customFields)
                          : "--"}
                      </td>
                      <td className="td-main">
                        {grndate(res.shipment.consignments[0].customFields)
                          ? grndate(res.shipment.consignments[0].customFields)
                          : "--"}
                      </td>
                      <td className="td-main">
                        {totaldistance(
                          res.shipment.consignments[0].customFields
                        )
                          ? totaldistance(
                              res.shipment.consignments[0].customFields
                            )
                          : "--"}
                      </td>
                      <td className="td-main">
                        {additionaldistance(
                          res.shipment.consignments[0].customFields
                        )
                          ? additionaldistance(
                              res.shipment.consignments[0].customFields
                            )
                          : "--"}
                      </td>
                      <td className="td-main">
                        {zone(res.shipment.consignments[0].customFields)
                          ? zone(res.shipment.consignments[0].customFields)
                          : "--"}
                      </td>
                      <td className="td-main">
                        {rate(res.shipment.consignments[0].customFields)
                          ? rate(res.shipment.consignments[0].customFields)
                          : "--"}
                      </td>
                      <td className="td-main">
                        {loading(res.shipment.consignments[0].customFields)
                          ? loading(res.shipment.consignments[0].customFields)
                          : "--"}
                      </td>
                      <td className="td-main">
                        {unloading(res.shipment.consignments[0].customFields)
                          ? unloading(res.shipment.consignments[0].customFields)
                          : "--"}
                      </td>
                      <td className="td-main">
                        {haltingcharger(
                          res.shipment.consignments[0].customFields
                        )
                          ? haltingcharger(
                              res.shipment.consignments[0].customFields
                            )
                          : "--"}
                      </td>
                      <td className="td-main">
                        {twopointlounlo(
                          res.shipment.consignments[0].customFields
                        )
                          ? twopointlounlo(
                              res.shipment.consignments[0].customFields
                            )
                          : "--"}
                      </td>
                      <td
                        className="td-main"
                        style={{
                          fontWeight: "bolder",
                          color:
                            status(
                              res.shipment.consignments[0].customFields
                            ) === "PENDING"
                              ? "red"
                              : status(
                                  res.shipment.consignments[0].customFields
                                ) === "APPROVED"
                              ? "#00ff00"
                              : "",
                        }}
                      >
                        {status(res.shipment.consignments[0].customFields)}
                      </td>
                      <td className="td-main">
                        {additionalcost(
                          res.shipment.consignments[0].customFields
                        )
                          ? additionalcost(
                              res.shipment.consignments[0].customFields
                            )
                          : "--"}
                      </td>
                      <td className="td-main">
                        {taxablevalue(res.shipment.consignments[0].customFields)
                          ? taxablevalue(
                              res.shipment.consignments[0].customFields
                            )
                          : "--"}
                      </td>
                      <td className="td-main">
                        {gst(res.shipment.consignments[0].customFields)
                          ? gst(res.shipment.consignments[0].customFields)
                          : "--"}
                      </td>
                      <td className="td-main">
                        {grandtotal(res.shipment.consignments[0].customFields)
                          ? grandtotal(
                              res.shipment.consignments[0].customFields
                            )
                          : "--"}
                      </td>
                      <td className="td-main">
                        {remark(res.shipment.consignments[0].customFields)
                          ? remark(res.shipment.consignments[0].customFields)
                          : "--"}
                      </td>
                      <td className="td-main">
                        <button
                          className="color-button"
                          style={{
                            backgroundColor: invoice(res.order.customFields)
                              ? "#00ff00"
                              : "red",
                          }}
                        ></button>

                        <button
                          className="color-button"
                          style={{
                            backgroundColor: dis(res.order.customFields)
                              ? "#00ff00"
                              : "red",
                          }}
                        ></button>

                        <button
                          className="color-button"
                          style={{
                            backgroundColor: eway(res.order.customFields)
                              ? "#00ff00"
                              : "red",
                          }}
                        ></button>

                        <button
                          className="color-button"
                          style={{
                            backgroundColor: packinglist(res.order.customFields)
                              ? "#00ff00"
                              : "red",
                          }}
                        ></button>
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
}

export default Billing;
