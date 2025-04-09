interface JiraIssueFormData {
  title: string;
  description: string;
}

export class JiraIssueForm {
  private container: HTMLElement;
  private onSubmit: (data: JiraIssueFormData) => void;

  constructor(container: HTMLElement, onSubmit: (data: JiraIssueFormData) => void) {
    this.container = container;
    this.onSubmit = onSubmit;
    this.render();
  }

  private render() {
    this.container.innerHTML = `
      <div class="jira-form" style="display: none;">
        <h3>Create Jira Issue</h3>
        <form id="jiraForm">
          <div class="form-group">
            <label for="title">Title</label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              class="input" 
              placeholder="Enter issue title"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="description">Description</label>
            <textarea 
              id="description" 
              name="description" 
              class="input" 
              rows="4" 
              placeholder="Enter issue description"
              required
            ></textarea>
          </div>

          <div class="form-actions">
            <button type="button" class="button button-secondary" id="cancelJira">
              Cancel
            </button>
            <button type="submit" class="button">
              Create Issue
            </button>
          </div>
        </form>
      </div>
    `;

    const form = this.container.querySelector('#jiraForm');
    const cancelButton = this.container.querySelector('#cancelJira');

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      this.onSubmit({
        title: formData.get('title') as string,
        description: formData.get('description') as string
      });
    });

    cancelButton?.addEventListener('click', () => {
      this.hide();
    });

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .jira-form {
        padding: 16px;
        background: white;
      }

      .form-group {
        margin-bottom: 16px;
      }

      .form-group label {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 500;
        color: #333;
      }

      .input {
        width: 100%;
        padding: 8px;
        border: 1px solid #E5E5E5;
        border-radius: 4px;
        font-size: 14px;
      }

      .input:focus {
        outline: none;
        border-color: #18A0FB;
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 16px;
      }

      .button-secondary {
        background-color: white;
        border: 1px solid #E5E5E5;
        color: #333;
      }

      .button-secondary:hover {
        background-color: #F5F5F5;
      }
    `;
    document.head.appendChild(style);
  }

  show() {
    const form = this.container.querySelector('.jira-form') as HTMLElement;
    if (form) {
      form.style.display = 'block';
    }
  }

  hide() {
    const form = this.container.querySelector('.jira-form') as HTMLElement;
    if (form) {
      form.style.display = 'none';
    }
  }
} 