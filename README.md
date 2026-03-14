# 📸 Camera_App

A full-featured browser-based Camera application. This project captures media streams from hardware and implements a persistent gallery using client-side storage.

---

### ⚙️ How it Works
The app leverages the **MediaDevices API** and **IndexedDB** to manage real-time video and storage.

```mermaid
graph TD
    A[Camera Hardware] -->|MediaStream API| B(Live Video Preview)
    B -->|Capture| C{Action}
    C -->|Photo| D[Canvas API Processing]
    C -->|Video| E[MediaRecorder API]
    D --> F[(IndexedDB Storage)]
    E --> F
    F --> G[Gallery View]
