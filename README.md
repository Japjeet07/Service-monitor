
### Installation

To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/Japjeet07/Service-monitor.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Project

Start the development server:
```bash
npm run dev
```

This will launch the application in development mode. Open your browser and navigate to `http://localhost:3000` (or the port specified in the terminal) to view the application.

```markdown
## Overview

This is a web application designed to monitor and manage the status of various infrastructure services. It provides real-time updates, detailed service metrics, and historical event tracking to ensure seamless operations and quick troubleshooting.

## Design Philosophy

The application is built with a focus on **usability**, **performance**, and **scalability**. It leverages modern web technologies and design principles to deliver a responsive and visually appealing user experience. Key design aspects include:

- **Component-Based Architecture**: The application is structured using reusable React components, ensuring modularity and maintainability.
- **Tailwind CSS**: Tailwind is used for styling, enabling rapid UI development with a consistent design system.
- **Accessibility**: The UI components are designed to be accessible, ensuring compatibility with assistive technologies.
- **Responsive Design**: The layout adapts seamlessly to different screen sizes, providing an optimal experience across devices.

## Data Flow and Updates

### Data Sources
The application uses a mock API service (`src/services/api.ts`) to simulate backend interactions. In a real-world scenario, this would connect to an actual backend system to fetch and update data.

### Data Fetching
- **React Query**: The application uses React Query for efficient data fetching, caching, and synchronization. This ensures that the UI remains responsive while minimizing unnecessary network requests.
- **Polling**: Service statuses are updated periodically using polling mechanisms, ensuring real-time visibility into service health.

### Data Storage
- **In-Memory State**: Data fetched from the API is stored in memory using React Query's caching system. This avoids the need for persistent storage and ensures fast access to data.
- **Optimistic Updates**: When creating, updating, or deleting services, the application uses optimistic updates to provide immediate feedback to the user while the actual API call is processed.

### Data Updates
- **Service Status**: The `getServiceStatuses` method in the mock API simulates random status changes for demonstration purposes. In a real-world scenario, this would be replaced with actual backend logic.
- **Event History**: Historical events for each service are fetched using pagination, ensuring scalability for large datasets.

## Features

### Dashboard
- Displays a summary of all services, including their name, type, status, response time, and last checked timestamp.
- Provides filtering and search capabilities to quickly locate specific services.

### Service Details
- Shows detailed information about a selected service, including its description, URL, metrics, and event history.
- Allows users to view historical events with pagination.

### Service Management
- Users can add, edit, and delete services using intuitive forms and dialogs.
- Optimistic updates ensure a smooth user experience during these operations.

### Notifications
- Toast notifications are used to provide feedback on user actions, such as successful updates or errors.

## Technologies Used

- **React**: For building the user interface.
- **React Query**: For data fetching and caching.
- **Tailwind CSS**: For styling.
- **Radix UI**: For accessible and customizable UI components.
- **Lucide Icons**: For consistent and visually appealing icons.
- **TypeScript**: For type safety and improved developer experience.
- **Vite**: For fast development and build processes.

## Folder Structure

- `src/components`: Contains reusable UI components.
- `src/pages`: Contains page-level components for routing.
- `src/services`: Contains the mock API service.
- `src/types`: Contains TypeScript interfaces for data models.
- `src/hooks`: Contains custom React hooks.
- `src/lib`: Contains utility functions.

## Future Enhancements

- Integration with a real backend system for live data.
- Advanced analytics and reporting features.
- Role-based access control for managing services.
- Improved error handling and logging mechanisms.

This project demonstrates a robust foundation for building service monitoring dashboards and can be extended to meet specific organizational needs.