# CyberAuth - User Authentication System

A cyberpunk-themed user authentication website with PHP backend and MySQL database.

## Features

- 🎨 Cyberpunk UI Design with Three.js 3D animations
- 🔐 Secure user authentication with PHP backend
- 🗄️ MySQL database with password hashing (bcrypt)
- 🎭 Password reveal functionality
- 📱 Responsive design
- ⚡ Modern JavaScript with async/await
- 🌐 RESTful API architecture

## Setup Instructions

### 1. Database Setup

1. Start your MySQL server (XAMPP, WAMP, or standalone MySQL)
2. Open phpMyAdmin or MySQL command line
3. Run the SQL script located at `config/setup.sql`:
   ```sql
   source config/setup.sql
   ```
   Or manually execute the SQL commands in the file.

This will create:
- Database: `cyberauth_db`
- Table: `users` (with password hashing)
- Table: `user_sessions` (optional, for future session management)

### 2. Configure Database Connection

Edit `config/database.php` if needed:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');  // Your MySQL password
define('DB_NAME', 'cyberauth_db');
```

### 3. Update HTML Files

Replace `auth.js` references with `auth-backend.js` in:
- `signup.html`
- `login.html`
- `dashboard.html`

Change:
```html
<script src="auth.js"></script>
```

To:
```html
<script src="auth-backend.js"></script>
```

### 4. Start PHP Server

Option 1: Using PHP built-in server
```bash
php -S localhost:8000
```

Option 2: Using XAMPP/WAMP
- Copy the project folder to `htdocs` or `www` directory
- Access via: `http://localhost/User Authentication/`

### 5. Test the Application

1. Open `http://localhost:8000/index.html` (or your XAMPP URL)
2. Click "SIGN UP" to create a new account
3. Fill in username, email, and password
4. Login with your credentials
5. Access your dashboard

## Project Structure

```
User Authentication/
├── api/
│   ├── signup.php          # User registration endpoint
│   └── login.php           # User login endpoint
├── config/
│   ├── database.php        # Database connection
│   └── setup.sql          # Database schema
├── index.html             # Landing page
├── signup.html            # Registration page
├── login.html             # Login page
├── dashboard.html         # User dashboard
├── styles.css             # Cyberpunk styling
├── auth-backend.js        # Frontend auth with API calls
├── cyberpunk-scene.js     # Three.js animations
└── README.md             # This file
```

## Security Features

- ✅ Password hashing using bcrypt (cost factor: 12)
- ✅ Prepared statements (SQL injection protection)
- ✅ Input validation (client and server-side)
- ✅ Email format validation
- ✅ Password strength requirements (min 6 characters)
- ✅ CORS headers for API security
- ✅ HTTP status codes for proper error handling

## API Endpoints

### POST /api/signup.php
Register a new user
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

### POST /api/login.php
Authenticate user
```json
{
  "email": "string",
  "password": "string"
}
```

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **3D Graphics**: Three.js
- **Backend**: PHP 7.4+
- **Database**: MySQL 5.7+
- **Password Hashing**: bcrypt (PHP password_hash)
- **API**: RESTful JSON API

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - Feel free to use for learning and projects

## Author

Created with cyberpunk aesthetics and modern web technologies
