# OxyGent Enhanced UI

A comprehensive user interface for the OxyGent Multi-Agent Collaboration Framework, providing access to 100% of OxyGent's features and capabilities.

## Features

- **Agent Management**: Create, configure, and monitor agents
- **Tool Management**: Register, configure, and test tools
- **Workflow Designer**: Visual interface for designing and managing workflows
- **System Configuration**: Configure system settings and environment variables
- **Performance Monitoring**: Monitor system performance and resource usage
- **Real-time Updates**: Get real-time updates on agent and workflow execution

## Architecture

The OxyGent Enhanced UI follows a modular, component-based architecture that allows for flexibility, extensibility, and maintainability. The architecture is designed to support all current and future features of the OxyGent framework.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      OxyGent UI Layer                       │
├─────────┬─────────┬─────────┬─────────┬─────────┬──────────┤
│ Agent   │ Tool    │ Workflow│ MAS     │ System  │ User     │
│ Module  │ Module  │ Module  │ Module  │ Module  │ Module   │
├─────────┴─────────┴─────────┴─────────┴─────────┴──────────┤
│                    Shared UI Components                     │
├─────────────────────────────────────────────────────────────┤
│                    State Management                         │
├─────────────────────────────────────────────────────────────┤
│                    API Integration                          │
├─────────────────────────────────────────────────────────────┤
│                    OxyGent Backend                          │
└─────────────────────────────────────────────────────────────┘
```

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/jd-opensource/OxyGent.git
   cd OxyGent/ui
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Build for production:
   ```
   npm run build
   ```

## Project Structure

```
ui/
├── components/        # Reusable UI components
├── modules/           # Feature modules
│   ├── agents/        # Agent management
│   ├── tools/         # Tool management
│   ├── workflows/     # Workflow management
│   ├── system/        # System management
│   └── users/         # User management
├── services/          # API and service integration
├── store/             # Redux store and reducers
├── styles/            # CSS styles
└── App.jsx            # Main application component
```

## Technologies

- **React**: UI library
- **Redux**: State management
- **React Router**: Routing
- **Axios**: API client
- **Event Source**: Real-time updates

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

