class AppBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background-color: var(--primary-color);
                    color: white;
                    padding: 1rem;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                h1 {
                    margin: 0;
                    font-size: 1.5rem;
                }

                nav {
                    display: flex;
                    gap: 1rem;
                }

                button {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    transition: background-color 0.2s;
                }

                button:hover {
                    background-color: rgba(255,255,255,0.1);
                }

                .active {
                    background-color: var(--secondary-color);
                }

                @media (max-width: 768px) {
                    .container {
                        flex-direction: column;
                        gap: 1rem;
                    }
                }
            </style>
            <div class="container">
                <h1>Notes App</h1>
                <nav>
                    <button id="showActive" class="active">Active Notes</button>
                    <button id="showArchived">Archived Notes</button>
                </nav>
            </div>
        `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const activeBtn = this.shadowRoot.querySelector("#showActive");
    const archivedBtn = this.shadowRoot.querySelector("#showArchived");

    activeBtn.addEventListener("click", () => {
      activeBtn.classList.add("active");
      archivedBtn.classList.remove("active");
      this.dispatchEvent(
        new CustomEvent("show-active", {
          bubbles: true,
          composed: true,
        })
      );
    });

    archivedBtn.addEventListener("click", () => {
      archivedBtn.classList.add("active");
      activeBtn.classList.remove("active");
      this.dispatchEvent(
        new CustomEvent("show-archived", {
          bubbles: true,
          composed: true,
        })
      );
    });
  }
}

customElements.define("app-bar", AppBar);
