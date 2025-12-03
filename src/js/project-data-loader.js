/**
 * Project Data Loader
 * Handles loading project data from localStorage and remote sources
 */

// Remote data URL - using My JSON Server (GitHub-based, no API key needed)
// Format: https://my-json-server.typicode.com/{username}/{repo}/{endpoint}
const REMOTE_DATA_URL = 'https://my-json-server.typicode.com/Myat-Thiha/personal-portfolio-hw5/projects';

// Initialize localStorage with sample data on first load
function initializeLocalStorage() {
  const localStorageKey = 'projectsData';
  
  // Check if data already exists
  if (!localStorage.getItem(localStorageKey)) {
    const localProjects = [
      {
        title: "Optimizing K-means Clustering using Transformer",
        image: "../assets/Research_Poster.jpg",
        imageAlt: "Research poster showing Transformer-based K-means optimization with performance charts and methodology diagrams",
        description: "Research project (UCSD ERSP) using Transformer models (TabPFN and looped attention mechanisms) to predict clustering centroids and reduce iteration counts compared to classical K-means variants. Benchmarked against K-means++ and evaluated on OpenML datasets, achieving significant runtime improvements.",
        date: "2024-2025",
        tags: "Machine Learning, Research, Python, Transformers",
        link: "",
        linkText: "View Research"
      },
      {
        title: "SQL Database Management System",
        image: "../assets/data_structure.gif",
        imageAlt: "Animated demonstration of B+ tree operations in the SQL database management system",
        description: "Comprehensive data structures project implementing a B+ tree-based database management system in C++. Features include efficient indexing, query processing, and CRUD operations with optimized tree balancing algorithms for fast data retrieval.",
        date: "2023",
        tags: "C++, Data Structures, Algorithms, Database",
        link: "https://github.com/Myat-Thiha/SQL-Database-Management",
        linkText: "View on GitHub"
      },
      {
        title: "Book Review Sentiment Analysis",
        image: "../assets/sentiment_analysis.png",
        imageAlt: "Visualization of sentiment analysis results showing accuracy metrics and confusion matrices",
        description: "Machine learning project for analyzing sentiment in book reviews using neural networks and logistic regression. Includes comprehensive data preprocessing pipelines, model training notebooks, and evaluation metrics to classify positive and negative reviews with high accuracy.",
        date: "2024",
        tags: "Python, Machine Learning, NLP, Neural Networks",
        link: "https://github.com/Myat-Thiha/Book-Review-Sentiment-Analysis",
        linkText: "View on GitHub"
      },
      {
        title: "Typing Tutor Game (x86 Assembly)",
        image: "../assets/typing_tutor.gif",
        imageAlt: "Terminal-based typing tutor game showing real-time typing speed and accuracy metrics",
        description: "Low-level typing tutor game implemented in x86 Assembly, demonstrating mastery of hardware-level programming. Features include real-time character input processing, performance-sensitive loop logic, and efficient memory management for a responsive user experience.",
        date: "2022",
        tags: "Assembly, x86, Low-Level, Systems Programming",
        link: "https://github.com/Myat-Thiha/Typing_Tutor_Game_with_Assemblyx86",
        linkText: "View on GitHub"
      }
    ];
    
    localStorage.setItem(localStorageKey, JSON.stringify(localProjects));
    console.log('LocalStorage initialized with project data');
  }
}

/**
 * Load projects from localStorage
 */
function loadLocalProjects() {
  const statusEl = document.getElementById('load-status');
  const container = document.getElementById('projects-container');
  
  try {
    statusEl.textContent = 'Loading from localStorage...';
    statusEl.className = 'loading';
    
    const localStorageKey = 'projectsData';
    const data = localStorage.getItem(localStorageKey);
    
    if (!data) {
      throw new Error('No data found in localStorage');
    }
    
    const projects = JSON.parse(data);
    
    // Clear existing cards
    container.innerHTML = '';
    
    // Create and append project cards
    projects.forEach(project => {
      const card = createProjectCard(project);
      container.appendChild(card);
    });
    
    statusEl.textContent = `Successfully loaded ${projects.length} projects from localStorage`;
    statusEl.className = 'success';
    
    // Clear status after 3 seconds
    setTimeout(() => {
      statusEl.textContent = '';
      statusEl.className = '';
    }, 3000);
    
  } catch (error) {
    console.error('Error loading local projects:', error);
    statusEl.textContent = `Error loading local data: ${error.message}`;
    statusEl.className = 'error';
  }
}

/**
 * Load projects from remote server using fetch API
 */
async function loadRemoteProjects() {
  const statusEl = document.getElementById('load-status');
  const container = document.getElementById('projects-container');
  const loadLocalBtn = document.getElementById('load-local-btn');
  const loadRemoteBtn = document.getElementById('load-remote-btn');
  
  try {
    // Disable buttons during fetch
    loadLocalBtn.disabled = true;
    loadRemoteBtn.disabled = true;
    
    statusEl.textContent = 'Fetching from remote server...';
    statusEl.className = 'loading';
    
    // Fetch from My JSON Server (no authentication needed)
    const response = await fetch(REMOTE_DATA_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Handle different response formats (direct array or wrapped)
    const projects = Array.isArray(data) ? data : (data.record || data.projects || data);
    
    if (!Array.isArray(projects)) {
      throw new Error('Invalid data format received from server');
    }
    
    // Clear existing cards
    container.innerHTML = '';
    
    // Create and append project cards
    projects.forEach(project => {
      const card = createProjectCard(project);
      container.appendChild(card);
    });
    
    statusEl.textContent = `Successfully loaded ${projects.length} projects from remote server`;
    statusEl.className = 'success';
    
    // Clear status after 3 seconds
    setTimeout(() => {
      statusEl.textContent = '';
      statusEl.className = '';
    }, 3000);
    
  } catch (error) {
    console.error('Error loading remote projects:', error);
    statusEl.textContent = `Error loading remote data: ${error.message}`;
    statusEl.className = 'error';
  } finally {
    // Re-enable buttons
    loadLocalBtn.disabled = false;
    loadRemoteBtn.disabled = false;
  }
}

/**
 * Create a project-card element from project data
 * @param {Object} project - Project data object
 * @returns {HTMLElement} - The created project-card element
 */
function createProjectCard(project) {
  const card = document.createElement('project-card');
  
  // Set attributes
  card.setAttribute('title', project.title || '');
  card.setAttribute('image', project.image || '');
  card.setAttribute('image-alt', project.imageAlt || project.title || '');
  card.setAttribute('description', project.description || '');
  card.setAttribute('date', project.date || '');
  card.setAttribute('tags', project.tags || '');
  card.setAttribute('link', project.link || '');
  card.setAttribute('link-text', project.linkText || 'Learn More');
  
  return card;
}

/**
 * Initialize the page
 */
function init() {
  // Initialize localStorage with data if it doesn't exist
  initializeLocalStorage();
  
  // Set up event listeners
  const loadLocalBtn = document.getElementById('load-local-btn');
  const loadRemoteBtn = document.getElementById('load-remote-btn');
  
  if (loadLocalBtn) {
    loadLocalBtn.addEventListener('click', loadLocalProjects);
  }
  
  if (loadRemoteBtn) {
    loadRemoteBtn.addEventListener('click', loadRemoteProjects);
  }
  
  console.log('Project data loader initialized');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
