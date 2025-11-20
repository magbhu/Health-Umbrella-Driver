// layout.js

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Configuration & State ---
    let isOtpVerified = false;

    // --- 2. DOM Elements ---
    
    // Main Action Buttons
    const startRideButton = document.getElementById('startRideButton');
    const postStartRideButtons = document.getElementById('postStartRideButtons');
    const actionButton = document.getElementById('actionButton'); // Dual purpose: Enter OTP / Update Status
    const trackLocationBtn = document.getElementById('trackLocationBtn');

    // Modal Action Buttons
    const submitOtpBtn = document.getElementById('submitOtpBtn');
    const submitStatusBtn = document.getElementById('submitStatusBtn');
    const confirmLocationBtn = document.getElementById('confirmLocationBtn');
    
    // Close Icons (The 'x' in top right of modals)
    const closeButtons = document.querySelectorAll('.close-button');

    // Modals
    const otpModal = document.getElementById('otpModal');
    const statusModal = document.getElementById('statusModal');
    const trackLocationModal = document.getElementById('trackLocationModal');

    // Inputs
    // We use optional chaining (?) or checks because these elements exist inside modals
    const otpInputs = otpModal ? otpModal.querySelectorAll('.otp-input') : [];


    // --- 3. Helper Functions ---
    
    const showElement = (element) => {
        if (element) element.classList.remove('hidden');
    };

    const hideElement = (element) => {
        if (element) element.classList.add('hidden');
    };

    const clearOtpInputs = () => {
        otpInputs.forEach(input => input.value = '');
    };


    // --- 4. Event Handlers ---

    // A. "Start Ride" Button Click
    // Hides the big purple button and shows the "Track" and "Enter OTP" buttons
    if (startRideButton) {
        startRideButton.addEventListener('click', () => {
            hideElement(startRideButton);
            showElement(postStartRideButtons);
        });
    }

    // B. "Track Location" Button Click
    // Opens the map modal
    if (trackLocationBtn) {
        trackLocationBtn.addEventListener('click', () => {
            showElement(trackLocationModal);
        });
    }

    // C. "Confirm Location" Button Click (Inside Track Modal)
    // Simulates confirming the location and getting coordinates
    if (confirmLocationBtn) {
        confirmLocationBtn.addEventListener('click', () => {
            // In a real app, this would send data to backend
            alert("Location Confirmed!\n\nLatitude: 13.0403° N\nLongitude: 80.1728° E");
            
            // Close the modal
            hideElement(trackLocationModal);
        });
    }

    // D. Action Button Click (Handles both "Enter OTP" and "Update Status")
    if (actionButton) {
        actionButton.addEventListener('click', () => {
            if (!isOtpVerified) {
                // Logic: OTP is NOT verified yet, so Open OTP Modal
                showElement(otpModal);
                
                // Auto-focus on first input for better UX
                if (otpInputs.length > 0) {
                    setTimeout(() => otpInputs[0].focus(), 100); 
                }
            } else {
                // Logic: OTP IS verified, so Open Status Update Modal
                showElement(statusModal);
            }
        });
    }

    // E. OTP Input Navigation (Auto-tabbing & Backspace)
    if (otpInputs.length > 0) {
        otpInputs.forEach((input, index) => {
            // Move to next input automatically when a number is typed
            input.addEventListener('input', () => {
                if (input.value.length === 1 && index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            });

            // Move to previous input on Backspace if current is empty
            input.addEventListener('keydown', (event) => {
                if (event.key === 'Backspace' && input.value.length === 0 && index > 0) {
                    otpInputs[index - 1].focus();
                }
            });
        });
    }

    // F. Submit OTP Logic
    if (submitOtpBtn) {
        submitOtpBtn.addEventListener('click', () => {
            const otpValue = Array.from(otpInputs).map(input => input.value).join('');
            
            // Simple Validation (Ensure 4 digits)
            if (otpValue.length === 4) {
                // --- Success Scenario ---
                console.log(`OTP Verified: ${otpValue}`);
                isOtpVerified = true;
                
                // 1. Close Modal
                hideElement(otpModal);
                
                // 2. Reset Modal Inputs
                clearOtpInputs();

                // 3. Update UI Button Text
                actionButton.innerText = "Update Status";
                
                // 4. Feedback
                alert("OTP Verified successfully!");
            } else {
                alert("Please enter a valid 4-digit OTP.");
            }
        });
    }

    // G. Submit Status Logic
    if (submitStatusBtn) {
        submitStatusBtn.addEventListener('click', () => {
            // Find which radio button is selected
            const selectedStatus = document.querySelector('input[name="rideStatus"]:checked');
            
            if (selectedStatus) {
                const statusText = selectedStatus.value;
                console.log(`Status Updated: ${statusText}`);
                
                hideElement(statusModal);
                
                if (statusText === "Booking Closed") {
                    alert("Ride Completed. Booking is now closed.");
                    // Optional: Reload page or redirect
                    // window.location.reload(); 
                } else {
                    alert(`Status updated to: "${statusText}"`);
                }
            } else {
                alert("Please select a status to update.");
            }
        });
    }

    // H. Close Modal Buttons (The 'x' icons)
    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Get the specific modal ID from the data attribute
            const modalId = e.target.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                hideElement(modal);
            }
            
            // If closing OTP modal specifically, clear inputs
            if (modalId === 'otpModal') clearOtpInputs();
        });
    });

    // I. Click Outside Modal to Close (Backdrop click)
    window.addEventListener('click', (event) => {
        if (event.target === otpModal) {
            hideElement(otpModal);
            clearOtpInputs();
        }
        if (event.target === statusModal) {
            hideElement(statusModal);
        }
        if (event.target === trackLocationModal) {
            hideElement(trackLocationModal);
        }
    });

});