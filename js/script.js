window.onscroll = function() {
    const header = document.getElementById("scrollHeader");
    if (window.pageYOffset > 100) {
        header.classList.add("show");
    s} else {
        header.classList.remove("show");
    }
};