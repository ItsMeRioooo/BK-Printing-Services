window.onscroll = function() {
    const header = document.getElementById("scrollHeader");
    if (window.pageYOffset > 100) {
        header.style.transform = "translateY(-100%)";
    } else {
        header.style.transform = "translateY(0)";
    }
};