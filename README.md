E' un progetto completo Node.js/Express + MongoDB con gestione centralizzata degli errori, validazione Joi, logging avanzato con Winston e timestamp localizzati. Questo segue una struttura a livelli ben separati, tipica delle API REST professionali.

## Fase preliminare

**Creare una nuova cartella ed aprirla:**

- mkdir task-api && cd task-api

**Inizializzare un progetto Node:**

- npm init -y

Ora si avrà un file package.json base.

**Installare le dipendenze necessarie:**

- npm install
- npm install express joi mongoose morgan winston dotenv
- npm install --save-dev nodemon

- - express → web server
- - mongoose → connessione a MongoDB
- - joi → validazione dati
- - morgan + winston → logging
- - dotenv → gestione variabili ambiente
- - nodemon → autoreload in sviluppo

**Creare le cartelle**

Creare la struttura del progetto:

- mkdir models services routes middleware logs

**Avviare il progetto:**

- npm run dev oppure
- npm start

---

**Verifica**

Andare su http://localhost:3000/health per l'health check.

```
{"status":"ok"}
```

Provare le rotte con curl o Postman.

**Test rapidi (curl)**

**Creare un task (priority avanzata):**

```
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"prova test","priority":"alta"}'
```

**Elencare tutti i task:**

```
curl http://localhost:3000/api/tasks
```

**Prendere solo i completati (rotta avanzata):**

```
curl http://localhost:3000/api/tasks/completed
```

**Aggiornare un task (supponendo id = 64f...):**

```
curl -X PATCH http://localhost:3000/api/tasks/64f... \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

**Eliminare un task:**

```
curl -X DELETE http://localhost:3000/api/tasks/64f...
```

---

### Logging e file di log

- I log vengono scritti in **./logs/combined.log** ➜ tutte le richieste e operazioni ed in **./logs/error.log** ➜ errori interni
- Morgan scrive ciascuna richiesta nel logger (livello info).
- Quando si elimina un task viene scritto un log con livello warn (come richiesto dalla variante avanzata).

### Note su test, estensioni e sicurezza

- Validazione: Joi valida title (min 3), completed e priority (bassa|media|alta). Il middleware rifiuta con 400 e array dei dettagli in caso di errore.

- Service Layer: tutte le operazioni DB sono in services/taskService.js, le route non contengono logica DB.

- Error handling: centralizzato in middleware/errorHandler.js. Gli errori di Mongoose come CastError sono gestiti con 400.

---

## Flusso di funzionamento

**Avvio del server**

- Il server.js carica le variabili d’ambiente e inizializza Express.
- Connessione a MongoDB tramite mongoose.connect(MONGO_URI).
- Middleware:
- - express.json() → parsing JSON body.
- - morgan → logging delle richieste HTTP tramite Winston (logger.stream).
- Router /api/tasks → gestisce tutte le rotte CRUD sui task.
- Route /health → semplice health check.
- Middleware errorHandler → cattura errori generici e personalizzati.

**Rotte principali (routes/tasks.js)**

POST /api/tasks

- Middleware validateBody(createSchema) valida il body della richiesta.
- Chiama taskService.createTask(req.body) per salvare il task in MongoDB.
- Logger registra la creazione (info) con ID del task.
- Restituisce il task con timestamp locali.

GET /api/tasks

- Costruisce un filtro opzionale basato su query string (priority, completed).
- Recupera i task con taskService.getAllTasks(filter).
- Restituisce i task con timestamp locali.

GET /api/tasks/completed

- Filtra direttamente i task completati (completed: true) e li restituisce.

PATCH /api/tasks/:id

- Middleware validateId → controlla che id sia un ObjectId valido.
- validateBody(updateSchema) → valida il body (almeno un campo deve essere presente).
- Aggiorna il task con taskService.updateTask(id, req.body).
- Se il task non esiste → 404, altrimenti restituisce il task aggiornato.

DELETE /api/tasks/:id

- Middleware validateId.
- Chiama taskService.deleteTask(id).
- Se non esiste → 404, altrimenti logga warn ed invia il task eliminato.

**Servizio (taskService.js)**

- Contiene tutte le operazioni CRUD:
- - createTask, getAllTasks, getTaskById, updateTask, deleteTask.
- Utilizza Mongoose per interagire con il DB.
- Restituisce sempre il documento completo dopo operazioni di update/delete.

**Middleware di gestione**

- validateId → blocca richieste con ID MongoDB non valido.
- validateBody → Joi schema validation.
- errorHandler → logging dettagliato e restituzione di errori coerenti (400/500).

**Logging (logger.js)**

- Log su file:
- - error.log → solo errori.
- - combined.log → log generali.
- Console log in dev.
- Integrazione con Morgan per log automatici delle richieste HTTP.
- Supporta oggetti e stack trace.

---

1. Richiesta HTTP → Express middleware (JSON parsing + Morgan).
2. Route specifica → middleware di validazione (validateId / validateBody).
3. Logica CRUD → taskService interagisce con MongoDB.
4. Risposta al client → con timestamp locali.
5. Errori → catturati da errorHandler e loggati con Winston

[railway.com](https://taskapi-production-f773.up.railway.app)

[render.com](https://task-api-n7ss.onrender.com/)
