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
A. Setup the .env file. (This site runs of MySQL Databases) Fields required below.<br>
- SESSION_SECRET=secret(Rand. String)
- ADMIN_UPDATE_PAGE=admin(Ex. /admin will be the admin page)
- registerPage=register
- defaultHost=localhost (You want the database hosted on the same machine. Database should not be public. Only your machine should be connected.)
- defaultUser=____ (Information of logging in to the database. Setup in mysql accounts.)
- defaultPassword=____ (Information of logging in to the database. Setup in mysql accounts.)
- defaultDatabase=____ (Information of logging in to the database. Setup in mysql accounts.)
- adminHost=____ (Information of logging in to the database. Setup in mysql accounts.)
- adminUser=____ (Information of logging in to the database. Setup in mysql accounts.)
- adminPassword=____ (Information of logging in to the database. Setup in mysql accounts.)
- adminDatabase=ohiochessclub (Database the site will use.)
- adminEmail=admin (Account with admin permissions. Keep in mind, this email you enter is specially coded into the website. Normally you would have to have a valid email address.)