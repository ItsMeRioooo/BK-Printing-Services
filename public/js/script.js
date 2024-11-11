// window.onscroll = function() {
//     const header = document.getElementById("scroll_header");
//     if (window.pageYOffset > 60) {
//         header.style.transform = "translateY(-100%)";
//     } else {
//         header.style.transform = "translateY(0)";
//     }
// }

function openPanel(serviceName, serviceDescription, serviceImage) {
    const panel = document.getElementById('servicePanel');
    const panelServiceName = document.getElementById('panelServiceName');
    const panelServiceDescription = document.getElementById('panelServiceDescription');
    const panelServiceImage = document.getElementById('panelServiceImage');
  
    panelServiceName.innerHTML = serviceName;
    panelServiceDescription.innerHTML = serviceDescription;
    panelServiceImage.src = serviceImage;

    panel.style.display = 'block';
}
function closePanel() {
    const panel = document.getElementById('servicePanel');
    panel.style.display = 'none';
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