class NotesApp {
  constructor() {
    this.notes = [];
    this.showArchived = false;
    this.notesContainer = document.getElementById("notesContainer");
    this.apiBaseUrl = "https://notes-api.dicoding.dev/v2";
    this.setupEventListeners();
    this.fetchNotes();
  }

  async fetchNotes() {
    this.showLoading(true);
    try {
      const url = this.showArchived
        ? `${this.apiBaseUrl}/notes/archived`
        : `${this.apiBaseUrl}/notes`;
      const response = await fetch(url);
      const data = await response.json();
      this.notes = data.data;
      this.renderNotes();
    } catch (error) {
      Swal.fire("Error", "Failed to fetch notes. Please try again.", "error");
      console.error("Error fetching notes:", error);
    } finally {
      this.showLoading(false);
    }
  }

  async addNote({ title, body }) {
    this.showLoading(true);
    try {
      const response = await fetch(`${this.apiBaseUrl}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });
      if (!response.ok) throw new Error("Failed to add note");
      this.showArchived = false;
      await this.fetchNotes();
      Swal.fire("Success", "Note added successfully!", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to add note. Please try again.", "error");
      console.error("Error adding note:", error);
    } finally {
      this.showLoading(false);
    }
  }

  async deleteNote(id) {
    this.showLoading(true);
    try {
      await fetch(`${this.apiBaseUrl}/notes/${id}`, { method: "DELETE" });
      await this.fetchNotes();
      Swal.fire("Deleted", "Note deleted successfully!", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to delete note.", "error");
      console.error("Error deleting note:", error);
    } finally {
      this.showLoading(false);
    }
  }

  async toggleArchive(id) {
    this.showLoading(true);
    try {
      const note = this.notes.find((n) => n.id === id);
      const endpoint = note.archived ? "unarchive" : "archive";
      await fetch(`${this.apiBaseUrl}/notes/${id}/${endpoint}`, {
        method: "POST",
      });
      await this.fetchNotes();
      Swal.fire(
        "Success",
        note.archived ? "Note unarchived!" : "Note archived!",
        "success"
      );
    } catch (error) {
      Swal.fire("Error", "Failed to update note status.", "error");
      console.error("Error archiving note:", error);
    } finally {
      this.showLoading(false);
    }
  }

  showLoading(isLoading) {
    document.body.classList.toggle("loading", isLoading);
  }

  renderNotes() {
    this.notesContainer.innerHTML = "";
    if (this.notes.length === 0) {
      this.notesContainer.innerHTML = `<div class="empty-state"><h2>No ${
        this.showArchived ? "archived" : "active"
      } notes found</h2></div>`;
      return;
    }
    this.notes.forEach((note) => {
      const noteElement = document.createElement("note-item");
      noteElement.setAttribute("id", note.id);
      noteElement.setAttribute("title", note.title);
      noteElement.setAttribute("body", note.body);
      noteElement.setAttribute("date", note.createdAt);
      noteElement.setAttribute("archived", note.archived);
      this.notesContainer.appendChild(noteElement);

      // Animasi muncul dengan GSAP
      gsap.from(noteElement, { opacity: 0, y: 20, duration: 0.5 });
    });
  }

  setupEventListeners() {
    if (!this.addNoteHandler) {
      this.addNoteHandler = async (e) => {
        e.preventDefault();
        await this.addNote(e.detail);
      };
      document.addEventListener("add-note", this.addNoteHandler);
    }

    document.addEventListener(
      "delete-note",
      async (e) => await this.deleteNote(e.detail.id)
    );
    document.addEventListener(
      "archive-note",
      async (e) => await this.toggleArchive(e.detail.id)
    );
    document.addEventListener("show-active", async () => {
      this.showArchived = false;
      await this.fetchNotes();
    });
    document.addEventListener("show-archived", async () => {
      this.showArchived = true;
      await this.fetchNotes();
    });
  }
}

document.addEventListener("DOMContentLoaded", () => new NotesApp());
