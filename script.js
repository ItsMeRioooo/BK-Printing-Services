window.onscroll = function() {
    const header = document.getElementById("scrollHeader");
    if (window.pageYOffset > 100) {
        header.classList.add("show");
    s} else {
        header.classList.remove("show");
    }
};


if (window.innerWidth < 700) {
    const servicesElements = document.querySelectorAll(".service");
    servicesElements.forEach(element => {
        element.style.placeSelf = "center";
    });
} else {
    const servicesElements = document.querySelectorAll(".service");
    servicesElements.forEach(element => {
        element.style.removeProperty('place-self');
    });
}
