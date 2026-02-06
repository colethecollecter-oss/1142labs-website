// Age Verification Modal System
(function() {
    const AGE_VERIFICATION_KEY = '1142_age_verified';
    const VERIFICATION_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    function isAgeVerified() {
        const stored = localStorage.getItem(AGE_VERIFICATION_KEY);
        if (!stored) return false;
        
        const { timestamp } = JSON.parse(stored);
        const now = Date.now();
        
        if (now - timestamp > VERIFICATION_EXPIRY) {
            localStorage.removeItem(AGE_VERIFICATION_KEY);
            return false;
        }
        
        return true;
    }

    function createAgeVerificationModal() {
        const modal = document.createElement('div');
        modal.id = 'age-verification-modal';
        modal.className = 'age-verification-modal';
        modal.innerHTML = `
            <div class="age-verification-content">
                <div class="glitch-container">
                    <h1 class="glitch-title" data-text="AGE VERIFICATION">AGE VERIFICATION</h1>
                </div>
                <p class="verification-text">This site contains research content related to pharmacology and consciousness studies.</p>
                <p class="verification-subtext">You must be 18 years or older to continue.</p>
                
                <div class="verification-form">
                    <div class="form-group">
                        <label for="birth-month" class="form-label">Birth Month</label>
                        <select id="birth-month" class="form-input glitch-input">
                            <option value="">Select Month</option>
                            <option value="01">January</option>
                            <option value="02">February</option>
                            <option value="03">March</option>
                            <option value="04">April</option>
                            <option value="05">May</option>
                            <option value="06">June</option>
                            <option value="07">July</option>
                            <option value="08">August</option>
                            <option value="09">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="birth-day" class="form-label">Birth Day</label>
                        <input type="number" id="birth-day" class="form-input glitch-input" min="1" max="31" placeholder="01-31">
                    </div>

                    <div class="form-group">
                        <label for="birth-year" class="form-label">Birth Year</label>
                        <input type="number" id="birth-year" class="form-input glitch-input" min="1900" max="2024" placeholder="YYYY">
                    </div>
                </div>

                <div class="verification-buttons">
                    <button id="verify-btn" class="verify-button glitch-button">I CONFIRM I'M 18+</button>
                    <button id="deny-btn" class="deny-button">LEAVE SITE</button>
                </div>

                <p class="verification-warning">⚠️ Providing false information is prohibited</p>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners
        document.getElementById('verify-btn').addEventListener('click', verifyAge);
        document.getElementById('deny-btn').addEventListener('click', denyAccess);
    }

    function verifyAge() {
        const month = document.getElementById('birth-month').value;
        const day = document.getElementById('birth-day').value;
        const year = document.getElementById('birth-year').value;

        if (!month || !day || !year) {
            alert('Please fill in all fields');
            return;
        }

        const birthDate = new Date(year, month - 1, day);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age >= 18) {
            localStorage.setItem(AGE_VERIFICATION_KEY, JSON.stringify({
                verified: true,
                timestamp: Date.now()
            }));
            
            const modal = document.getElementById('age-verification-modal');
            modal.classList.add('verified');
            setTimeout(() => {
                modal.remove();
                document.body.classList.remove('age-verification-active');
            }, 500);
        } else {
            alert('You must be 18 years or older to access this site.');
        }
    }

    function denyAccess() {
        window.location.href = 'https://www.google.com';
    }

    // Initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            if (!isAgeVerified()) {
                createAgeVerificationModal();
                document.body.classList.add('age-verification-active');
            }
        });
    } else {
        if (!isAgeVerified()) {
            createAgeVerificationModal();
            document.body.classList.add('age-verification-active');
        }
    }
})();
