// const promiseOne = new Promise(function (resolve,reject){
//     setTimeout(function(){
//         console.log("This is my function");
//         resolve();
//     },5000)
// });

// promiseOne.then(()=> console.log("Hi")).catch(function(error){
//     console.log(error);
// })

//https://dummy.restapiexample.com/api/v1/employee/1 -> Need to do fetch call

const data = fetch(`https://dummyjson.com/user/1`);
console.log(data);
data
  .then((res, rej) => {
    if (res.status == 200) return res.json();
    else console.log(res.json);
  })
  .then((res) => {
    console.log(res);
    tagP.textContent =
      "id : " +
      res.id +
      ", First-Name : " +
      res.firstName +
      ", Last-Name " +
      res.lastName +
      ", age : " +
      res.age +
      ", bloodGroup : " +
      res.bloodGroup;
  })
  .catch((rej) => console.log(rej));

let c = false;
function dev(h, image) {
  const getAllUlElements = document
    .getElementsByTagName("a")
    .item(h).parentElement;
  getAllUlElements.style.backgroundColor = "green";
  let result;
  let img;
  if (c == false) {
    img = document.createElement("img");
    img.src = image;
    img.style.width = "600px";
    img.style.height = "140px";
    img.style.marginLeft = "250px";
    result = document.getElementById("clicked");
    result.appendChild(img);
    tagP.textContent = "";
    c = true;
  }
  const rmUnderline = document.getElementsByTagName("a").item(h);
  console.log(rmUnderline);
  rmUnderline.style.textDecoration = "none";

  rmUnderline.addEventListener("mouseleave", function () {
    rmUnderline.style.textDecoration = "underline";
    getAllUlElements.style.backgroundColor = "blueviolet";
    if (c == true) {
      result.removeChild(img);
      c = false;
    }
  });
}

const tagP = document.getElementById("display");
let area = document.getElementById("draw");
function getMousePoints() {
  area.addEventListener("mousemove", function (event) {
    area.style.backgroundColor = "yellow";
    tagP.textContent = event.clientX + " :: " + event.clientY;
  });
  area.addEventListener("mouseleave", function () {
    area.style.backgroundColor = "white";
    tagP.textContent = "Hi";
    tagP.addEventListener("click", () => {
      tagP.textContent = "";
    });
  });
}

function fetchTicketsFromDate() {
  var freshdeskDomain = "https://xtracapindia.freshdesk.com/api/v2/tickets";
  var apiKey = "pEqH19cDYv3nNogRfqiV";
  var authHeaders = {
    Authorization: "Basic " + Utilities.base64Encode(apiKey + ":X"),
  };
  var page = 1; // Start from page 1
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  // Clear previous data in the sheet
  sheet.clearContents();
  // // Set the headers for the sheet with all fields you want
  var sheetHeaders = [
    "Ticket ID",
    "Subject",
    "Status",
    "Source",
    "Type",
    "Agent",
    "Created time",
    "Resolved time",
    "Closed time",
    "Time tracked",
    "Tags",
    "Sub-type",
    "Assigned to",
    "Overall Handling Time",
    "Assignee Handling Time",
    "Full name",
    "Contact ID",
  ];
  sheet.appendRow(sheetHeaders);
  var startDate = "2025-01-01";
  // Change this to your desired start date
  // Loop to fetch all pages of tickets from a specific date
  while (true) {
    var url = freshdeskDomain + "?page=" + page + "&updated_since=" + startDate;
    try {
      var response = UrlFetchApp.fetch(url, {
        method: "get",
        headers: authHeaders,
      });
      var data = JSON.parse(response.getContentText());
      if (data.length === 0) {
        break;
      }
      for (var i = 0; i < data.length; i++) {
        var ticket = data[i];
        var contact = ticket.requester;
        // Map numeric status to human-readable status
        var status = mapTicketStatus(ticket.status);
        var source = mapTicketSource(ticket.source);
        // Map source code to human-readable source
        // Format the 'closed_at' field to a readable date format
        var closedTime = formatDate(ticket.closed_at);
        var resolvedTime = formatDate(ticket.resolved_at);
        var createdTime = formatDate(ticket.created_at);
        var row = [
          ticket.id,
          // Ticket ID
          ticket.subject,
          // Subject
          status,
          // // Status (mapped to human-readable status)
          source,
          //  // Source (mapped to human-readable source)
          ticket.type,
          // // Ticket type
          ticket.agent ? ticket.agent.name : "N/A",
          // Agent (if available, otherwise "N/A")
          createdTime,
          // Created time (formatted date)
          resolvedTime,
          // Resolved time (formatted date)
          closedTime,
          // Closed time (formatted date)
          ticket.time_tracked || "N/A",
          // Time tracked (if missing, default to "N/A")
          ticket.tags && ticket.tags.length > 0
            ? ticket.tags.join(", ")
            : "N/A",
          // Tags
          ticket.sub_type || "N/A",
          // Sub-type (if missing, default to "N/A")
          ticket.assigned_to ? ticket.assigned_to.name : "N/A",
          // Assigned to (if missing, default to "N/A")
          ticket.overall_handling_time || "N/A",
          // Overall handling time (if missing, default to "N/A")
          ticket.assignee_handling_time || "N/A",
          // Assignee handling time (if missing, default to "N/A")
          contact ? contact.name : "N/A",
          // Full name of requester (if missing, default to "N/A")
          contact ? contact.id : "N/A",
          // Contact ID of requester (if missing, default to "N/A")
        ];
        sheet.appendRow(row);
        // Add the ticket data to the sheet
      }
      page++;
    } catch (e) {
      Logger.log("Error on page " + page + ": " + e.message);
      break;
      // Stop the loop if there is an error fetching data
    }
  }
}
// Function to format date from API response to a readable date
function formatDate(dateString) {
  if (!dateString) {
    return "N/A";
    // Return "N/A"
    // if the date is missing
  }
  var date = new Date(dateString);
  if (isNaN(date)) {
    return "N/A"; // If invalid date, return "N/A"
  }
  return Utilities.formatDate(
    date,
    Session.getScriptTimeZone(),
    "yyyy-MM-dd HH:mm:ss"
  );
  // Format date to a readable format
}

// Function to map numeric status to human-readable status
function mapTicketStatus(statusCode) {
  switch (statusCode) {
    case 2:
      return "Open";
    case 3:
      return "Pending";
    case 4:
      return "Resolved";
    case 5:
      return "Closed";
    default:
      return "Unknown";
    // Default for unrecognized status codes
  }
}

// Function to map numeric source code to human-readable source
function mapTicketSource(sourceCode) {
  switch (sourceCode) {
    case 1:
      return "Email";
    case 2:
      return "Portal";
    case 3:
      return "Phone";
    case 4:
      return "Chat";
    case 5:
      return "Twitter";
    case 6:
      return "Facebook";
    case 7:
      return "Form";
    case 8:
      return "API";
    default:
      return "Unknown";
  }
}
