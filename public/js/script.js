window.onscroll = function() {
    const header = document.getElementById("scroll_header");
    if (window.pageYOffset > 60) {
        header.style.transform = "translateY(-100%)";
    } else {
        header.style.transform = "translateY(0)";
    }
}

function openPanel(serviceName, serviceDescription) {
    const panel = document.getElementById('servicePanel');
    const panelServiceName = document.getElementById('panelServiceName');
    const panelServiceDescription = document.getElementById('panelServiceDescription');
  
    panelServiceName.innerHTML = serviceName;
    panelServiceDescription.innerHTML = serviceDescription;

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