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
    if (!data.fullName || !data.age || !data.gender || !data.fathersName || !data.contactNumber || !data.aadhaarNumber || !data.district || !data.address) {
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
        "Gender / लिंग",
        "Father's Name / पिता का नाम",
        "Contact Number / संपर्क संख्या",
        "Aadhaar Card Number / आधार कार्ड नंबर",
        "District / जिला",
        "Residential Address / आवासीय पता"
      ]);
      // Make headers bold for a professional visual look in Google Sheets
      sheet.getRange(1, 1, 1, 9).setFontWeight("bold").setBackground("#f1f5f9");
    } else {
      // Automatic migration: check and insert "Gender", "District" and "Aadhaar Card Number" columns if not present
      var lastCol = sheet.getLastColumn();
      if (lastCol > 0) {
        var headerValues = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
        var hasGender = false;
        var hasDistrict = false;
        var hasAadhaar = false;
        
        for (var i = 0; i < headerValues.length; i++) {
          if (headerValues[i]) {
            var headerStr = headerValues[i].toString();
            if (headerStr.indexOf("Gender") > -1) {
              hasGender = true;
            }
            if (headerStr.indexOf("District") > -1) {
              hasDistrict = true;
            }
            if (headerStr.indexOf("Aadhaar") > -1) {
              hasAadhaar = true;
            }
          }
        }
        
        // Migrate "Gender / लिंग" first if not present, placing it right after "Age"
        if (!hasGender) {
          var ageColIdx = 3; // Default fallback to column 3
          for (var i = 0; i < headerValues.length; i++) {
            if (headerValues[i] && headerValues[i].toString().indexOf("Age") > -1) {
              ageColIdx = i + 1;
              break;
            }
          }
          sheet.insertColumnAfter(ageColIdx);
          sheet.getRange(1, ageColIdx + 1).setValue("Gender / लिंग");
          sheet.getRange(1, ageColIdx + 1).setFontWeight("bold").setBackground("#f1f5f9");
          
          // Re-fetch header info because column count changed
          lastCol = sheet.getLastColumn();
          headerValues = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
        }
        
        // Migrate "District / जिला" if not present
        if (!hasDistrict) {
          var addressColIdx = 7;
          for (var i = 0; i < headerValues.length; i++) {
            if (headerValues[i] && headerValues[i].toString().indexOf("Address") > -1) {
              addressColIdx = i + 1;
              break;
            }
          }
          sheet.insertColumnBefore(addressColIdx);
          sheet.getRange(1, addressColIdx).setValue("District / जिला");
          sheet.getRange(1, addressColIdx).setFontWeight("bold").setBackground("#f1f5f9");
          
          // Re-fetch header info because column count changed
          lastCol = sheet.getLastColumn();
          headerValues = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
        }
        
        // Migrate "Aadhaar Card Number / आधार कार्ड नंबर" if not present
        if (!hasAadhaar) {
          var districtColIdx = 6;
          for (var i = 0; i < headerValues.length; i++) {
            if (headerValues[i] && headerValues[i].toString().indexOf("District") > -1) {
              districtColIdx = i + 1;
              break;
            }
          }
          sheet.insertColumnBefore(districtColIdx);
          sheet.getRange(1, districtColIdx).setValue("Aadhaar Card Number / आधार कार्ड नंबर");
          sheet.getRange(1, districtColIdx).setFontWeight("bold").setBackground("#f1f5f9");
        }
      }
    }
    
    // 5. Generate timezone-aware Timestamp
    var timestamp = new Date();
    
    // 6. Format numerical values with a single quote prefix to prevent Google Sheets 
    // from stripping leading zeros or formatting it as a scientific number.
    var safeContactNumber = "'" + data.contactNumber.toString().trim();
    var safeAadhaarNumber = "'" + data.aadhaarNumber.toString().trim();
    
    // 7. Append row to Google Sheets
    sheet.appendRow([
      timestamp,
      data.fullName.toString().trim(),
      parseInt(data.age, 10),
      data.gender.toString().trim(),
      data.fathersName.toString().trim(),
      safeContactNumber,
      safeAadhaarNumber,
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
