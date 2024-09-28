window.onscroll = function() {
    const header = document.getElementById("scroll_header");
    if (window.pageYOffset > 60) {
        header.style.transform = "translateY(-100%)";
    } else {
        header.style.transform = "translateY(0)";
    }
}