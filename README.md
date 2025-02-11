# SI3-IR-INFRAS

## 🌍 English / 🇫🇷 Français

Welcome to **SI3-IR-INFRAS**, an application developed for the **energy teams of IR INFRAS**.  
This project features a **React.js** frontend, a **Node.js/Express** backend, and **Supabase** as a database and authentication service.

Bienvenue sur **SI3-IR-INFRAS**, une application conçue pour les **équipes énergétiques de la société IR INFRAS**.  
Ce projet inclut un **frontend en React.js**, un **backend en Node.js/Express**, et **Supabase** pour la gestion de la base de données et de l’authentification.

---

## 📌 Project Structure / 📌 Structure du projet

- **Back**: Contains backend files / Contient les fichiers du backend :
  - `model/` & `storage/`: Communicates with **Supabase** / Communique avec **Supabase**.
  - `controllers/`: Handles API responses / Gère les réponses de l'API.
  - `routes/`: Defines the backend API routes / Définit les routes du backend.
- **Front**: Contains the frontend built with **React.js** / Contient le frontend en **React.js**.
- **.github/workflows/**: GitHub Actions for CI/CD automation / Automatisation CI/CD.
- **docker-compose.yml**: Configuration for containerized deployment / Configuration pour le déploiement avec **Docker**.

---

## 🚀 Features / 🚀 Fonctionnalités

- User authentication via **Supabase**. / Authentification des utilisateurs via **Supabase**.
- Secure database integration. / Intégration sécurisée de la base de données.
- Contact management system. / Gestion des contacts.
- Company and entity management. / Gestion des entreprises et entités.
- Role-Based Access Control (RBAC) integration (planned). / RBAC (contrôle d'accès basé sur les rôles) prévu.
- Email notifications (password reset, confirmation) via **Resend SMTP**. / Envoi d'e-mails (réinitialisation de mot de passe, confirmation) via **Resend SMTP**.

---

## ⚙️ Installation / ⚙️ Installation

### **Prerequisites / Prérequis**

Ensure you have / Assurez-vous d'avoir :

- **Node.js** (latest version) / **Node.js** (dernière version)
- **NPM or Yarn** (for dependency management) / **NPM ou Yarn** (pour gérer les dépendances)
- **Docker** (for containerized deployment) / **Docker** (pour le déploiement en conteneurs)
- **Supabase account** (for database & authentication) / **Un compte Supabase** (pour la base de données et l'authentification)

### **Setup / Configuration**

1. **Clone the repository / Cloner le dépôt**:
   ```sh
   git clone https://github.com/Amine0320/SI3-IR-INFRAS.git
   cd SI3-IR-INFRAS
   ```
