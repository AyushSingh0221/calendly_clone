# 📅 Calendly Clone - Next.js 15 & Prisma

A high-performance, production-ready scheduling platform built with the latest web technologies. This project replicates the core functionality of Calendly, allowing users to manage event types, set global availability, and provide a seamless public booking interface for clients.

---

## 🚀 Key Features

### 🏢 **Admin Dashboard**
- **Event Management**: Create, view, and delete different meeting types (e.g., "15 Min Discovery", "1 Hour Strategy").
- **Dynamic Links**: Each event generates a unique public slug for easy sharing.
- **Real-time Updates**: Instant UI feedback for event state changes.

### 🕙 **Availability Engine**
- **Weekly Schedule**: Configure working hours for each day of the week (Sun-Sat).
- **Timezone Aware**: Backend ensures all slots are calculated relative to the user's availability.
- **Conflict Prevention**: Automatic filtering of booked slots to prevent double-bookings.

### 🔗 **Public Booking Flow**
- **Interactive Calendar**: Clients can select a date and instantly see available time slots.
- **Smart Slot Generation**: Real-time calculation of available time intervals based on:
    1.  User's weekly availability.
    2.  Event duration.
    3.  Existing confirmed bookings.
- **Seamless Booking**: Simple multi-step form to capture client details and confirm the appointment.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Database / ORM**: [Prisma](https://www.prisma.io/) with **SQLite**
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🏗️ Architecture & Technical Highlights

### **1. Server Actions for Data Integrity**
All data mutations (creating events, updating availability, booking slots) are handled via **Next.js Server Actions**. This ensures type-safety across the network boundary and eliminates the need for separate REST API endpoints.

### **2. Sophisticated Slot Generation Algorithm**
One of the most complex parts of the application is the slot generator in `src/actions/slots.ts`. It works by:
- Fetching the user's configured availability for a specific day.
- Fetching all existing "CONFIRMED" bookings for that day.
- Generating a continuous timeline of possible slots based on event duration.
- Using **Interval Overlap** logic to subtract booked time from the available timeline.

### **3. Database Schema**
The schema is normalized to handle multi-tenant scheduling:
- **User**: Profile and global settings.
- **EventType**: Definitions for different types of meetings.
- **Availability**: Weekly recurring time windows.
- **Booking**: Specific appointments tied to an event type and a client.

---

## 🚦 Getting Started

### **Prerequisites**
- Node.js 20+ 
- npm / yarn / pnpm

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/AyushSingh0221/calendly_clone
   cd calendly-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   The project uses SQLite for ease of assessment. Run the following to sync the schema:
   ```bash
   npx prisma db push
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📬 Submission Notes
This project was designed for a hiring assessment, focusing on:
- **Clean Code**: Modular component structure and clear separation of concerns.
- **Modern Standards**: Leveraging the latest Next.js 15 features (Async Params, React 19).
- **UX/UI**: A premium, "Calendly-esque" aesthetic using modern design tokens.
- **Robust Logic**: Handling complex time-based calculations with accuracy.
