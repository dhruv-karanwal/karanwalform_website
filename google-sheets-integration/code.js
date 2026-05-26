/**
 * Google Apps Script Web App Backend
 * 
 * This script runs serverless inside Google Sheets and processes incoming form data,
 * saving entries in real-time in separate rows with structured time stamps.
 * 
 * To avoid CORS pre-flight (OPTIONS) browser rejections, the frontend transmits
 * data using "text/plain" content-type. This is parsed as JSON in doPost(e).
 */

function doPost(e) {
  try {
    // 1. Retrieve the text body and parse it as JSON
    var jsonString = e.postData.contents;
    var data = JSON.parse(jsonString);
    
    // 2. Validate essential fields to prevent empty database rows
    if (!data.fullName || !data.age || !data.fathersName || !data.contactNumber || !data.district || !data.address) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Required fields are missing / आवश्यक फ़ील्ड गायब हैं"
      }))
      .setMimeType(ContentService.MimeType.JSON);
    }
    
    // 3. Open the active spreadsheet and locate the active sheet tab
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 4. If the sheet is completely empty, write the column headers first
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp / समय",
        "Full Name / पूरा नाम",
        "Age (years) / आयु (वर्ष)",
        "Father's Name / पिता का नाम",
        "Contact Number / संपर्क संख्या",
        "District / जिला",
        "Residential Address / आवासीय पता"
      ]);
      // Make headers bold for a professional visual look in Google Sheets
      sheet.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#f1f5f9");
    }
    
    // 5. Generate timezone-aware Timestamp
    var timestamp = new Date();
    
    // 6. Format the contact number with a single quote prefix to prevent Google Sheets 
    // from stripping leading zeros or formatting it as a scientific number.
    var safeContactNumber = "'" + data.contactNumber.toString().trim();
    
    // 7. Append row to Google Sheets
    sheet.appendRow([
      timestamp,
      data.fullName.toString().trim(),
      parseInt(data.age, 10),
      data.fathersName.toString().trim(),
      safeContactNumber,
      data.district.toString().trim(),
      data.address.toString().trim()
    ]);
    
    // 8. Return success response
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Data saved successfully / डेटा सफलतापूर्वक सहेज लिया गया है"
    }))
    .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Catch-all server error handler
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Server Error: " + error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}
