# Caffiend ☕  
Track your coffee consumption, measure your caffeine levels, and manage your coffee habits with ease.

## Demo  
Check out the live demo of Caffiend: [Caffiend Demo](https://caffiend-kopi-tracker.vercel.app/)

## Features  
- **Coffee Tracking**: Log your coffee consumption with details like type, cost, and time.  
- **Caffeine Level Monitoring**: Calculate your current caffeine levels based on half-life.  
- **Statistics**: View daily caffeine intake, average coffee consumption, and total cost.  
- **History**: Review your coffee consumption history with detailed timestamps.  
- **Authentication**: Sign up, log in, and manage your data securely with Firebase.  

## Installation  
1. Clone the repository:  
   ```bash
   git clone https://github.com/your-username/caffiend.git
   cd caffiend
2. Install dependencies:
   ```bash
   npm install
3. Set up firebase:
   Create a .env file in the root directory and add your Firebase configuration:
   ```bash
   VITE_FIREBASE_APIKEY=your-api-key
   VITE_FIREBASE_AUTHDOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECTID=your-project-id
   VITE_FIREBASE_STORAGEBUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGINGSENDERID=your-messaging-sender-id
   VITE_FIREBASE_APPID=your-app-id
4. Start the development server:
   ```bash
   npm run dev

## Usage
1. Open the app in your browser at http://localhost:5173.
2. Sign up or log in to start tracking your coffee consumption.
3. Add coffee entries, view statistics, and monitor your caffeine levels.
## Technologies Used
* Frontend: React, Vite
* State Management: React Context API
* Authentication & Database: Firebase Authentication, Firestore
* Styling: CSS, FantaCSS
* Icons: Font Awesome
