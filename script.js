class SmartDataOrganizer {
    constructor() {
        this.files = [];
        this.currentStep = 1;
        this.processingSteps = [
            'Analyzing data structure...',
            'Processing instructions...',
            'Generating visualizations...',
            'Creating organized files...',
            'Packaging results...'
        ];
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // File upload functionality
        const fileInput = document.getElementById('fileInput');
        const uploadArea = document.getElementById('uploadArea');
        const uploadBtn = document.getElementById('uploadBtn');

        // Drag and drop events
        uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        uploadArea.addEventListener('drop', this.handleDrop.bind(this));
        uploadArea.addEventListener('click', () => fileInput.click());

        // File selection
        fileInput.addEventListener('change', this.handleFileSelect.bind(this));

        // Button events
        uploadBtn.addEventListener('click', this.handleUpload.bind(this));
        
        document.getElementById('processBtn').addEventListener('click', this.handleProcess.bind(this));
        document.getElementById('downloadAllBtn').addEventListener('click', this.handleDownloadAll.bind(this));
        document.getElementById('viewDetailsBtn').addEventListener('click', this.handleViewDetails.bind(this));
        document.getElementById('startOverBtn').addEventListener('click', this.handleStartOver.bind(this));
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('uploadArea').classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('uploadArea').classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('uploadArea').classList.remove('drag-over');
        
        const files = Array.from(e.dataTransfer.files);
        this.addFiles(files);
    }

    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        this.addFiles(files);
    }

    addFiles(files) {
        const validFiles = files.filter(file => this.isValidFileType(file));
        
        if (validFiles.length === 0) {
            this.showNotification('Please select valid file types (CSV, Excel, JSON, TXT)', 'error');
            return;
        }

        this.files = [...this.files, ...validFiles];
        this.renderFileList();
        this.updateUploadButton();
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

    renderFileList() {
        const fileList = document.getElementById('fileList');
        
        if (this.files.length === 0) {
            fileList.innerHTML = '';
            return;
        }

        fileList.innerHTML = this.files.map((file, index) => `
            <div class="file-item fade-in">
                <div class="file-info">
                    <i class="fas ${this.getFileIcon(file)}"></i>
                    <div class="file-details">
                        <div class="file-name">${file.name}</div>
                        <div class="file-size">${this.formatFileSize(file.size)}</div>
                    </div>
                </div>
                <button class="remove-file" onclick="dataOrganizer.removeFile(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    getFileIcon(file) {
        const extension = file.name.split('.').pop().toLowerCase();
        switch (extension) {
            case 'csv': return 'fa-file-csv';
            case 'xlsx':
            case 'xls': return 'fa-file-excel';
            case 'json': return 'fa-file-code';
            case 'txt': return 'fa-file-alt';
            default: return 'fa-file';
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    removeFile(index) {
        this.files.splice(index, 1);
        this.renderFileList();
        this.updateUploadButton();
    }

    updateUploadButton() {
        const uploadBtn = document.getElementById('uploadBtn');
        uploadBtn.disabled = this.files.length === 0;
    }

    handleUpload() {
        if (this.files.length === 0) return;

        this.showSection('instructionsSection');
        this.showNotification('Files uploaded successfully! Please provide processing instructions.', 'success');
    }

    handleProcess() {
        const instructions = document.getElementById('instructionsText').value.trim();
        
        if (!instructions) {
            this.showNotification('Please provide processing instructions.', 'error');
            return;
        }

        this.showSection('processingSection');
        this.startProcessing();
    }

    startProcessing() {
        this.currentStep = 1;
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        // Reset steps
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active', 'completed');
        });

        const processStep = (step) => {
            if (step > this.processingSteps.length) {
                this.completeProcessing();
                return;
            }

            // Update progress
            const progress = (step / this.processingSteps.length) * 100;
            progressFill.style.width = `${progress}%`;
            progressText.textContent = this.processingSteps[step - 1];

            // Update step visual
            const stepElement = document.querySelector(`[data-step="${step}"]`);
            if (stepElement) {
                stepElement.classList.add('active');
            }

            // Complete previous steps
            for (let i = 1; i < step; i++) {
                const prevStep = document.querySelector(`[data-step="${i}"]`);
                if (prevStep) {
                    prevStep.classList.remove('active');
                    prevStep.classList.add('completed');
                }
            }

            // Simulate processing time
            const delay = Math.random() * 2000 + 1000; // 1-3 seconds
            setTimeout(() => processStep(step + 1), delay);
        };

        processStep(1);
    }

    completeProcessing() {
        // Complete final step
        const finalStep = document.querySelector(`[data-step="${this.processingSteps.length}"]`);
        if (finalStep) {
            finalStep.classList.remove('active');
            finalStep.classList.add('completed');
        }

        // Show results
        setTimeout(() => {
            this.showSection('resultsSection');
            this.generateResults();
        }, 1000);
    }

    generateResults() {
        const resultsSummary = document.getElementById('resultsSummary');
        const instructions = document.getElementById('instructionsText').value;
        
        const mockResults = {
            filesProcessed: this.files.length,
            sheetsCreated: Math.floor(Math.random() * 5) + 2,
            chartsGenerated: Math.floor(Math.random() * 3) + 1,
            recordsAnalyzed: Math.floor(Math.random() * 10000) + 1000,
            processingTime: Math.floor(Math.random() * 30) + 10
        };

        resultsSummary.innerHTML = `
            <div class="fade-in">
                <h3><i class="fas fa-check-circle" style="color: var(--success-color); margin-right: 10px;"></i>Processing Summary</h3>
                <div style="margin: 20px 0; display: grid; gap: 15px;">
                    <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border-color);">
                        <span><i class="fas fa-file" style="margin-right: 8px;"></i>Files Processed:</span>
                        <strong>${mockResults.filesProcessed}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border-color);">
                        <span><i class="fas fa-table" style="margin-right: 8px;"></i>Sheets Created:</span>
                        <strong>${mockResults.sheetsCreated}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border-color);">
                        <span><i class="fas fa-chart-bar" style="margin-right: 8px;"></i>Charts Generated:</span>
                        <strong>${mockResults.chartsGenerated}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border-color);">
                        <span><i class="fas fa-database" style="margin-right: 8px;"></i>Records Analyzed:</span>
                        <strong>${mockResults.recordsAnalyzed.toLocaleString()}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 10px 0;">
                        <span><i class="fas fa-clock" style="margin-right: 8px;"></i>Processing Time:</span>
                        <strong>${mockResults.processingTime} seconds</strong>
                    </div>
                </div>
                <div style="background: rgba(76, 175, 80, 0.1); padding: 15px; border-radius: 8px; margin-top: 20px;">
                    <p><strong>Instructions Applied:</strong></p>
                    <p style="font-style: italic; color: var(--text-secondary); margin-top: 5px;">"${instructions}"</p>
                </div>
            </div>
        `;
    }

    handleDownloadAll() {
        this.showNotification('Downloading complete package...', 'success');
        // In a real implementation, this would trigger the actual download
        this.simulateDownload('smart-data-organizer-results.zip');
    }

    handleViewDetails() {
        this.showNotification('Opening detailed results...', 'info');
        // In a real implementation, this would show detailed analysis results
    }

    handleStartOver() {
        this.files = [];
        this.currentStep = 1;
        document.getElementById('instructionsText').value = '';
        document.getElementById('fileList').innerHTML = '';
        this.updateUploadButton();
        this.showSection('uploadSection');
        this.showNotification('Ready for new data processing!', 'info');
    }

    simulateDownload(filename) {
        // Create a mock download
        const link = document.createElement('a');
        link.href = 'data:text/plain;charset=utf-8,Mock download - ' + filename;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    showSection(sectionId) {
        // Hide all sections
        const sections = ['uploadSection', 'instructionsSection', 'processingSection', 'resultsSection'];
        sections.forEach(id => {
            document.getElementById(id).style.display = 'none';
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionId);
        targetSection.style.display = 'block';
        targetSection.scrollIntoView({ behavior: 'smooth' });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: var(--shadow-hover);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }

    getNotificationColor(type) {
        switch (type) {
            case 'success': return 'var(--success-color)';
            case 'error': return 'var(--error-color)';
            case 'warning': return 'var(--warning-color)';
            default: return 'var(--primary-color)';
        }
    }
}

// Initialize the application
const dataOrganizer = new SmartDataOrganizer();

// Add some demo functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add animation to feature cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = Math.random() * 0.5 + 's';
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card').forEach(card => {
        observer.observe(card);
    });
});

// Add fadeOut animation to CSS if not already present
const style = document.createElement('style');
style.textContent = `
@keyframes fadeOut {
    from {
        opacity: 1;
        transform: translateY(0);
    }
    to {
        opacity: 0;
        transform: translateY(-10px);
    }
}
`;
document.head.appendChild(style);
