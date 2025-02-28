class NoteItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["title", "body", "date", "id"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const title = this.getAttribute("title") || "";
    const body = this.getAttribute("body") || "";
    const date = new Date(this.getAttribute("date")).toLocaleDateString(
      "id-ID",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
    const id = this.getAttribute("id");

    this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }

                .note-card {
                    background: var(--card-background);
                    border-radius: 12px;
                    padding: 1.5rem;
                    height: 100%;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    overflow: hidden;
                }

                .note-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 4px;
                    background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .note-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
                }

                .note-card:hover::before {
                    opacity: 1;
                }

                .note-header {
                    margin-bottom: 1rem;
                }

                h2 {
                    color: var(--primary-color);
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin: 0;
                    margin-bottom: 0.5rem;
                    line-height: 1.4;
                }

                .date {
                    color: #666;
                    font-size: 0.875rem;
                    margin-bottom: 1rem;
                    font-style: italic;
                }

                .body {
                    color: var(--text-color);
                    line-height: 1.6;
                    margin-bottom: 1.5rem;
                    flex-grow: 1;
                    white-space: pre-line;
                }

                .actions {
                    display: flex;
                    gap: 0.75rem;
                    margin-top: auto;
                }

                button {
                    padding: 0.625rem 1rem;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                    font-size: 0.875rem;
                    transition: all 0.2s ease;
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }

                .delete {
                    background-color: var(--danger-color);
                    color: white;
                }

                .delete:hover {
                    background-color: #c0392b;
                }

                .archive {
                    background-color: var(--secondary-color);
                    color: white;
                }

                .archive:hover {
                    background-color: #2980b9;
                }

                /* Icon styles */
                .icon {
                    width: 16px;
                    height: 16px;
                    fill: currentColor;
                }
            </style>
            <article class="note-card">
                <div class="note-header">
                    <h2>${title}</h2>
                    <div class="date">${date}</div>
                </div>
                <div class="body">${body}</div>
                <div class="actions">
                    <button class="archive" data-id="${id}">
                        <svg class="icon" viewBox="0 0 24 24">
                            <path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM6.24 5h11.52l.83 1H5.42l.82-1zM5 19V8h14v11H5zm8.45-9h-2.9v3H8l4 4 4-4h-2.55v-3z"/>
                        </svg>
                        Archive
                    </button>
                    <button class="delete" data-id="${id}">
                        <svg class="icon" viewBox="0 0 24 24">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                        Delete
                    </button>
                </div>
            </article>
        `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const deleteBtn = this.shadowRoot.querySelector(".delete");
    const archiveBtn = this.shadowRoot.querySelector(".archive");

    deleteBtn.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("delete-note", {
          detail: { id: this.getAttribute("id") },
          bubbles: true,
          composed: true,
        })
      );
    });

    archiveBtn.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("archive-note", {
          detail: { id: this.getAttribute("id") },
          bubbles: true,
          composed: true,
        })
      );
    });
  }
}

customElements.define("note-item", NoteItem);
