# MERN Stack Notes App

A full-stack **Notes Application** built using the **MERN stack** (MongoDB, Express, React, and Node.js). This project allows users to register, log in, and manage their notes efficiently. Notes can be created, updated, deleted, and categorized using tags.

## Features

- User Authentication (Registration & Login)
- Create, Read, Update, and Delete (CRUD) operations for notes
- Organize notes with tags
- Pin important notes
- Secure API routes with JWT authentication

## Technologies Used

### Backend
- **Node.js**
- **Express.js**
- **MongoDB** with **Mongoose**
- **JWT Authentication**

### Frontend
- **React.js** (for UI components)
- **Axios** (for HTTP requests)
- **Bootstrap/Tailwind CSS** (optional for styling)

## Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

## Installation and Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/muralikrishna1729/notes-app.git
   cd notes-app
   ```

2. **Backend Setup:**
   - Navigate to the `server` directory:
     ```bash
     cd server
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file with the following content:
     ```env
     ACCESS_TOKEN_SECRET=your_secret_key_here
     PORT=5000
     ```
   - Update `config.json` with your MongoDB connection string.

   - Start the backend server:
     ```bash
     npm start
     ```

3. **Frontend Setup:**
   - Navigate to the `client` directory:
     ```bash
     cd client
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the frontend development server:
     ```bash
     npm start
     ```

## API Endpoints

### User Routes
- `POST /create-account`: Create a new user account
- `POST /login`: Log in a user and get an access token
- `GET /get-user`: Get user details (protected)

### Note Routes
- `POST /add-note`: Add a new note (protected)
- `POST /edit-note/:noteId`: Edit an existing note (protected)
- `GET /get-all-notes`: Fetch all notes for a user (protected)
- `DELETE /delete-note/:noteId`: Delete a specific note (protected)
- `PUT /update-note-pinned/:noteId`: Update the pinned status of a note (protected)

## Usage Instructions
1. Register a new account or log in if you already have an account.
2. Create notes by providing a title, content, and optional tags.
3. View, update, or delete notes as needed.
4. Pin important notes for easy access.

## Project Structure
```
notes-app/
├── client/      # React frontend
├── server/      # Node.js backend
├── models/      # Mongoose models for Notes and Users
├── routes/      # API route handlers
└── README.md    # Project documentation
```

## Future Enhancements
- Note search and filtering by tags
- Rich text editor for notes
- User profile management

## Contributing
Feel free to fork the repository and contribute by submitting a pull request.

## License
This project is licensed under the MIT License.

## Author
**Vayalapalli Murali Krishna**
- [GitHub](https://github.com/muralikrishna1729)
- [LinkedIn](https://www.linkedin.com/in/murali-krishna-vayalapalli-b15365280)
