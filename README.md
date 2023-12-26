Welcome to the REPO source code of the Ohio Chess Club website.

To run in production:
Download.
Cd in terminal.
Npm install.
forever server.js

The client side code is in the /views folder.
Everything else is backend.

Updates coming soon (within 2 days of this commit):
- account menu (delete, info, change email, etc)
- forgot password (reset password, will be done with email verification, possible feature to request help if cannot be fulfilled)

This site will not just work out of the box. You must:
A. Setup the .env file. (This site runs of Mongo DB) Fields required below.<br>
- SESSION_SECRET=secret (Rand. String)
- ADMIN_UPDATE_PAGE=admin (Ex. /admin will be the admin page)
- registerPage=register (Will be decapitated soon. No need for this to changable through .env.)
- adminEmail=admin (Account with admin permissions. Keep in mind, this email you enter is specially coded into the website. Normally you would have to have a valid email address.)
- databaseURL=localhost (If your MongoDB is hosted on the same computer as the computer hosting the Ohio Chess Club. In my case it is.)
- database=ohiochessclub (The name of your database where you want all of the website data to be saved to.)