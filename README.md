# AirSight

**AirSight** is a powerful monitoring tool designed to oversee and manage multiple Apache Airflow instances from a single, unified interface. With real-time insights and customizable alerts, AirSight provides a centralized dashboard that simplifies the tracking of Airflow DAGs, tasks, and operational health across different environments.

## Features
- **Centralized Monitoring**: Seamlessly track multiple Apache Airflow instances in one place.
- **Real-Time Alerts**: Get notified instantly of any failures, delays, or anomalies in your DAGs.
- **Detailed Insights**: Drill down into task statuses, execution times, and system metrics to optimize workflow performance.
- **User-Friendly Dashboard**: Navigate through complex workflows effortlessly with a clean, intuitive UI.
- **Scalable Solution**: Designed to handle multiple Airflow environments, making it ideal for organizations with complex data pipelines.

## Use Cases
- Data engineering teams looking to monitor complex workflows across multiple projects.
- Organizations that require high reliability in their ETL processes and need quick visibility into potential issues.
- DevOps teams aiming to optimize Apache Airflow performance and quickly address any system health concerns.

## Getting Started
Follow the steps in the **Installation Guide** to set up AirSight and start monitoring your Airflow instances.


# Installation Instructions for AirSight  

### 1. Clone the Repository  
Run the following command to clone the repository:  
```sh
git clone https://github.com/Pawinwat/AirSight.git
```  

### 2. Navigate to the Project Directory  
Move into the project folder:  
```sh
cd AirSight
```  

### 3. Install Dependencies  
Use Yarn to install all required dependencies:  
```sh
yarn install
```  

### 4. Create a `.env` File  
- Create a `.env` file in the project root directory.  
- Add the following Prisma database environment variable:  

#### Example `.env` file:  
```ini
DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"
```
Modify the values based on your database configuration.  

### 5. Push Prisma Database Schema  
Run the following command to apply the database schema:  
```sh
mpx prisma db push
```  

### 6. Pull Latest Changes  
Fetch the latest database schema and generate Prisma client:   
```sh
yarn pull
```  

### 7. Build the Project  
Finally, build the project using:  
```sh
yarn build
```  

Now your project is set up and ready to run! 🚀
