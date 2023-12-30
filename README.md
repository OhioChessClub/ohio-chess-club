# Ohio Chess Club Backend and Frontend Website Code

Welcome to the repository containing the source code for the Ohio Chess Club website.

## Running in Production

To run the website in production, follow these steps:

1. **Download:**
   - Clone this repository to your local machine.

2. **Navigate to the Project Directory:**
   - Open a terminal and use the `cd` command to navigate to the project directory.

3. **Install Dependencies:**
   - Run the following command to install the necessary dependencies:
     ```bash
     npm install
     ```

4. **Start the Server:**
   - Use the following command to start the server:
     ```bash
     npm run devStart
     ```

## Code Structure

The client-side code is located in the `/views` folder, while everything else pertains to the backend.

## Updates (Coming Soon)

Within 2 days of this commit, expect the following updates:

- **Password Requirments**
  - Make passwords have certain requirments so they are not insecure.
  - Client side and server side detections.

## Configuration

Before using the site, ensure the following configurations in the `.env` file:

```env
SESSION_SECRET=secret          # Replace with a random string
ADMIN_UPDATE_PAGE=admin        # Example: /admin for the admin page
ADMIN_EJS_PAGE=admin           # Name of the admin EJS page view file (without .ejs) Must be in pageRender.js title and desc map.
adminEmail=admin               # Admin account email (coded into the website so it does not have to be valid)
databaseURL=localhost          # MongoDB hosted on the same computer
database=ohiochessclub         # Name of the database to store website data
port=80                        # Port to host website on
smtpAuthUser=oh...@gmail.com   # Email to use when sending emails
smtpAuthPass=abcdefghijklmnop  # APP password generated in account manager
```

## Credits

- Site Developer: Cole Bauml
- Video Scripts / Video Appearances (lots of): Michael Bauml
- Tournament Organizer: Michael Bauml