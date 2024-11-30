function openServiceModal(serviceId) {
    document.getElementById('modalServiceId').innerText = serviceId;
	document.getElementById('serviceModal').style.display = 'block';
	fetch(`/service/${serviceId}`)
		.then(response => response.json())
		.then(data => {
			document.getElementById('modalServiceName').innerText = data.service_name;
			document.getElementById('modalServiceDescription').innerText = data.service_description;
			document.getElementById('modalServiceImage').src = data.service_img;
			document.getElementById('modalServicePrice').innerText = data.service_price + " PHP";
		});
}
function closeServiceModal() {
    document.getElementById('serviceModal').style.display = 'none';
}


function openScheduleModal() {
    document.getElementById('scheduleModal').style.display = 'block';
    document.getElementById('serviceModal').style.display = 'none';
}
function closeScheduleModal() {
    document.getElementById('scheduleModal').style.display = 'none';
    document.getElementById('serviceModal').style.display = 'block';
}


document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeServiceModal();
        if (document.getElementById('scheduleModal').style.display == 'block') {
            closeScheduleModal();
        }
    }
});


function optionSchedule() {
    const modalId = document.getElementById('modalServiceId').innerText;
    console.log(modalId);

    const data = {
        id: modalId
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