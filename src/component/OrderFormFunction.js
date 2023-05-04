import axios from "axios";

export async function submitForm(inputs, ...temp) {
  console.log(inputs,"inputs ssss" )
  console.log(temp,"temp")
  let dateTime = inputs.Pickup_Date;
  let date = new Date(dateTime).toString();
  let formattedDate = date.toLocaleString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  let dateTime1 = inputs.expected_Date;
  let date1 = new Date(dateTime1);
  let formattedDate1 = date1.toLocaleString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  var orders = [];

  var order = {
    Destination: null,
    "Vehicle Type": temp[0][3][0],
    "Transportation Service": "FTL",
    "Customer(*)": "BHARAT FRITZ WERNER LIMITED",
    "Consignor(*)": inputs.Origin,
    "Consignee(*)": "Unknown",
    "Pickup Date(DD-MM-YYYY)": "16-02-2023",
    "Booking Branch": "Mumbai",
    "Contract Number": null,
    Freight: "100",
    "Measurement Type(*)": "weight",
    "Quantity(*)": "1",
    "Quantity UOM(*)": "Units",
    "cf_Material" : inputs.Material,
    "cf_SpecialInstruction" : inputs.SHPL_instructions,
    "cf_expected pickup date" : formattedDate,
    "cf_expected delivery date" : formattedDate1,
    // "cf_Consignee 1": temp[0][2].cc1,
    // "cf_Consignee 2": temp[0][2].cc2,
    // "cf_Consignee 3": temp[0][2].cc3,
    // "cf_Consignee 4": temp[0][2].cc4,
    "cf_destination": inputs.destination,
    
  };
  orders.push(order);


  var config = {
    method: "post",
    url: "https://apis.fretron.com/automate/autoapi/run/80f5e63d-19e5-4160-817f-ba260f7fe3a4",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NzI0MjAxNTcsInVzZXJJZCI6Ijc3N2Q5YzIwLTEyNWYtNDhhZS04MWZjLTUzZWI2ZWM3MjZmZSIsImVtYWlsIjoiZGF0YS5zY2llbmNlQGFnYXJ3YWxwYWNrZXJzLmNvbSIsIm1vYmlsZU51bWJlciI6IjgyOTE4NDk1NjUiLCJvcmdJZCI6IjQwNTJhYjI0LTA1NDMtNGNkNC1iNTE3LTllNzhlZmVlNGZlZCIsIm5hbWUiOiJQcml5YWVzaCBQYXRlbCIsIm9yZ1R5cGUiOiJGTEVFVF9PV05FUiIsImlzR29kIjpmYWxzZSwicG9ydGFsVHlwZSI6ImJhc2ljIn0.QkU9OIMz0yf76zUJOtp7kVS3yAPZmJS1BMIiM4kxuzk",
      "Content-Type": "application/json",
    },
    data: orders,
  };

  axios(config)
    .then(async (response) => {
      console.log(orders);
      if (
        response.data.data.successCount === 1 &&
        response.data.data.successCount === 1
      ) {
        alert("Order  has been Placed");
        console.log("Order has been placed");
      }
    })
    .catch(function (error) {
      alert("Order has been not been Placed");
      console.log("Order has been not been Placed");
    });
}

export function onOriginChange(sO) {
  let data = [];
  let selectedLocation = "";

  switch (sO) {
    case "BHARAT FRITZ WERNER LIMITED- Hosur":
      selectedLocation = "Hosur";
      break;

      case "BHARAT FRITZ WERNER LIMITED-Bangalore":
        selectedLocation = "Bangalore";
        break;

    default:
      break;
  }

  data[0] = "BHARAT FRITZ WERNER LIMITED";
  data[1] = selectedLocation;
  data[2] = sO;
  data[3] = "Mumbai";
  return data;
}
