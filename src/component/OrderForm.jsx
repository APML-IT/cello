import React from "react";
import { useState, useEffect } from "react";
import { onOriginChange, submitForm } from "./OrderFormFunction";
import { FaWpforms } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function OrderForm() {
  const token = sessionStorage.getItem("token");
  const nagivate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [selectedOrigin, setSelectedOrigin] = useState("");
  const [selectedlocation, setSelectedlocation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [totalVeh, setTotalVeh] = useState(0);
  const [veh, setVeh] = useState([]);
  const [noCctt, setNoCctt] = useState("0");

  const [ccNumbers, setCcNumbers] = useState({
    cc1: null,
    cc2: null,
    cc3: null,
    cc4: null,
    cc5: null,
    cc6: null,
    cc7: null,
    cc8: null,
  });

  const handleChanges = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
    console.log(inputs,"inputs   inpu")
  };

  const handleSubmit = (e) => {
    const temp = [];
    e.preventDefault();
    temp.push(selectedlocation, noCctt, ccNumbers, veh);
    submitForm(inputs, temp);
    setSubmitted(true);
  };

  const handleCcNumberChange = (e) => {
    setCcNumbers({
      ...ccNumbers,
      [e.target.name]: e.target.value,
    });
    console.log(ccNumbers,"ccnumber")
  };

  const onMaterialChange = (e) => {
    const material = e.target.value;

    // switch case to check the material and set the nth vehicle
  };

  useEffect(() => {
    axios
      .get("https://fire-hot-hardhat.glitch.me/auth", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.message === "Authorized") {
          console.log("Authorized");
        }
      })
      .catch((err) => {
        nagivate("/");
      });
  }, []);

  return (
    <>
      <main
        style={{
          backgroundColor: "gray",
          margin: "0",
          padding: "0",
          overflow: "unset",
        }}
      >
        <div className="form-main">
          <div class="form">
            <div class="form_contain">
              <FaWpforms
                style={{ fill: "white", height: "2rem", width: "2rem" }}
              />
              <h1>ORDER FORM </h1>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <div
                  style={{
                    flexDirection: "column",
                    margin: "1rem",
                  }}
                >
                  <div>
                    <label>Origin:</label>
                    <select
                      name="Origin"
                      onChange={(e) => {
                        const data = onOriginChange(e.target.value);
                        setSelectedlocation(data[1]);
                        setSelectedOrigin(e.target.value);
                        handleChanges(e);
                      }}
                    > 
                      <option value="">Select an option</option>
                      <option value="BHARAT FRITZ WERNER LIMITED- Hosur">
                      BHARAT FRITZ WERNER LIMITED- Hosur
                      </option>

                      <option value="BHARAT FRITZ WERNER LIMITED-Bangalore">
                      BHARAT FRITZ WERNER LIMITED-Bangalore
                      </option>
                      {/* <option value="Others">
                        Others
                      </option> */}
                    </select>
                  </div>
                  {selectedOrigin === "Others" && (
                    <div>
                      <label>other location</label>
                      <input
                        type="text"
                        name="Location"
                        onChange={handleChanges}
                        required
                      />
                    </div>
                  )}
                  {selectedOrigin === "Others" && (
                    <div>
                      <label>other location 2</label>
                      <select
                        type="text"
                        name="Location"
                        onChange={handleChanges}
                        required
                      >
                        <option>--Select--</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select>
                    </div>
                  )}
                  <div>
                    <label>Location :</label>
                    <input
                      type="text"
                      name="Location"
                      onChange={(e) => {
                        handleChanges(e);
                      }}
                      value={selectedlocation}
                      required
                      disabled
                    />
                  </div>

                  <div>
                    <label>Total Vehicles:</label>
                    <select
                      name="totalVeh"
                      value={totalVeh}
                      onChange={(e) => {
                        setTotalVeh(e.target.value);
                      }}
                      required
                    >
                      <option>1</option>
                      <option value="1">1</option>
                      {/* <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option> */}
                    </select>
                  </div>

                  {true >= 1 && (
                    <div>
                      <label>Vehicle Type:</label>
                      <select
                        name="v1"
                        value={veh[0]}
                        onChange={(e) => setVeh([...veh, e.target.value])}
                        required
                      >
                        <option>Please select </option>
                        <option value="10Ft SXL (C)">10Ft SXL (C)</option>
                        <option value="12 FT/CONTAINER REGULAR/SA">
                          12 FT/CONTAINER REGULAR/SA
                        </option>
                        <option value="12 FT/CONTAINER REGULAR/SA/TATA 407">
                          12 FT/CONTAINER REGULAR/SA/TATA 407
                        </option>
                        <option value="12 FT/PLATFORM REGULAR/SA/10.59">
                          12 FT/PLATFORM REGULAR/SA/10.59
                        </option>
                        <option value="14 FT/CONTAINER REGULAR/SA">
                          14 FT/CONTAINER REGULAR/SA
                        </option>
                        <option value="14 FT/OPEN BODY/SA">
                          14 FT/OPEN BODY/SA
                        </option>
                        <option value="14 FT/PLATFORM REGULAR/SA">
                          14 FT/PLATFORM REGULAR/SA
                        </option>
                        <option value="14FT/CLOSED/SA/7.49T/CNG/Eicher Pro 2059XP CNG F CBC">
                          14FT/CLOSED/SA/7.49T/CNG/Eicher Pro 2059XP CNG F CBC
                        </option>
                        <option value="16 FT/CONTAINER REGULAR/SA">
                          16 FT/CONTAINER REGULAR/SA
                        </option>
                        <option value="16 FT/OPEN BODY/SA">
                          16 FT/OPEN BODY/SA
                        </option>
                        <option value="16 FT/PLATFORM REGULAR/SA">
                          16 FT/PLATFORM REGULAR/SA
                        </option>
                        <option value="17 FT/CONTAINER REGULAR/SA/10.95">
                          17 FT/CONTAINER REGULAR/SA/10.95
                        </option>
                        <option value="17 FT/OPEN BODY/SA/10.95">
                          17 FT/OPEN BODY/SA/10.95
                        </option>
                        <option value="17 FT/PLATFORM REGULAR/SA/10.95">
                          17 FT/PLATFORM REGULAR/SA/10.95
                        </option>
                        <option value="18 FT/CONTAINER REGULAR/SA/LPT 1613">
                          18 FT/CONTAINER REGULAR/SA/LPT 1613
                        </option>
                        <option value="19 FT/CONTAINER REGULAR/SA">
                          19 FT/CONTAINER REGULAR/SA
                        </option>
                        <option value="19 FT/OPEN BODY/SA">
                          19 FT/OPEN BODY/SA
                        </option>
                        <option value="20 FT/CAR CARRIER /SA">
                          20 FT/CAR CARRIER /SA
                        </option>
                        <option value="20 FT/CONTAINER REGULAR/SA">
                          20 FT/CONTAINER REGULAR/SA
                        </option>
                        <option value="20 FT/PLATFORM REGULAR/SA">
                          20 FT/PLATFORM REGULAR/SA
                        </option>
                        <option value="22 FT/OPEN TAURAS/DA">
                          22 FT/OPEN TAURAS/DA
                        </option>
                        <option value="24 FT/CAR CARRIER /SA">
                          24 FT/CAR CARRIER /SA
                        </option>
                        <option value="24 FT/CONTAINER REGULAR/DA">
                          24 FT/CONTAINER REGULAR/DA
                        </option>
                        <option value="24 FT/CONTAINER REGULAR/SA">
                          24 FT/CONTAINER REGULAR/SA
                        </option>
                        <option value="24 FT/OPEN BODY/DA">
                          24 FT/OPEN BODY/DA
                        </option>
                        <option value="24 FT/OPEN TAURAS/DA">
                          24 FT/OPEN TAURAS/DA
                        </option>
                        <option value="24 FT/PLATFORM REGULAR/SA">
                          24 FT/PLATFORM REGULAR/SA
                        </option>
                        <option value="24Ft SXL (P) Air Suspension">
                          24Ft SXL (P) Air Suspension
                        </option>
                        <option value="28 FT/PLATFORM REGULAR/DA">
                          28 FT/PLATFORM REGULAR/DA
                        </option>
                        <option value="28 FT/PLATFORM REGULAR/SA">
                          28 FT/PLATFORM REGULAR/SA
                        </option>
                        <option value="32 FT/ PLATFORM / SA">
                          32 FT/ PLATFORM / SA
                        </option>
                        <option value="32 FT/CAR CARRIER TK-5/SA">
                          32 FT/CAR CARRIER TK-5/SA
                        </option>
                        <option value="32 FT/CONTAINER REGULAR/DA">
                          32 FT/CONTAINER REGULAR/DA
                        </option>
                        <option value="32 FT/CONTAINER REGULAR/SA">
                          32 FT/CONTAINER REGULAR/SA
                        </option>
                        <option value="32 FT/PLATFORM REGULAR/DA">
                          32 FT/PLATFORM REGULAR/DA
                        </option>
                        <option value="32 FT/PLATFORM REGULAR/DA/FOUZI SCHEME">
                          32 FT/PLATFORM REGULAR/DA/FOUZI SCHEME
                        </option>
                        <option value="40 FT/TRAILER FLAT BED/DA">
                          40 FT/TRAILER FLAT BED/DA
                        </option>
                        <option value="40 FT/TRAILER FLAT BED/TA">
                          40 FT/TRAILER FLAT BED/TA
                        </option>
                        <option value="40 FT/TRAILER SEMI BED">
                          40 FT/TRAILER SEMI BED
                        </option>
                        <option value="40FT HB">40FT HB</option>
                        <option value="40FT SB">40FT SB</option>
                        <option value="40FT SXL (C)">40FT SXL (C)</option>
                        <option value="48FT HB">48FT HB</option>
                      </select>
                    </div>
                  )}
                  {/* {totalVeh >= 2 && (
                    <div>
                      <label>Vehicle Type:</label>
                      <select
                        name="v2"
                        value={veh[1]}
                        onChange={(e) => setVeh([...veh, e.target.value])}
                        required
                      >
                        <option value="">--Select--</option>
                        <option value="SHPL - 20 FT ODC">20 FT ODC</option>
                        <option value="SHPL - 20FT AIR SUSPENSION">
                          20FT AIR SUSPENSION
                        </option>
                        <option value="SHPL - 17ft VEHICLE">
                          17ft VEHICLE
                        </option>
                        <option value="SHPL - PICK UP">PICK UP</option>
                        <option value="SHPL - 24 FT PLATFORM">
                          24 FT PLATFORM
                        </option>
                        <option value="SHPL - 32 FT PLATFORM">
                          32 FT PLATFORM
                        </option>
                        <option value="SHPL - 40 FT TRAILER">
                          40 FT TRAILER
                        </option>
                        <option value="SHPL - 20 FT TRAILER">
                          20 FT TRAILER
                        </option>
                        <option value="SHPL - 40 FT AIR SUSPENSION">
                          40 FT AIR SUSPENSION
                        </option>
                      </select>
                    </div>
                  )}
                  {totalVeh >= 3 && (
                    <div>
                      <label>Vehicle Type:</label>
                      <select
                        name="v3"
                        value={veh[2]}
                        onChange={(e) => setVeh([...veh, e.target.value])}
                        required
                      >
                        <option value="">--Select--</option>
                        <option value="SHPL - 20 FT ODC">20 FT ODC</option>
                        <option value="SHPL - 20FT AIR SUSPENSION">
                          20FT AIR SUSPENSION
                        </option>
                        <option value="SHPL - 17ft VEHICLE">
                          17ft VEHICLE
                        </option>
                        <option value="SHPL - PICK UP">PICK UP</option>
                        <option value="SHPL - 24 FT PLATFORM">
                          24 FT PLATFORM
                        </option>
                        <option value="SHPL - 32 FT PLATFORM">
                          32 FT PLATFORM
                        </option>
                        <option value="SHPL - 40 FT TRAILER">
                          40 FT TRAILER
                        </option>
                        <option value="SHPL - 20 FT TRAILER">
                          20 FT TRAILER
                        </option>
                        <option value="SHPL - 40 FT AIR SUSPENSION">
                          40 FT AIR SUSPENSION
                        </option>
                      </select>
                    </div>
                  )}
                  {totalVeh >= 4 && (
                    <div>
                      <label>Vehicle Type:</label>
                      <select
                        name="v4"
                        value={veh[3]}
                        onChange={(e) => setVeh([...veh, e.target.value])}
                        required
                      >
                        <option value="">--Select--</option>
                        <option value="SHPL - 20 FT ODC">20 FT ODC</option>
                        <option value="SHPL - 20FT AIR SUSPENSION">
                          20FT AIR SUSPENSION
                        </option>
                        <option value="SHPL - 17ft VEHICLE">
                          17ft VEHICLE
                        </option>
                        <option value="SHPL - PICK UP">PICK UP</option>
                        <option value="SHPL - 24 FT PLATFORM">
                          24 FT PLATFORM
                        </option>
                        <option value="SHPL - 32 FT PLATFORM">
                          32 FT PLATFORM
                        </option>
                        <option value="SHPL - 40 FT TRAILER">
                          40 FT TRAILER
                        </option>
                        <option value="SHPL - 20 FT TRAILER">
                          20 FT TRAILER
                        </option>
                        <option value="SHPL - 40 FT AIR SUSPENSION">
                          40 FT AIR SUSPENSION
                        </option>
                      </select>
                    </div>
                  )} */}
                </div>

                <div style={{ flexDirection: "column", margin: "1rem" }}>
                  <div>
                    <label>Transportation Service:</label>
                    <select
                      name="TransportationService"
                      onChange={handleChanges}
                      required
                    >
                      <option value="">--Select--</option>
                      <option value="FTL">FTL</option>
                      <option value="PTL">PTL</option>
                      <option value="Express">Express</option>
                    </select>
                  </div>
                  {/* <div>
                    <label>Order By</label>
                    <select name="OrderBy" onChange={handleChanges} required>
                      <option value="">--Select--</option>
                      <option value="Adinath Tajne">Adinath Tajne</option>
                      <option value="Aditya Kandharkar">
                        Aditya Kandharkar
                      </option>
                      <option value="Chintamani Mayeka">
                        Chintamani Mayeka
                      </option>
                      <option value="Jayesh Uniyal">Jayesh Uniyal</option>
                      <option value="Sujoy Dey">Sujoy Dey</option>
                      <option value="Pravin Katkar">Pravin Katkar</option>
                      <option value="Mrirani Das">Mrirani Das</option>
                      <option value="Vijay Mahtre">Vijay Mahtre</option>
                      <option value="Sagar kadam">Sagar kadam</option>
                    </select>
                  </div> */}

                  <div>
                    <label>Pickup Date:</label>
                    <input
                      style={{
                        display: "flex",
                        flexDirection: "row-reverse",
                        alignItems: "center",
                      }}
                      type="datetime-local"
                      name="Pickup_Date"
                      onChange={handleChanges}
                      required
                      className="dark-theme"
                    />
                  </div>

                  {/* <div>
                    <label>Order By</label>
                    <input
                      type="text"
                      name="ConsigneeName"
                      onChange={handleChanges}
                      value="Sandeep Jadhav"
                      disabled
                      required
                    />
                  </div> */}
                  {/* <div>
                    <label>job no.</label>
                    <input
                      type="text"
                      name="ConsigneeAddress"
                      onChange={handleChanges}
                      
                      required
                    />
                  </div> */}
                  {/* <div>
                    <label>City</label>
                    <input
                      type="text"
                      name="ConsigneePincode"
                      onChange={handleChanges}
                      required
                    />
                  </div> */}

                  {/* <div>
                    <label>S.O Number/PO:</label>
                    <input
                      type="type"
                      name="SOnumber"
                      onChange={handleChanges}
                      required
                    />
                  </div>
                  <div>
                    <label>WBS/COST:</label>
                    <input
                      type="type"
                      name="WBS"
                      onChange={handleChanges}
                      required
                    />
                  </div> */}
                  <div>
                    <label>Special Instructions</label>
                    <input
                      type="text"
                      name="SHPL_instructions"
                      onChange={handleChanges}
                    />
                  </div>

                  <div
                  style={{marginTop:"2rem"}}
                  >
                    <div
                      className="submit_button"
                    >
                      <button
                        type="submit"
                        onChange={setSubmitted}
                        style={{ width: "200px" }}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ flexDirection: "row", margin: "1rem" }}>
                  <div>
                    <label>Material</label>
                    <select
                      name="Material"
                      onChange={(e) => {
                        handleChanges(e);
                        onMaterialChange(e);
                      }}
                      required
                    >
                      <option value="">--Select--</option>
                      <option value="CNS verticle machine">CNS verticle machine</option>
                    </select>
                  </div>

                  <div>
                    <label>Expected Delivery Date:</label>
                    <input
                      style={{
                        display: "flex",
                        flexDirection: "row-reverse",
                        alignItems: "center",
                      }}
                      type="datetime-local"
                      name="expected_Date"
                      onChange={handleChanges}
                      required
                      className="dark-theme"
                    />
                  </div>

                  {/* <div>
                    <label>Quantity</label>
                    <input
                      type="text"
                      name="PMName"
                      onChange={handleChanges}
                      required
                    />
                  </div> */}
                  <div>
                    <label>Destination</label>
                    <input
                      type="text"
                      name="PMNumber"
                      onChange={handleChanges}
                      required
                    />
                  </div>

                  {/* <div>
                    <label htmlFor="noCctt">
                      Number of Delivery Locations:
                    </label>
                    <select
                      name="noCctt"
                      id="noCctt"
                      onChange={(e) => setNoCctt(e.target.value)}
                      required
                    >
                      <option>-- Select --</option>
                      <option value="1">1</option>
                      <option value="1">2</option>
                      <option value="1">3</option>
                    </select>
                  </div>
                  {noCctt >= 1 && (
                    <div>
                      <label htmlFor="cc1">Location no.1</label>
                      <input
                        type="text"
                        name="cc1"
                        id="cc1"
                        onChange={handleCcNumberChange}
                        required
                      />
                    </div>
                  )}
                   {noCctt >= 2 && (
                    <div>
                      <label htmlFor="cc2">Location no.2</label>
                      <input
                        type="text"
                        name="cc2"
                        id="cc2"
                        onChange={handleCcNumberChange}
                        required
                      />
                    </div>
                  )} */}
                 
                </div>
                <div className="submit-class">
                 
                  {submitted && (
                    <div style={{ minWidth: "100%", maxWidth: "100%" }}>
                      <div className="Tq_msg" style={{ position: "relative" }}>
                        <h1>THANK YOU</h1>
                      </div>
                      <div className="celebration" style={{ position: "" }}>
                        <svg
                          width="100%"
                          height="90"
                          viewBox="0 0 600 90"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect x="42" y="0" width="10" height="20" />
                          <rect x="84" y="0" width="10" height="20" />
                          <rect x="126" y="0" width="10" height="23" />
                          <rect x="168" y="0" width="10" height="23" />
                          <rect x="210" y="0" width="10" height="20" />
                          <rect x="252" y="0" width="10" height="23" />
                          <rect x="294" y="0" width="10" height="20" />
                          <rect x="336" y="0" width="10" height="23" />
                          <rect x="378" y="0" width="10" height="23" />
                          <rect x="420" y="0" width="10" height="20" />
                          <rect x="462" y="0" width="10" height="20" />
                          <rect x="504" y="0" width="10" height="23" />
                          <rect x="546" y="0" width="10" height="20" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
