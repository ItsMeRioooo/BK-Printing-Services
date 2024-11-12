// window.onscroll = function() {
//     const header = document.getElementById("scroll_header");
//     if (window.pageYOffset > 60) {
//         header.style.transform = "translateY(-100%)";
//     } else {
//         header.style.transform = "translateY(0)";
//     }
// }

function openServicePanel(name, description, image) {
    document.getElementById('panelServiceName').innerText = name;
    document.getElementById('panelServiceDescription').innerText = description;
    document.getElementById('panelServiceImage').src = image;
    document.getElementById('servicePanel').style.display = 'block';
}

function closePanel() {
    document.getElementById('servicePanel').style.display = 'none';
}

function openServicePanelAdmin(name, description, image) {
    document.getElementById('panelServiceName').innerText = name;
    document.getElementById('panelServiceDescription').innerText = description;
    document.getElementById('panelServiceImage').src = image;
    document.getElementById('servicePanel').style.display = 'block';
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