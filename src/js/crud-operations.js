/**
 * CRUD Operations for Project Management
 * Handles Create, Read, Update, Delete operations on localStorage
 */

const STORAGE_KEY = 'projectsData';

/**
 * Get all projects from localStorage
 */
function getAllProjects() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

/**
 * Save projects to localStorage
 */
function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

/**
 * CREATE: Add a new project
 */
function createProject(projectData) {
  const projects = getAllProjects();
  projects.push(projectData);
  saveProjects(projects);
  return true;
}

/**
 * READ: Get a single project by index
 */
function getProject(index) {
  const projects = getAllProjects();
  return projects[index] || null;
}

/**
 * UPDATE: Modify an existing project
 */
function updateProject(index, projectData) {
  const projects = getAllProjects();
  if (index >= 0 && index < projects.length) {
    projects[index] = projectData;
    saveProjects(projects);
    return true;
  }
  return false;
}

/**
 * DELETE: Remove a project
 */
function deleteProject(index) {
  const projects = getAllProjects();
  if (index >= 0 && index < projects.length) {
    projects.splice(index, 1);
    saveProjects(projects);
    return true;
  }
  return false;
}

/**
 * Display all projects with edit/delete actions
 */
function displayProjects() {
  const container = document.getElementById('projects-list');
  const statusEl = document.getElementById('list-status');
  const projects = getAllProjects();

  // Clear container
  container.innerHTML = '';

  if (projects.length === 0) {
    statusEl.textContent = 'No projects found. Create one using the form above!';
    statusEl.className = 'list-status info';
    return;
  }

  statusEl.textContent = `Displaying ${projects.length} project(s)`;
  statusEl.className = 'list-status success';

  // Create card wrapper for each project
  projects.forEach((project, index) => {
    const cardWrapper = document.createElement('div');
    cardWrapper.className = 'card-wrapper';
    cardWrapper.dataset.index = index;

    // Create the project card
    const card = document.createElement('project-card');
    card.setAttribute('title', project.title || '');
    card.setAttribute('image', project.image || '');
    card.setAttribute('image-alt', project.imageAlt || project.title || '');
    card.setAttribute('description', project.description || '');
    card.setAttribute('date', project.date || '');
    card.setAttribute('tags', project.tags || '');
    card.setAttribute('link', project.link || '');
    card.setAttribute('link-text', project.linkText || 'Learn More');

    // Create action buttons
    const actions = document.createElement('div');
    actions.className = 'card-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-edit';
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => editProject(index);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => confirmDelete(index);

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    cardWrapper.appendChild(card);
    cardWrapper.appendChild(actions);
    container.appendChild(cardWrapper);
  });

  // Clear status after 3 seconds
  setTimeout(() => {
    if (statusEl.className === 'list-status success') {
      statusEl.textContent = '';
      statusEl.className = 'list-status';
    }
  }, 3000);
}

/**
 * Handle form submission (Create or Update)
 */
function handleFormSubmit(event) {
  event.preventDefault();

  const formStatusEl = document.getElementById('form-status');
  const projectIndex = document.getElementById('project-index').value;

  try {
    // Gather form data
    const projectData = {
      title: document.getElementById('project-title').value.trim(),
      image: document.getElementById('project-image').value.trim(),
      imageAlt: document.getElementById('project-image-alt').value.trim(),
      description: document.getElementById('project-description').value.trim(),
      date: document.getElementById('project-date').value.trim(),
      tags: document.getElementById('project-tags').value.trim(),
      link: document.getElementById('project-link').value.trim(),
      linkText: document.getElementById('project-link-text').value.trim() || 'Learn More'
    };

    // Validate required fields
    if (!projectData.title || !projectData.image || !projectData.imageAlt || !projectData.description) {
      throw new Error('Please fill in all required fields');
    }

    // Create or Update
    if (projectIndex === '') {
      // CREATE
      createProject(projectData);
      formStatusEl.textContent = 'Project created successfully!';
      formStatusEl.className = 'success';
    } else {
      // UPDATE
      const index = parseInt(projectIndex);
      if (updateProject(index, projectData)) {
        formStatusEl.textContent = 'Project updated successfully!';
        formStatusEl.className = 'success';
      } else {
        throw new Error('Failed to update project');
      }
    }

    // Reset form and refresh display
    resetForm();
    displayProjects();

    // Clear success message after 3 seconds
    setTimeout(() => {
      formStatusEl.textContent = '';
      formStatusEl.className = '';
    }, 3000);

  } catch (error) {
    formStatusEl.textContent = `Error: ${error.message}`;
    formStatusEl.className = 'error';
  }
}

/**
 * Load project data into form for editing
 */
function editProject(index) {
  const project = getProject(index);
  if (!project) {
    alert('Project not found!');
    return;
  }

  // Populate form
  document.getElementById('project-index').value = index;
  document.getElementById('project-title').value = project.title || '';
  document.getElementById('project-image').value = project.image || '';
  document.getElementById('project-image-alt').value = project.imageAlt || '';
  document.getElementById('project-description').value = project.description || '';
  document.getElementById('project-date').value = project.date || '';
  document.getElementById('project-tags').value = project.tags || '';
  document.getElementById('project-link').value = project.link || '';
  document.getElementById('project-link-text').value = project.linkText || '';

  // Update UI
  document.getElementById('form-title').textContent = 'Update Project';
  document.getElementById('submit-btn').textContent = 'Update Project';
  document.getElementById('cancel-btn').style.display = 'inline-block';

  // Scroll to form
  document.getElementById('crud-form').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Confirm and delete project
 */
function confirmDelete(index) {
  const project = getProject(index);
  if (!project) {
    alert('Project not found!');
    return;
  }

  if (confirm(`Are you sure you want to delete "${project.title}"?\n\nThis action cannot be undone.`)) {
    if (deleteProject(index)) {
      const formStatusEl = document.getElementById('form-status');
      formStatusEl.textContent = 'Project deleted successfully!';
      formStatusEl.className = 'success';

      displayProjects();

      setTimeout(() => {
        formStatusEl.textContent = '';
        formStatusEl.className = '';
      }, 3000);
    } else {
      alert('Failed to delete project. Please try again.');
    }
  }
}

/**
 * Reset form to create mode
 */
function resetForm() {
  const form = document.getElementById('crud-form');
  form.reset();
  document.getElementById('project-index').value = '';
  document.getElementById('form-title').textContent = 'Create New Project';
  document.getElementById('submit-btn').textContent = 'Create Project';
  document.getElementById('cancel-btn').style.display = 'none';
  
  const formStatusEl = document.getElementById('form-status');
  formStatusEl.textContent = '';
  formStatusEl.className = '';
}

/**
 * Initialize the CRUD page
 */
function init() {
  // Display existing projects
  displayProjects();

  // Set up event listeners
  const form = document.getElementById('crud-form');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  const cancelBtn = document.getElementById('cancel-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', resetForm);
  }

  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', displayProjects);
  }

  console.log('CRUD operations initialized');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
