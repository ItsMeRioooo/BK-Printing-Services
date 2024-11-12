// window.onscroll = function() {
//     const header = document.getElementById("scroll_header");
//     if (window.pageYOffset > 60) {
//         header.style.transform = "translateY(-100%)";
//     } else {
//         header.style.transform = "translateY(0)";
//     }
// }

function openServicePanel(name, description, image, price) {
    document.getElementById('panelServiceName').innerText = name;
    document.getElementById('panelServiceDescription').innerText = description;
    document.getElementById('panelServiceImage').src = image;
    document.getElementById('panelServicePrice').innerText = price + " PHP";
    document.getElementById('servicePanel').style.display = 'block';
}

function closePanel() {
    document.getElementById('servicePanel').style.display = 'none';
}

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
    }
});

function optionSchedule() {
    const serviceName = document.getElementById('panelServiceName').innerText;
    const serviceDescription = document.getElementById('panelServiceDescription').innerText;
    const serviceImage = document.getElementById('panelServiceImage').src;

    const data = {
        name: serviceName,
        description: serviceDescription,
        image: serviceImage
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

function openAdminPanel() {
    document.getElementById('adminPanel').style.display = 'block';
}

function closeAdminPanel() {
    document.getElementById('adminPanel').style.display = 'none';
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

function openEditPanel() {
    document.getElementById('editPanel').style.display = 'block';
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