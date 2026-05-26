# Google Sheets Backend Integration Guide

Follow these step-by-step instructions to link your bilingual form frontend directly to a real-time Google Sheets database using Google Apps Script.

---

## Step 1: Set Up Your Google Sheet
1. Open [Google Sheets](https://sheets.google.com) and create a **Blank Spreadsheet**.
2. Give your spreadsheet a name (e.g., `Bilingual Registrations Portal`).
3. *(Optional)* You do not need to create column headers manually. The script will automatically detect an empty sheet on its first run, write professional bold column headers, and style them.

---

## Step 2: Open Google Apps Script Editor
1. In your Google Sheet, click **Extensions** in the top menu bar.
2. Select **Apps Script**.
3. This opens a new browser window/tab containing the Google Apps Script project editor.

---

## Step 3: Paste the Backend Script
1. Delete any boilerplate code inside the default `Code.gs` tab.
2. Copy the entire contents of the **[code.js](file:///c:/Users/HP/Desktop/karanwal%20form/google-sheets-integration/code.js)** file.
3. Paste the copied code into the editor.
4. Click the **Save Project** icon (floppy disk) at the top of the Apps Script interface.

---

## Step 4: Deploy as a Web App
1. Click the blue **Deploy** button in the top right corner.
2. Choose **New deployment**.
3. Click the gear icon next to **Select type** and choose **Web app**.
4. Configure the fields exactly as follows:
   - **Description**: `Bilingual Registration Form Backend API`
   - **Execute as**: `Me (your-email@gmail.com)`
   - **Who has access**: `Anyone` *(IMPORTANT: Must be "Anyone" so the website can communicate with it without needing Google logins)*
5. Click the **Deploy** button.
6. If prompted, click **Authorize Access** and select your Google account to grant permission. Click **Advanced** and then click **Go to Untitled project (unsafe)** to complete authorization.

---

## Step 5: Retrieve Your Web App URL
1. Once deployed, a dialog box will appear.
2. Under the **Web app** heading, copy the URL provided (starts with `https://script.google.com/macros/s/...`).
3. Save this URL somewhere safe.

---

## Step 6: Connect Backend to Frontend
You can link this URL in one of two ways:

### Option A: Using Environment Variables (Recommended for Production)
1. In the project root directory, create a file named `.env.local`.
2. Add your Web App URL to it:
   ```env
   NEXT_PUBLIC_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/AKfycbxgrTJHnKjWzHYoyNwI3GdxlgOkn5ZTJR3Q-A7x9CHWlhLOS4LtjhEI0LFVm6oaPDleeQ/exec
   ```

### Option B: Paste Directly in Code (Quick Setup)
1. Open the file **[page.tsx](file:///c:/Users/HP/Desktop/karanwal%20form/src/app/page.tsx)**.
2. Locate the constant `DEFAULT_SHEET_URL` at the top of the file:
   ```typescript
   const DEFAULT_SHEET_URL = "https://script.google.com/macros/s/AKfycbxgrTJHnKjWzHYoyNwI3GdxlgOkn5ZTJR3Q-A7x9CHWlhLOS4LtjhEI0LFVm6oaPDleeQ/exec";
   ```
3. Replace the placeholder string with your copied Web App URL.
