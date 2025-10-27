# SyncUp

SyncUp is a simple tool designed to help teams stay aligned in group projects. It allows users to log progress in real-time, track check-ins, comments, and notifications, helping teams stay organized and accountable.

---

## Team Members

- **Ana Claire Ellen R. Naranjo** – Team & Role entities  
- **Joseph Ericson Tiu** – User & Project entities  
- **John Kheinzy A. Mandawe** – CheckIn, Comment, Notification entities  

---

## Project Structure

### Backend
- Built with **Java Spring Boot**  
- Handles database interactions and APIs.  
- Database: **MySQL** (`dbsyncup`)  
- Packages:
  - `entity` – JPA entity classes (tables)  
  - `repository` – Database access layer  
  - `service` – Business logic layer  
  - `controller` – API endpoints for future frontend  

### Frontend
- Built with **React**  
- Currently, no API integration implemented yet.  

---

## Setup Instructions

### Backend
1. Make sure **MySQL Server** is running and a database named `dbsyncup` exists.  
2. Configure `application.properties` with your database credentials.  
3. Run the Spring Boot backend using your IDE or:
   ```bash
   mvn spring-boot:run
