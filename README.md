# 🐛 BugCracker

O aplicație modernă de urmărire a bug-urilor pentru echipe de dezvoltare software. Construită cu React, Node.js, Express și MongoDB.


## ✨ Funcționalități

### Roluri Utilizatori
- **Membru Proiect (MP)** - Poate crea proiecte, aloca bug-uri și rezolva probleme
- **Tester (TST)** - Poate să se alăture proiectelor și să raporteze bug-uri

### Funcționalități Principale
- 🔐 **Autentificare** - Login/Register securizat cu token-uri JWT
- 📁 **Gestionare Proiecte** - Creare proiecte cu URL repository și membri echipă
- 🐞 **Raportare Bug-uri** - Raportare bug-uri cu severitate, prioritate și link-uri commit
- 👥 **Colaborare Echipă** - Alocare membri și testeri la proiecte
- ✅ **Rezolvare Bug-uri** - Urmărire status bug: Open → In Progress → Resolved

## 🚀 Pornire Rapidă

### Cerințe
- Node.js
- MongoDB 
- npm 

### Instalare

1. **Instalare dependențe backend**
```bash
npm install
```

2. **Instalare dependențe frontend**
```bash
cd client
npm install
cd ..
```

3. **Configurare variabile de mediu**

Creează un fișier `.env` în directorul rădăcină:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bugcracker
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
```

4. **Pornire servere de dezvoltare**

Terminal 1 - Backend:
```bash
npm run dev
```

Terminal 2 - Frontend:
```bash
cd client
npm run dev
```

5. **Deschide aplicația**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000


## 🔌 Endpoint-uri API

### Autentificare
| Metodă |       Endpoint       |       Descriere       |
|--------|----------------------|-----------------------|
|  POST  | `/api/auth/register` | Înregistrare user nou |
|  POST  | `/api/auth/login`    | Autentificare user    |
|  GET   | `/api/auth/users`    | Obține useri după rol |

### Proiecte
| Metodă |         Endpoint          |            Descriere            |
|--------|---------------------------|---------------------------------|
|  GET   | `/api/projects`           | Obține proiectele userului      |
|  GET   | `/api/projects/available` | Obține toate proiectele         |
|  GET   | `/api/projects/joinable`  | Proiecte disponibile (TST)      |
|  POST  | `/api/projects`           | Creare proiect (MP)             |
|  PATCH | `/api/projects/:id/join`  | Alăturare ca tester (TST)       |
|  PUT   | `/api/projects/:id`       | Actualizare proiect (MP)        |
|  DELETE| `/api/projects/:id`       | Ștergere proiect (MP)           |

### Bug-uri
| Metodă |         Endpoint          |      Descriere      |
|--------|---------------------------|---------------------|
| GET    | `/api/bugs`               | Obține bug-uri      |
| POST   | `/api/bugs`               | Raportare bug (TST) |
| PATCH  | `/api/bugs/:id/assign`    | Alocare bug (MP)    |
| PATCH  | `/api/bugs/:id/resolve`   | Rezolvare bug (MP)  |

## 🛠️ Tehnologii Folosite

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Bază de date
- **Mongoose** - ODM
- **JWT** - Autentificare
- **bcrypt** - Hashing parole

### Frontend
- **React** - Bibliotecă UI
- **React Router** - Rutare
- **Axios** - Client HTTP
- **TailwindCSS** - Stilizare
- **Vite** - Build tool
