# LOCKR Authentication System

LOCKR is a secure user authentication system developed as part of the Oasis Infobyte Web Development and Designing Internship, Level 2.

The application allows users to create accounts, securely authenticate, access a protected dashboard and terminate authenticated sessions.

## Features

### User Registration

Users can create an account using:

- Username
- Email address
- Password
- Password confirmation

Registration includes client-side and server-side validation.

Usernames must contain between 3 and 30 characters and may contain letters, numbers and underscores.

Passwords must:

- Contain at least 8 characters
- Contain at least one number
- Match the confirmation password

Duplicate usernames and email addresses are rejected.

### Secure Password Storage

Passwords are never stored in plain text.

LOCKR uses `bcryptjs` with a salt round value of 12 to securely hash passwords before they are stored.

### User Login

Users can sign in using either:

- Username
- Email address

Passwords are verified using bcrypt comparison.

Invalid login attempts return a generic authentication error without revealing whether the username or email exists.

### Authenticated Sessions

LOCKR uses `express-session` to maintain authenticated sessions.

Session cookies are configured with:

- HTTP-only access
- SameSite protection
- Secure cookies in production
- Two-hour session duration

A new session is generated after successful authentication.

### Protected Dashboard

The `/dashboard` route is protected by server-side authentication middleware.

Unauthenticated users attempting to access the dashboard are redirected to the login page.

The dashboard displays:

- Username
- Email address
- Account ID
- Session status
- Login time
- Remaining session time
- Password security status
- Cookie security status
- Protected route status

### Logout

Users can securely log out from the dashboard.

Logging out destroys the active Express session and clears the session cookie.

### Theme Support

LOCKR includes light and dark themes.

The selected theme is stored in the browser using localStorage.

Dark mode uses a near-black interface with dark orange accents.

### Responsive Design

The authentication interface and dashboard are designed to work across desktop, tablet and mobile screen sizes.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Node.js
- Express.js
- bcryptjs
- express-session
- JSON file storage

## Project Structure

```text
WebDev-L2-Authentication/
├── data/
│   └── users.example.json
├── protected/
│   └── dashboard.html
├── public/
│   ├── images/
│   │   └── lockr-auth-bg.jpg
│   ├── auth.js
│   ├── dashboard.css
│   ├── dashboard.js
│   ├── index.html
│   └── style.css
├── screenshots/
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js