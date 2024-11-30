openAdminModal// open functions
function openAdminModal(id, name, description, image, price) {
    document.getElementById('modalServiceId').innerText = id;
    document.getElementById('modalServiceName').innerText = name;
    document.getElementById('modalServiceDescription').innerText = description;
    document.getElementById('modalServiceImage').src = image;
    document.getElementById('modalServicePrice').innerText = price + " PHP";
    document.getElementById('adminModal').style.display = 'block';

    document.getElementById('editServiceId').value = id;
    document.getElementById('editServiceName').value = name;
    document.getElementById('editServiceDescription').value = description;
    document.getElementById('editServicePrice').value = price;
}


function openAddModal() {
    document.getElementById('addModal').style.display = 'block';
}


function openEditModal() {
    document.getElementById('editModal').style.display = 'block';
    closeAdminModal();
}

//close functions
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeAdminModal();
        closeAddModal();
        if (document.getElementById('editModal').style.display == 'block') {
            closeEditModal()
        }
    }
});

function closeAddModal() {
    document.getElementById('addModal').style.display = 'none';
}

function closeAdminModal() {
    document.getElementById('adminModal').style.display = 'none';
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    document.getElementById('adminModal').style.display = 'block';
}

//fetch
function addService(event) {
    event.preventDefault();

    const formData = new FormData(document.getElementById('addServiceForm'));

    fetch('/addService', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        // Reload the page to reflect the new service
        window.location.reload();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function addService(event) {
    event.preventDefault();

    const formData = new FormData(document.getElementById('addServiceForm'));

    fetch('/addService', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        window.location.reload();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function editService(event) {
    event.preventDefault();

    const formData = new FormData(document.getElementById('editServiceForm'));

    fetch('/editService', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        // Reload the page to reflect the updated service
        window.location.reload();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function deleteService() {
    const serviceId = document.getElementById('modalServiceId').innerText;

    fetch(`/deleteService/${serviceId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        window.location.reload();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}