/**
 * Custom Element: <project-card>
 * A reusable card component for displaying project information
 */
class ProjectCard extends HTMLElement {
  constructor() {
    super();
    // Attach shadow DOM for encapsulation
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  /**
   * Observed attributes - when these change, attributeChangedCallback is triggered
   */
  static get observedAttributes() {
    return ['title', 'image', 'image-alt', 'description', 'link', 'link-text', 'date', 'tags'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const title = this.getAttribute('title') || 'Untitled Project';
    const image = this.getAttribute('image') || '';
    const imageAlt = this.getAttribute('image-alt') || title;
    const description = this.getAttribute('description') || '';
    const link = this.getAttribute('link') || '#';
    const linkText = this.getAttribute('link-text') || 'Learn More';
    const date = this.getAttribute('date') || '';
    const tags = this.getAttribute('tags') || '';

    // Parse tags if provided
    const tagArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          container-type: inline-size;
          position: relative;
        }

        .card {
          background: var(--card-bg, #ffffff);
          border: var(--card-border, 1px solid #e0e0e0);
          border-radius: var(--card-radius, 12px);
          padding: var(--card-padding, 1.5rem);
          box-shadow: var(--card-shadow, 0 2px 8px rgba(0, 0, 0, 0.1));
          transition: transform var(--transition-speed, 0.3s) ease, 
                      box-shadow var(--transition-speed, 0.3s) ease,
                      z-index var(--transition-speed, 0.3s) ease;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: var(--card-gap, 1rem);
          position: relative;
        }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: var(--card-shadow-hover, 0 8px 16px rgba(0, 0, 0, 0.15));
        }

        .card-header {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        h2 {
          margin: 0;
          font-size: var(--card-title-size, 1.5rem);
          font-weight: var(--card-title-weight, 700);
          color: var(--card-title-color, #1a1a1a);
          line-height: 1.3;
        }

        .card-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          font-size: var(--card-meta-size, 0.875rem);
          color: var(--card-meta-color, #666);
        }

        .card-date {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .card-date::before {
          font-size: 0.875em;
        }

        .card-image-wrapper {
          width: 100%;
          overflow: hidden;
          border-radius: var(--card-image-radius, 8px);
          background: var(--card-image-bg, #f5f5f5);
        }

        picture {
          display: block;
          width: 100%;
        }

        img {
          width: 100%;
          height: auto;
          aspect-ratio: 16 / 9;
          object-fit: cover;
          display: block;
        }

        .card-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .card-description {
          color: var(--card-text-color, #333);
          line-height: 1.6;
          font-size: var(--card-text-size, 1rem);
          margin: 0;
        }

        .card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag {
          background: var(--tag-bg, #e3f2fd);
          color: var(--tag-color, #1976d2);
          padding: 0.25rem 0.75rem;
          border-radius: var(--tag-radius, 16px);
          font-size: var(--tag-size, 0.875rem);
          font-weight: 500;
        }

        .card-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--link-color, #1976d2);
          text-decoration: none;
          font-weight: var(--link-weight, 600);
          font-size: var(--link-size, 1rem);
          transition: color var(--transition-speed, 0.3s) ease;
          align-self: flex-start;
        }

        .card-link:hover {
          color: var(--link-hover-color, #1565c0);
          text-decoration: underline;
        }

        .card-link::after {
          transition: transform var(--transition-speed, 0.3s) ease;
        }

        .card-link:hover::after {
          transform: translateX(4px);
        }

        /* Container queries for responsive design */
        @container (max-width: 400px) {
          .card {
            padding: 1rem;
          }

          h2 {
            font-size: 1.25rem;
          }

          .card-description {
            font-size: 0.9375rem;
          }
        }

        /* Fallback media queries */
        @media (max-width: 480px) {
          .card {
            padding: 1rem;
          }

          h2 {
            font-size: 1.25rem;
          }
        }
      </style>

      <article class="card">
        <div class="card-header">
          <h2>${this.escapeHtml(title)}</h2>
          ${date || tagArray.length > 0 ? `
            <div class="card-meta">
              ${date ? `<span class="card-date">${this.escapeHtml(date)}</span>` : ''}
              ${tagArray.length > 0 ? `
                <div class="card-tags">
                  ${tagArray.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}
                </div>
              ` : ''}
            </div>
          ` : ''}
        </div>

        ${image ? `
          <div class="card-image-wrapper">
            <picture>
              <img src="${this.escapeHtml(image)}" alt="${this.escapeHtml(imageAlt)}" loading="lazy">
            </picture>
          </div>
        ` : ''}

        <div class="card-content">
          <p class="card-description">${this.escapeHtml(description)}</p>
          ${link && link !== '#' ? `
            <a href="${this.escapeHtml(link)}" class="card-link" target="_blank" rel="noopener noreferrer">
              ${this.escapeHtml(linkText)}
            </a>
          ` : ''}
        </div>
      </article>
    `;
  }

  /**
   * Escape HTML to prevent XSS attacks
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Define the custom element
customElements.define('project-card', ProjectCard);
