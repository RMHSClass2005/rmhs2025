document.addEventListener('DOMContentLoaded', () => {
    const whereButton = document.getElementById('where-button');
    const modal = document.getElementById('modal');
    const whereModalContent = document.getElementById('whereModalContent');
    const whereCloseModal = document.getElementById('whereCloseModal');
    const whereForm = document.getElementById('where-form');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');

    // Open Where modal
    whereButton.addEventListener('click', () => {
        modal.style.display = 'flex';
        whereModalContent.style.display = 'block';
        // Hide previous messages
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
    });

    function closeModal() {
        const submitBtn = document.getElementById('modalSubmitButton');
        modal.style.display = 'none';
        successMessage.style.display = 'none'; // Hide previous messages
        errorMessage.style.display = 'none';
        whereForm.reset();
        document.getElementById('fileInput').value = '';
        document.getElementById('filePreview').innerHTML = '';
        submitBtn.disabled = false;
        submitBtn.classList.remove('disabled');
        submitBtn.textContent = 'Submit'
    }

    // Close modal when clicking the close button
    whereCloseModal.addEventListener('click', () => {
        closeModal()
    });

    // Close modal when clicking outside modal content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal()
        }
    });

    const devId = 'AKfycbxmZnWXP4xQa-fV9MFidR_cDMudx2BjJN6PaUtDZlXlap0BiUiWcu9-V6ySjkZMlWgc'; // dev (localhost)
    const prodId = 'AKfycbxcyRrKY5KXgu8FqsBWM8a5gBlYNCZ3j5f01tD4p-z6HUB7xNvcgmRSu4qOzcP6yBPR'; // production (rmhs05alumni.com)
    const id = location.hostname === 'localhost' ? devId : prodId;

    // Handle what are you up to form submission
    whereForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Disable the submit button
        const submitBtn = document.getElementById('modalSubmitButton');
        submitBtn.disabled = true;
        submitBtn.classList.add('disabled');
        submitBtn.textContent = 'Submitting, please wait...';

        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const file = document.getElementById('fileInput').files[0];

        const reader = new FileReader();
        reader.onload = () => {
            const base64File = reader.result.split(',')[1]; // Remove data URI prefix
            const payload = {
                name,
                description,
                file: base64File,
            };

            fetch(`https://script.google.com/macros/s/${id}/exec`, {
                method: 'POST',
                redirect: 'follow',
                headers: {'Content-Type': 'text/plain;charset=utf-8'},
                body: JSON.stringify(payload),
            })
                .then(response => response.text())
                .then(result => {
                    const res = JSON.parse(result);
                    if (res.status === "success") {
                        successMessage.style.display = 'block';
                        errorMessage.style.display = 'none';
                        setTimeout(() => {
                            closeModal()
                        }, 5000)
                    } else {
                        successMessage.style.display = 'none';
                        errorMessage.style.display = 'block';
                    }
                })
                .catch(() => {
                    successMessage.style.display = 'none';
                    errorMessage.style.display = 'block';
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('disabled');
                    submitBtn.textContent = 'Submit';
                })
        };
        reader.readAsDataURL(file);
    });

    // FAQ expansion logic
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const answer = button.nextElementSibling;
            const isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';

            // Close all other answers (optional)
            document.querySelectorAll('.faq-answer').forEach(a => {
                a.style.maxHeight = null;
            });

            if (!isOpen) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = null;
            }
        });
    });


    // Handle contact form submission
    const contactForm = document.getElementById('contact-form');
    const contactSuccess = document.getElementById('contact-success');
    const contactError = document.getElementById('contact-error');

    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const template = location.hostname === 'localhost' ? 'template_t8zgsc8' : 'template_fxtfobb';

        emailjs.sendForm('rmhsclass2005', template, contactForm)
            .then(function (response) {
                console.log('Message sent successfully', response);
                contactSuccess.style.display = 'block';
                contactError.style.display = 'none';
                contactForm.reset();

                setTimeout(() => {
                    contactSuccess.style.display = 'none';
                }, 5000);
            }, function (error) {
                console.log('Error sending message', error);
                contactSuccess.style.display = 'none';
                contactError.style.display = 'block';

                setTimeout(() => {
                    contactError.style.display = 'none';
                }, 5000);
            });
    });


    // Add a preview for the file upload
    const fileInput = document.getElementById("fileInput");
    const previewContainer = document.getElementById("filePreview");

    fileInput.addEventListener("change", () => {
        previewContainer.innerHTML = ""; // Clear previous

        const file = fileInput.files[0];
        if (!file) return;

        if (file.type.startsWith("image/")) {
            const img = document.createElement("img");
            img.src = URL.createObjectURL(file);
            img.alt = "Image preview";
            img.style.maxWidth = "100%";
            img.style.maxHeight = "200px";
            img.style.marginTop = "0.5rem";
            previewContainer.appendChild(img);
        } else {
            const text = document.createElement("p");
            text.textContent = `Selected file: ${file.name}`;
            previewContainer.appendChild(text);
        }
    });
});
