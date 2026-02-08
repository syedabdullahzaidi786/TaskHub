## Phase V – Advanced Cloud Deployment & Event-Driven Architecture

### Objective
This phase aims to evolve the full-stack Todo application into a production-grade, cloud-native system. The goal is to introduce advanced features like recurring tasks and reminders while ensuring scalability, reliability, and decoupling through an event-driven architecture using Kafka and Dapr.

### Development Methodology
We utilize an Agentic Dev Stack workflow to minimize manual coding and maximize efficiency:
- **Spec**: Define comprehensive requirements and architectural constraints.
- **Plan**: Create detailed technical implementation plans.
- **Tasks**: Break down plans into atomic, actionable steps.
- **Implement**: Execute tasks using Claude Code, utilizing prompt-driven iterations to generate high-quality code and configuration.

### Part A – Advanced Features
The application capabilities are expanded to support complex user needs:
- **Recurring Tasks**: Automate task creation based on defined schedules.
- **Due Dates & Reminders**: Timely notifications for upcoming deadlines.
- **Advanced Organization**: Priorities, Tags, Search, Filter, and Sort functionalities.
These features are powered by asynchronous events to ensure system responsiveness.

### Event-Driven Architecture with Kafka
Apache Kafka serves as the backbone for our decoupled microservices interaction.
- **Why Kafka?**: To handle high throughput reliability and enable asynchronous processing.
- **Topics**:
  - `task-events`: For task creation, updates, and deletion events.
  - `reminders`: For scheduling and triggering notifications.
  - `task-updates`: For real-time state synchronization across clients.
- **Producers & Consumers**: Services act as producers publishing events and consumers reacting to them, allowing features like audit logs and notifications to function independently of the core CRUD loop.
- **Benefits**: Improved scalability, fault tolerance, and loose coupling compared to a monolithic or synchronous communication approach.

### Kafka Use Cases
- **Reminder & Notification System**: Decouples scheduling logic from delivery mechanisms.
- **Recurring Task Engine**: Asynchronously generates new tasks without blocking user requests.
- **Audit & Activity Log**: Reliably records all user actions for security and debugging.
- **Real-Time Multi-Client Sync**: Pushes updates to multiple connected clients instantly.

### Part B – Local Deployment (Minikube)
Before cloud deployment, the entire stack is validated locally on Kubernetes (Minikube).
- **Dapr Installation**: Dapr is installed on the cluster to abstract infrastructure burdens.
- **Component Usage**:
  - **Pub/Sub**: Redis (local) or Kafka for message brokering.
  - **State Management**: Handling persistence for recurring task states.
  - **Service Invocation**: Reliable service-to-service communication.
  - **Jobs API**: Scheduling recurring tasks.
  - **Secrets**: Secure management of sensitive configurations.

### Part C – Cloud Deployment
The system is designed to be cloud-agnostic, supporting major providers:
- **Supported Platforms**: Azure AKS, Google GKE, Oracle OKE (Always Free).
- **Infrastructure**: Reuses and extends the Helm charts from Phase IV.
- **Kafka Options**:
  - **Redpanda Cloud / Confluent Cloud**: For managed, production-ready streaming.
  - **Strimzi**: For self-hosted Kafka clusters within Kubernetes.

### CI/CD
A robust CI/CD pipeline using GitHub Actions automates the delivery process:
- **Build**: Docker images are built and pushed to the registry.
- **Test**: Automated unit and integration tests are executed to verify functionality.
- **Deploy**: Validated changes are deployed to the target Kubernetes cluster seamlessly.

### Observability
To ensure production reliability, comprehensive monitoring is implemented:
- **Monitoring**: Metrics collection for system health, latency, and throughput.
- **Logging**: Centralized logs for tracing issues across microservices.
- **Production Readiness**: Considerations for alerts, tracing, and resource management.

### Dapr Deep Dive
Distributed Application Runtime (Dapr) is pivotal in this phase.
- **Why Dapr?**: It standardizes microservice best practices, allowing developers to focus on business logic rather than infrastructure plumbing.
- **Comparison**:
  - *Without Dapr*: Custom code for retry logic, state management, and message broker integration.
  - *With Dapr*: Standard APIs for all sidecar capabilities, easy swapping of backing services (e.g., Redis to CosmosDB) without code changes.
- **Building Blocks Used**: Pub/Sub, State Store, Service Invocation, Jobs API, and Secrets.

### Architecture Summary
The final architecture represents a modern, resilient system leveraging Kubernetes for orchestration, Dapr for application runtime needs, Kafka for event streaming, and an external PostgreSQL database for persistent storage. This combination ensures scalability, maintainability, and high availability.

### Learning Outcomes
This phase provides hands-on experience with designing event-driven microservices, managing complex Kubernetes deployments with Helm and Dapr, implementing production-grade CI/CD and observability, and utilizing cloud-native patterns for scalability and resilience.

> **Transition Note**: Phase V marks the evolution from a simple web app to a production-grade, cloud-native distributed system capable of scaling to meet real-world demands.

## License

MIT License - See LICENSE file for details