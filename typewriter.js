// TypeWriter class definition
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.isDeleting = false;
        this.isRunning = false;
        this.typeTimeout = null;
        this.type();
    }

    type() {
        if (this.isRunning) return; // Prevent multiple instances
        this.isRunning = true;
        
        // Current index of word
        const current = this.wordIndex % this.words.length;
        // Get full text of current word
        const fullTxt = this.words[current];

        // Check if deleting
        if (this.isDeleting) {
            // Remove char
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            // Add char
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        // Insert txt into element
        this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

        // Initial Type Speed
        let typeSpeed = 300;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        // If word is complete
        if (!this.isDeleting && this.txt === fullTxt) {
            // Make pause at end
            typeSpeed = this.wait;
            // Set delete to true
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            // Move to next word
            this.wordIndex++;
                    // Pause before start typing (2 second delay)
        typeSpeed = 2000;
        }

        this.typeTimeout = setTimeout(() => {
            this.isRunning = false;
            this.type();
        }, typeSpeed);
    }

    // Cleanup method
    destroy() {
        if (this.typeTimeout) {
            clearTimeout(this.typeTimeout);
            this.typeTimeout = null;
        }
        this.isRunning = false;
    }
}

// Global variable to track if typewriter is already initialized
let typewriterInitialized = false;

    // Optimized initialization
    document.addEventListener('DOMContentLoaded', () => {
        // Single initialization with optimized delay
        setTimeout(init, 200);
    });

// Init App
function init() {
    // Prevent multiple initializations
    if (typewriterInitialized) return;
    
    const txtElement = document.querySelector('.txt-type');
    
    // Check if element exists before proceeding
    if (!txtElement) {
        return;
    }
    
    try {
        const words = JSON.parse(txtElement.getAttribute('data-words'));
        const wait = txtElement.getAttribute('data-wait');
        // Init TypeWriter
        new TypeWriter(txtElement, words, wait);
        typewriterInitialized = true;
    } catch (error) {
        // Silent error handling
    }
}
