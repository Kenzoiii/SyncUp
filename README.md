# SyncUp - Task & Project Management Platform

A comprehensive task and project management platform built with React.js frontend, Spring Boot backend, and MySQL database. This application matches the Figma designs you provided with a modern dark theme and professional UI.

## 🚀 Features

- **User Authentication**: Secure login/register with JWT tokens
- **Task Management**: Create, assign, and track tasks with progress monitoring
- **Project Overview**: Visual progress tracking with charts and metrics
- **Team Collaboration**: Team management and member tracking
- **Calendar Integration**: Schedule meetings and track time
- **Performance Metrics**: Gamified scoring system (A+ ratings)
- **Dark Theme**: Modern UI matching your Figma designs
- **Responsive Design**: Works on desktop and mobile devices

## 🛠 Tech Stack

- **Frontend**: React.js with TypeScript, React Router, Axios, Recharts
- **Backend**: Spring Boot 3.2.0, Spring Security, Spring Data JPA
- **Database**: MySQL 8.0
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: CSS3 with modern design patterns

## 📁 Project Structure

```
SyncUp/
├── frontend/                    # React.js application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Main application pages
│   │   ├── services/           # API service layer
│   │   └── styles/             # CSS stylesheets
│   └── package.json
├── backend/                     # Spring Boot application
│   ├── src/main/java/com/syncup/
│   │   ├── entity/             # JPA entities
│   │   ├── repository/          # Data access layer
│   │   ├── service/            # Business logic
│   │   ├── controller/          # REST controllers
│   │   ├── dto/                # Data transfer objects
│   │   └── config/             # Configuration classes
│   └── pom.xml
├── setup.bat                   # Windows setup script
└── README.md
```

## 🚀 Quick Start

### Option 1: Automated Setup (Windows)
1. Run `setup.bat` - This will guide you through the entire setup process
2. Follow the prompts to set up MySQL database
3. The script will start both backend and frontend servers

### Option 2: Manual Setup

#### Prerequisites
- **Node.js** (v16 or higher)
- **Java 17** or higher
- **MySQL Server** (8.0 or higher)
- **MySQL Workbench**

#### Database Setup
1. Start MySQL Server
2. Open MySQL Workbench
3. Create database:
   ```sql
   CREATE DATABASE IF NOT EXISTS syncup_db;
   USE syncup_db;
   ```
4. Run the schema file: `backend/src/main/resources/schema.sql`

#### Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
Backend will start on: http://localhost:8080

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend will start on: http://localhost:3000

## 🔐 Default Login Credentials

After running the schema.sql file, you can use these credentials:

- **Email**: admin@syncup.com
- **Password**: admin123

## 📱 Application Pages

### Landing Page
- Clean, modern design with SyncUp branding
- Sign in and Register buttons
- Matches your Figma design exactly

### Authentication Pages
- **Login Page**: Email/password with social login options
- **Register Page**: Two-step registration process
- Form validation and error handling

### Dashboard
- **Project Overview**: Visual progress charts
- **Task Management**: Task status and completion tracking
- **Team Members**: Member activity and time tracking
- **Calendar Widget**: Schedule management
- **Performance Metrics**: Gamified scoring system

## 🎨 Design Features

- **Dark Theme**: Professional dark color scheme
- **Teal Accents**: Modern color palette matching Figma
- **Responsive Layout**: Adapts to different screen sizes
- **Modern UI Components**: Rounded corners, shadows, animations
- **Typography**: Clean, readable fonts

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/projects` - User projects
- `GET /api/dashboard/tasks` - User tasks

## 🗄 Database Schema

The application includes these main entities:
- **Users**: User accounts and authentication
- **Teams**: Team management and collaboration
- **Projects**: Project tracking and management
- **Tasks**: Task assignment and progress tracking
- **Time Logs**: Time tracking for tasks
- **Notifications**: User notifications and alerts
- **Calendar Events**: Schedule management
- **User Scores**: Gamification and performance metrics

## 🚀 Deployment

### Backend Deployment
1. Build JAR file: `mvn clean package`
2. Deploy to your preferred cloud platform
3. Update database connection in `application.properties`

### Frontend Deployment
1. Build production files: `npm run build`
2. Deploy `build/` folder to your web server
3. Update API base URL in `services/api.ts`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL server is running
   - Check credentials in `application.properties`
   - Verify database exists

2. **Frontend API Errors**
   - Check if backend is running on port 8080
   - Verify CORS configuration
   - Check browser console for errors

3. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT token expiration
   - Verify user credentials

### Support

If you encounter any issues, please check:
1. Console logs for error messages
2. Network tab for API call failures
3. Database connection status

---

**Built with ❤️ using React.js, Spring Boot, and MySQL**
