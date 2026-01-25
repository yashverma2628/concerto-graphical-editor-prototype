# 🎨 Concerto Web Editor (Prototype)

> **GSoC 2026 Proof of Concept** for [Accord Project](https://accordproject.org/)
> *A visual, drag-and-drop editor for defining Concerto data models.*

![Concerto Editor Demo](https://res.cloudinary.com/dprxaeuwi/image/upload/v1769243865/wmiyycqnb9zg5yyzpke6.jpg)
*(Note: I am currently recording a full demo video. The screenshot above shows the current React Flow implementation.)*

## 💡 The Vision
The **Concerto Web Editor** aims to lower the barrier to entry for Smart Legal Contracts. Instead of writing complex `.cto` code manually, users (especially domain experts like lawyers) should be able to:
1.  **Visually Draft** data models using a drag-and-drop interface.
2.  **Define Relationships** between Concepts, Assets, and Enums intuitively.
3.  **Auto-Generate** valid Concerto syntax in real-time.

This prototype demonstrates the feasibility of this vision using **React Flow**.

## 🛠️ Tech Stack
* **Frontend:** React (Vite)
* **Visualization:** React Flow (Node-based graph engine)
* **Styling:** CSS3 (Custom "Retro-UML" theme)
* **State Management:** React Hooks

## 🚀 Key Features (Implemented)
-   ✅ **Drag-and-Drop Sidebar:** Users can drag *Concept*, *Asset*, and *Enum* nodes from the sidebar onto the canvas.
-   ✅ **Custom Node Rendering:** Nodes are not generic boxes; they are styled to resemble **UML Class Diagrams**, displaying the Class Name (Header) and Properties (Body).
-   ✅ **Canvas Logic:** Infinite canvas with zooming, panning, and node connectivity.
-   ✅ **Strict Typing Visuals:** Field types (String, Integer) are color-coded for readability.

## 🗺️ Roadmap for GSoC 2026
If selected for Google Summer of Code, my development plan includes:

| Phase | Goal | Description |
| :--- | :--- | :--- |
| **Phase 1** | **Core UI & Modeling** | Implement all Concerto types (Abstract classes, Imports, Decorators) visually. |
| **Phase 2** | **Bi-Directional Parsing** | Allow the editor to *read* existing `.cto` files and generate the graph automatically. |
| **Phase 3** | **Integration** | Embed this editor into the existing **Template Playground** and add "Export to Code" functionality. |

## 📦 How to Run Locally

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/yashverma2628/concerto-web-editor-prototype.git](https://github.com/yashverma2628/concerto-web-editor-prototype.git)
    cd concerto-web-editor-prototype
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

---
*Created by Yash Verma for Accord Project (GSoC 2026)*
