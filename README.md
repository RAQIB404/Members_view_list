# React List View with Inline Editing, Pagination, Search, and CSV Export

This is a React project that implements a responsive list view with inline editing, pagination, search functionality, and CSV export. The list view is populated with data fetched from a JSON endpoint and displays member information including ID, Name, Email, and Role.

## Features

- **Responsive Design**: The list view is fully responsive and adapts to different screen sizes, including desktop, tablet, and mobile devices.
- **Inline Editing**: Users can edit member details directly in the table and save changes.
- **Pagination**: The list view includes pagination controls that allow users to navigate through different pages of data.
- **Search Functionality**: Users can search for members by Name, Email, or Role.
- **CSV Export**: Users can export the member list as a CSV file.

## Technologies Used

- React
- HTML5, CSS3
- JavaScript (ES6+)
- Fetch API

## Project Structure

```plaintext
project
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ListView.js
│   │   ├── ListView.css
│   ├── App.js
│   └── index.js
└── package.json