// open functions
function openServicePanelAdmin(id, name, description, image, price) {
    document.getElementById('panelServiceId').innerText = id;
    document.getElementById('panelServiceName').innerText = name;
    document.getElementById('panelServiceDescription').innerText = description;
    document.getElementById('panelServiceImage').src = image;
    document.getElementById('panelServicePrice').innerText = price + " PHP";
    document.getElementById('servicePanel').style.display = 'block';

    document.getElementById('editServiceId').value = id;
    document.getElementById('editServiceName').value = name;
    document.getElementById('editServiceDescription').value = description;
    document.getElementById('editServicePrice').value = price;
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closePanel();
        closeAdminPanel();
    }
});

function openAdminPanel() {
    document.getElementById('adminPanel').style.display = 'block';
}


//close functions
function closeAdminPanel() {
    document.getElementById('adminPanel').style.display = 'none';
}

function closeEditPanel() {
    document.getElementById('editPanel').style.display = 'none';
    
    document.getElementById('servicePanel').style.display = 'block';
}

function closePanel() {
    document.getElementById('servicePanel').style.display = 'none';
}

function openEditPanel() {
    document.getElementById('editPanel').style.display = 'block';
    closePanel();
}


//fetch
function openServicePanel(serviceId) {
	document.getElementById('servicePanel').style.display = 'block';
	fetch(`/service/${serviceId}`)
		.then(response => response.json())
		.then(data => {
			document.getElementById('panelServiceName').innerText = data.service_name;
			document.getElementById('panelServiceDescription').innerText = data.service_description;
			document.getElementById('panelServiceImage').src = data.service_img;
			document.getElementById('panelServicePrice').innerText = data.service_price + " PHP";
		});
}

function optionSchedule() {
    const serviceName = document.getElementById('panelServiceName').innerText;
    const serviceDescription = document.getElementById('panelServiceDescription').innerText;
    const servicePrice = document.getElementById('panelServicePrice').innerText;

    const data = {
        name: serviceName,
        description: serviceDescription,
        price: servicePrice
    };

    fetch('/schedule', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
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
        // Reload the page to reflect the new service
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
    const serviceId = document.getElementById('panelServiceId').innerText;

    fetch(`/deleteService/${serviceId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        // Reload the page to reflect the deleted service
        window.location.reload();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}