function updateSmoothScrollLinks() {
    var navLinks = document.querySelectorAll('.menu a');
    for (i = 0; i < navLinks.length; ++i) {
        if (window.innerHeight < window.innerWidth) {
            if (!navLinks[i].className.match(/\bsmooth-scroll\b/))
                navLinks[i].className += "smooth-scroll";
        } else {
            navLinks[i].className = navLinks[i].className.replace(/(?:^|\s)smooth-scroll(?!\S)/ , '');
        }
    }
}

document.addEventListener("DOMContentLoaded", updateSmoothScrollLinks);
window.addEventListener("resize", updateSmoothScrollLinks);
