# Deployment Configuration Tool README

## Project Overview

The Deployment Configuration Tool is a web application built using Express.js, MongoDB, JavaScript, and Bootstrap. It serves as a user-friendly interface for configuring regions and planning deployments of servers based on various characteristics. The application adopts a tab-based layout, offering distinct sections for managing entities, companies, regions, environments, infrastructure types, and configuration settings.

## Getting Started

To run the Deployment Configuration Tool locally, follow these steps:

1. Clone the Repository:
   git clone <repository-url>

2. Install Dependencies:
   npm install

3. Start the Server:
   npm start

4. Access the Application:
   Open your browser and navigate to http://localhost:3000.

## Functionality

### Entity Management

- Add, edit, and delete entities representing deployment entities.
- List of entities with management options.
- Modal for adding/editing entities.
- Confirm Selection button to proceed to the next step.

### Company Management

- Add, edit, and delete companies associated with entities.
- List of companies with management options.
- Modals for adding/editing companies.
- Confirm Selection button to proceed to the next step.

### Region Configuration

- Add, edit, and delete regions associated with companies.
- List of regions with management options.
- Modals for adding/editing regions.
- Confirm Selection button to proceed to the next step.

### Environment and Infrastructure Selection

- Display selected entity, company, and region.
- Select environments and infrastructure types.
- Confirm button to finalize the selection.

### Configuration Settings (New Content)

- Configure additional settings for deployment.
- Dropdowns for various configuration options.
- Confirm button to finalize the configuration.

## Dependencies

- Bootstrap: Front-end styling and components.
- Select2: Enhances dropdowns with search functionality.
- Font Awesome: Icons for buttons and UI elements.
- jQuery: JavaScript library for DOM manipulation.
- SweetAlert2: Customizable popup boxes for user interactions.

## Project Structure

- public: Static assets including stylesheets and images.
- views: HTML templates for different sections.
- assets/js: External JavaScript libraries.
- js: Custom JavaScript files for managing entities, regions, etc.
- routes: Express routes for handling different endpoints.
- models: MongoDB models for entities, companies, regions, etc.
- helpers: Helper functions and services.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests following the project's coding conventions and guidelines.

## License

This project is licensed under the MIT License.
