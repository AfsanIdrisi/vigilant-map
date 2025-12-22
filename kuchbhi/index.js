document.getElementById('bookingForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const service = document.getElementById('service').value;
    
    alert(`Thank you, ${name}! Your booking for ${service} has been submitted. We'll contact you at ${email} soon.`);
});