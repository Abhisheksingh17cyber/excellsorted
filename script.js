// Smart Data Organizer JavaScript
class SmartDataOrganizer {
    constructor() {
        this.uploadedFiles = [];
        this.currentStep = 1;
        this.processing = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupDragAndDrop();
    }

    setupEventListeners() {
        const fileInput = document.getElementById('fileInput');
        const uploadArea = document.getElementById('uploadArea');
        
        // File input change
        fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });

        // Upload area click
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });
    }

    setupDragAndDrop() {
        const uploadArea = document.getElementById('uploadArea');

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, this.preventDefaults, false);
            document.body.addEventListener(eventName, this.preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => {
                uploadArea.classList.add('dragover');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => {
                uploadArea.classList.remove('dragover');
            });
        });

        uploadArea.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            this.handleFiles(files);
        });
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    handleFiles(files) {
        const fileArray = Array.from(files);
        const validFiles = fileArray.filter(file => this.isValidFileType(file));
        
        if (validFiles.length !== fileArray.length) {
            this.showAlert('Some files were skipped. Only CSV, Excel, JSON, and TXT files are supported.', 'warning');
        }

        this.uploadedFiles = [...this.uploadedFiles, ...validFiles];
        this.displayFileList();
        this.updateProcessButton();
    }

    isValidFileType(file) {
        const validTypes = [
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/json',
            'text/plain'
        ];
        
        const validExtensions = ['.csv', '.xlsx', '.xls', '.json', '.txt'];
        
        return validTypes.includes(file.type) || 
               validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    }

    displayFileList() {
        const fileList = document.getElementById('fileList');
        
        if (this.uploadedFiles.length === 0) {
            fileList.innerHTML = '';
            return;
        }

        const html = this.uploadedFiles.map((file, index) => `
            <div class="file-item d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <div class="file-icon ${this.getFileExtension(file.name)}">
                        ${this.getFileIcon(file.name)}
                    </div>
                    <div>
                        <div class="fw-bold">${file.name}</div>
                        <div class="file-size">${this.formatFileSize(file.size)}</div>
                    </div>
                </div>
                <button class="btn btn-sm btn-outline-danger" onclick="app.removeFile(${index})">
                    <i class="bi bi-x"></i>
                </button>
            </div>
        `).join('');

        fileList.innerHTML = `
            <div class="mt-3">
                <h6><i class="bi bi-files"></i> Uploaded Files (${this.uploadedFiles.length}):</h6>
                ${html}
            </div>
        `;
    }

    getFileExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    }

    getFileIcon(filename) {
        const ext = this.getFileExtension(filename);
        const icons = {
            csv: '<i class="bi bi-file-earmark-text"></i>',
            xlsx: '<i class="bi bi-file-earmark-spreadsheet"></i>',
            xls: '<i class="bi bi-file-earmark-spreadsheet"></i>',
            json: '<i class="bi bi-file-earmark-code"></i>',
            txt: '<i class="bi bi-file-earmark-text"></i>'
        };
        return icons[ext] || '<i class="bi bi-file-earmark"></i>';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    removeFile(index) {
        this.uploadedFiles.splice(index, 1);
        this.displayFileList();
        this.updateProcessButton();
    }

    updateProcessButton() {
        const processBtn = document.getElementById('processBtn');
        const hasFiles = this.uploadedFiles.length > 0;
        
        processBtn.disabled = !hasFiles || this.processing;
        processBtn.innerHTML = hasFiles 
            ? '<i class="bi bi-gear-fill"></i> Process Data'
            : '<i class="bi bi-exclamation-triangle"></i> Upload files first';
    }

    showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.querySelector('.container').insertBefore(alertDiv, document.querySelector('.container').firstChild);
        
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
}

// Processing functions
function startProcessing() {
    if (app.uploadedFiles.length === 0) {
        app.showAlert('Please upload at least one file before processing.', 'warning');
        return;
    }

    const instructions = document.getElementById('instructions').value.trim();
    if (!instructions) {
        app.showAlert('Please provide processing instructions.', 'warning');
        return;
    }

    app.processing = true;
    app.updateProcessButton();

    // Show processing section
    document.getElementById('processing').style.display = 'block';
    document.getElementById('processing').scrollIntoView({ behavior: 'smooth' });

    // Simulate processing steps
    simulateProcessing();
}

