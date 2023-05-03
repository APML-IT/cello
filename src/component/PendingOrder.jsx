import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import { FaList } from "react-icons/fa";
import { WorkBook, WorkSheet, utils, writeFile } from "xlsx";
import { useNavigate } from "react-router-dom";

const PendingOrder = () => {
  const token = sessionStorage.getItem("token");
  const nagivate = useNavigate();
  const [pendingStatus, setPendingStatus] = useState([]);
  const defaultRemainingTime = {
    S: "00",
    M: "00",
    H: "00",
    D: "00",
  };
  const [loader, setLoader] = useState(true);
  const [remainingTime, setRemainingTime] = useState(defaultRemainingTime);
  const [count, setCount] = useState([]);
  let fileName = "Completed.csv";

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
      customer: ["EPIROC"],
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
        if (message[0].data.data[i].secondaryStatus === "CREATED") {
          pendingResponse.push(message[0].data.data[i]);
        }
      }
      setPendingStatus(pendingResponse);
      setLoader(false);
    });
  }

  console.log(pendingStatus)


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

  const exportExcelFile = () => {
    const element = document.getElementById("excel_table");
    let ws = utils.table_to_sheet(element);
    /* generate workbook and add the worksheet */
    let wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Sheet1");
    /* save to file */
    writeFile(wb, "sample.xlsx");
  };

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
            <FaList className="heading-icon" style={{ color: "orange" }} />
            <h1>
              PENDING ORDERS <span>{pendingStatus.length}</span>
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
                  <th className="table-th">Job Number </th>
                  <th className="table-th">Consignor</th>
                  <th className="table-th">Consignee</th>
                  <th className="table-th">material</th>
                  <th className="table-th">Vehicle Type </th>
                  <th className="table-th">expected Pickup Date </th>
                  <th className="table-th">Order By </th>
                  <th className="table-th">Order Days </th>
                  {/* <th className="table-th">SHPL instructions </th> */}
                  <th className="table-th">Special Instruction </th>
                  <th className="table-th">expected DELIVERY Date </th>
                </tr>
              </thead>

              <tbody>
                {pendingStatus.map((res) => {
                  return (
                    <tr className="tr">
                    <td className="td-main">{res.orderNumber}</td>
                    <td className="td-main">
                          {res.customFields
                            .filter((res) => res.fieldKey === "job no")
                            .map((res) => {
                              return <td className="td-main">{res.value}</td>;
                            })}
                        </td>
                    <td className="td-main">
                      {res?.lineItems[0].consigner?.name}
                              {/* dfd */}
                    </td>
                    <td
                      className="td-main"
                      style={{ color: "rgb(16, 177, 231)" }}
                    >
                       {res.customFields
                        .filter((res) => res.fieldKey === "destination")
                        .map((res) => {
                          return <>{res.value}</>;
                        })}
                    </td>
                    <td className="td-main">
                      {res.customFields
                        .filter((res) => res.fieldKey === "Material")
                        .map((res) => {
                          return <>{res.value}</>;
                        })}
                    </td>
                    <td className="td-main">
                      {" "}
                      {res.lineItems[0].allowedLoadTypes[0]?.name ? res.lineItems[0].allowedLoadTypes[0]?.name:"--"}
                      
                    </td>
                    <td
                      className="td-main"
                      style={{
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
                      }}
                    >
                      {res.customFields
                        .filter(
                          (res) =>
                            res.fieldKey === "expected pickup date"
                        )
                        .map((res) => {
                          return <>{differentdate(res.value)}</>;
                        })}
                    </td>
                    <td className="td-main">
                      {" "}
                      {res.customFields
                        .filter((res) => res.fieldKey === "orderby")
                        .map((res) => {
                          return <>{res.value}</>;
                        })}
                    </td>
                    <td
                      className="td-main"
                      style={{ color: "lightcoral", fontWeight: "bold" }}
                    >
--
                    </td>
                    {/* <td className="td-main" style={{ color: "red" }}>
                      {" "}
                      {res.customFields
                        .filter((res) => res.fieldKey === "SHPL instructions")
                        .map((res) => {
                          return <>{res.value}</>;
                        })}
                    </td> */}
                    <td className="td-main">
                      {" "}
                      {res.customFields
                        .filter((res) => res.fieldKey === "SpecialInstruction")
                        .map((res) => {
                          return <>{res.value ? res.value : "no remark"}</>;
                        })}
                    </td>
                    <td className="td-main" style={{color:"#00ff00", fontWeight:"bold"}}>
                      {" "}
                      {res.customFields
                        .filter(
                          (res) => res.fieldKey === "expected delivery date"
                        )
                        .map((res) => {
                          return <>{differentdate( res.value) }</>;
                        })}
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

export default PendingOrder;
