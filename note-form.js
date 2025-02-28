class NoteForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.apiBaseUrl = "https://notes-api.dicoding.dev/v2";
  }

  connectedCallback() {
    this.render();
    this.setupValidation();
  }

  render() {
    this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background: var(--card-background);
                    padding: 1.5rem;
                    border-radius: 8px;
                    margin-bottom: 2rem;
                }

                form {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                label {
                    color: var(--primary-color);
                    font-weight: bold;
                }

                input, textarea {
                    padding: 0.75rem;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 1rem;
                }

                textarea {
                    min-height: 150px;
                    resize: vertical;
                }

                .error {
                    color: var(--danger-color);
                    font-size: 0.875rem;
                    display: none;
                }

                button {
                    background-color: var(--success-color);
                    color: white;
                    padding: 0.75rem;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: background-color 0.2s;
                }

                button:hover {
                    background-color: #27ae60;
                }

                .invalid {
                    border-color: var(--danger-color);
                }
            </style>
            <form id="noteForm">
                <div class="form-group">
                    <label for="title">Title</label>
                    <input type="text" id="title" name="title" required minlength="3">
                    <span class="error" id="titleError">Title must be at least 3 characters long</span>
                </div>
                <div class="form-group">
                    <label for="body">Note Content</label>
                    <textarea id="body" name="body" required minlength="10"></textarea>
                    <span class="error" id="bodyError">Content must be at least 10 characters long</span>
                </div>
                <button type="submit">Add Note</button>
            </form>
        `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const form = this.shadowRoot.querySelector("form");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = this.shadowRoot.querySelector("#title").value;
      const body = this.shadowRoot.querySelector("#body").value;

      if (this.validateForm()) {
        await this.addNoteToAPI({ title, body });
        form.reset();
      }
    });
  }

  async addNoteToAPI({ title, body }) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });
      const data = await response.json();
      this.dispatchEvent(
        new CustomEvent("add-note", {
          detail: data.data,
          bubbles: true,
          composed: true,
        })
      );
    } catch (error) {
      console.error("Error adding note:", error);
    }
  }

  setupValidation() {
    const titleInput = this.shadowRoot.querySelector("#title");
    const bodyInput = this.shadowRoot.querySelector("#body");
    const titleError = this.shadowRoot.querySelector("#titleError");
    const bodyError = this.shadowRoot.querySelector("#bodyError");

    const validateInput = (input, error, minLength) => {
      const isValid = input.value.length >= minLength;
      input.classList.toggle("invalid", !isValid);
      error.style.display = isValid ? "none" : "block";
      return isValid;
    };

    titleInput.addEventListener("input", () => {
      validateInput(titleInput, titleError, 3);
    });

    bodyInput.addEventListener("input", () => {
      validateInput(bodyInput, bodyError, 10);
    });
  }

  validateForm() {
    const titleInput = this.shadowRoot.querySelector("#title");
    const bodyInput = this.shadowRoot.querySelector("#body");
    const titleError = this.shadowRoot.querySelector("#titleError");
    const bodyError = this.shadowRoot.querySelector("#bodyError");

    const isTitleValid = this.validateInput(titleInput, titleError, 3);
    const isBodyValid = this.validateInput(bodyInput, bodyError, 10);

    return isTitleValid && isBodyValid;
  }

  validateInput(input, error, minLength) {
    const isValid = input.value.length >= minLength;
    input.classList.toggle("invalid", !isValid);
    error.style.display = isValid ? "none" : "block";
    return isValid;
  }
}

customElements.define("note-form", NoteForm);