function simulateProcessing() {
    const steps = [
        { id: 'step1', text: 'Analyzing file structure and data types...', duration: 2000 },
        { id: 'step2', text: 'Processing natural language instructions...', duration: 3000 },
        { id: 'step3', text: 'Applying data transformations and calculations...', duration: 4000 },
        { id: 'step4', text: 'Generating charts and visualizations...', duration: 3000 },
        { id: 'step5', text: 'Compiling final reports and organizing files...', duration: 2000 }
    ];

    let currentStep = 0;
    let progress = 0;
    const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);

    function processStep() {
        if (currentStep < steps.length) {
            const step = steps[currentStep];
            
            // Update step status
            const stepElement = document.getElementById(step.id);
            stepElement.classList.add('active');
            stepElement.innerHTML = `<i class="bi bi-hourglass-split"></i> ${step.text}`;
            
            // Update status text
            document.getElementById('statusText').textContent = step.text;
            
            // Update progress
            progress = ((currentStep + 1) / steps.length) * 100;
            const progressBar = document.getElementById('progressBar');
            progressBar.style.width = `${progress}%`;
            progressBar.textContent = `${Math.round(progress)}%`;
            
            setTimeout(() => {
                // Mark step as completed
                stepElement.classList.remove('active');
                stepElement.classList.add('completed');
                stepElement.innerHTML = `<i class="bi bi-check-circle-fill"></i> ${step.text.replace('...', ' - Completed')}`;
                
                currentStep++;
                processStep();
            }, step.duration);
        } else {
            // Processing complete
            completeProcessing();
        }
    }

    processStep();
}

function completeProcessing() {
    app.processing = false;
    app.updateProcessButton();
    
    // Update final status
    document.getElementById('statusText').textContent = 'Processing completed successfully!';
    const progressBar = document.getElementById('progressBar');
    progressBar.classList.remove('progress-bar-striped', 'progress-bar-animated');
    progressBar.classList.add('bg-success');
    
    // Show results section
    setTimeout(() => {
        document.getElementById('download').style.display = 'block';
        document.getElementById('download').scrollIntoView({ behavior: 'smooth' });
        
        // Generate preview chart
        generatePreviewChart();
    }, 1000);
}

function generatePreviewChart() {
    const ctx = document.getElementById('previewChart').getContext('2d');
    
    // Sample data for demonstration
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Monthly Sales',
                data: [12000, 19000, 15000, 25000, 22000, 30000],
                backgroundColor: [
                    'rgba(13, 110, 253, 0.8)',
                    'rgba(25, 135, 84, 0.8)',
                    'rgba(255, 193, 7, 0.8)',
                    'rgba(220, 53, 69, 0.8)',
                    'rgba(13, 202, 240, 0.8)',
                    'rgba(111, 66, 193, 0.8)'
                ],
                borderColor: [
                    'rgba(13, 110, 253, 1)',
                    'rgba(25, 135, 84, 1)',
                    'rgba(255, 193, 7, 1)',
                    'rgba(220, 53, 69, 1)',
                    'rgba(13, 202, 240, 1)',
                    'rgba(111, 66, 193, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function setInstruction(text) {
    document.getElementById('instructions').value = text;
}

function resetApp() {
    // Reset application state
    app.uploadedFiles = [];
    app.processing = false;
    app.currentStep = 1;
    
    // Clear form
    document.getElementById('instructions').value = '';
    document.getElementById('fileInput').value = '';
    
    // Hide sections
    document.getElementById('processing').style.display = 'none';
    document.getElementById('download').style.display = 'none';
    
    // Reset file list
    app.displayFileList();
    app.updateProcessButton();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Reset steps
    ['step1', 'step2', 'step3', 'step4', 'step5'].forEach(id => {
        const element = document.getElementById(id);
        element.classList.remove('active', 'completed');
        element.innerHTML = `<i class="bi bi-clock"></i> ${element.textContent.split(' - ')[0]}`;
    });
    
    // Reset progress bar
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = '0%';
    progressBar.textContent = '0%';
    progressBar.classList.add('progress-bar-striped', 'progress-bar-animated');
    progressBar.classList.remove('bg-success');
}

// Initialize app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', function() {
    app = new SmartDataOrganizer();
});

// Smooth scrolling for navigation
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Download simulation functions
function simulateDownload(filename) {
    app.showAlert(`Downloading ${filename}... (This is a demo - actual file generation would happen on the server)`, 'info');
}

// Add click handlers to download buttons
document.addEventListener('DOMContentLoaded', function() {
    // This will run after the DOM is loaded
    setTimeout(() => {
        const downloadButtons = document.querySelectorAll('#resultFiles .btn');
        downloadButtons.forEach(button => {
            button.addEventListener('click', function() {
                const fileName = this.closest('.list-group-item').querySelector('strong').textContent;
                simulateDownload(fileName);
            });
        });
    }, 100);
});
