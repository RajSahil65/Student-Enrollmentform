# Student Enrollment Form

> A serverless web form that stores student enrollment data in JsonPowerDB.

This project is the micro project for the *Introduction to JsonPowerDB* course by Login2Xplore. It is built with plain HTML, CSS and JavaScript and talks directly to JsonPowerDB through REST API calls, so no backend server is needed.

The form stores data in the `STUDENT-TABLE` relation of the `SCHOOL-DB` database, with Roll-No as the primary key. It has three control buttons: Save, Update and Reset.

## Table of Contents
- [Benefits of using JsonPowerDB](#benefits-of-using-jsonpowerdb)
- [Installation](#installation)
- [Connection Token (important)](#connection-token-important)
- [Usage example](#usage-example)
- [Screenshots](#screenshots)
- [Development setup](#development-setup)
- [Release History](#release-history)
- [Meta](#meta)
- [Contributing](#contributing)

## Benefits of using JsonPowerDB

* **Serverless:** the web page calls the database REST API directly, with no backend code to write or host.
* **Simple and fast to develop:** a few JSON commands (PUT, GET_BY_KEY, UPDATE) cover the full workflow.
* **Schema-free:** records are stored as JSON, so new fields can be added easily.
* **Multi-mode database:** document, key-value, RDBMS, geospatial and time-series functionality in one DBMS.
* **High performance and lightweight:** real-time responses with a small footprint.

## Installation

OS X, Linux & Windows:

1. Clone or download this repository.
2. Add your own JsonPowerDB connection token in `script.js` (see the next section).
3. Open `index.html` in a browser.

No build step or dependencies are required.

## Connection Token (important)

For security, the connection token is **not** included in this repository. A connection token works like a password for a JsonPowerDB account, so it should never be published in a public repo.

To test the project:

1. Register or log in at https://api.login2explore.com:5577/user/index.html and generate your own connection token.
2. Open `script.js` and replace the placeholder on this line with your token:
   ```js
   const CONNECTION_TOKEN = "YOUR_CONNECTION_TOKEN_HERE";
   ```
3. Save the file and refresh `index.html`.

The database `SCHOOL-DB` and relation `STUDENT-TABLE` are created in your own account when the first record is inserted (for example, with a PUT request in Talend API Tester).

## Usage example

1. Enter a Roll-No and press Tab.
   * **New Roll-No:** fill in Full-Name, Class, Birth-Date, Address and Enrollment-Date (none may be empty) and click **Save**.
   * **Existing Roll-No:** the record loads into the form. Edit the fields and click **Update**.
2. Click **Reset** at any time to clear the form.

Example request sent to JsonPowerDB when saving:

```json
{
  "token": "<your-connection-token>",
  "cmd": "PUT",
  "dbName": "SCHOOL-DB",
  "rel": "STUDENT-TABLE",
  "jsonStr": {
    "rollNo": "1",
    "fullName": "Vijay",
    "stuClass": "10",
    "birthDate": "2010-05-14",
    "address": "Pune",
    "enrollDate": "2024-06-15"
  }
}
```

## Screenshots

Add screenshots of the working form here (for example, an empty form, a saved record and the Update view), so reviewers can see the project without a token:

```
![Empty form](screenshots/empty-form.png)
![Existing record loaded](screenshots/record-loaded.png)
```

## Development setup

No installation is needed. Edit the files and refresh the browser:

* `index.html` – form layout
* `style.css` – styling
* `script.js` – JsonPowerDB calls and form logic

## Release History

* 1.0.0
    * The first proper release: Student Enrollment Form with Save, Update and Reset using the JsonPowerDB PUT, GET_BY_KEY and UPDATE commands.

## Meta

Your Name – Sahil Raj

Project link: https://github.com/RajSahil65/Student-Enrollmentform

## Contributing

1. Fork it (https://github.com/RajSahil65/Student-Enrollmentform/fork)
2. Create your feature branch (`git checkout -b feature/newFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/newFeature`)
5. Create a new Pull Request