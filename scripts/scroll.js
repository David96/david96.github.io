function listener(e) {
    var root = /firefox|trident/i.test(navigator.userAgent) ? document.documentElement : document.body
        var easeInOutCubic = function(t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t + b
                return c/2*((t-=2)*t*t + 2) + b
        }
    var startTime
    var startPos = root.scrollTop
    var id = /[^#]+$/.exec(this.href)[0]
    var endPos = document.getElementById(id).getBoundingClientRect().top
    var maxScroll = root.scrollHeight - window.innerHeight
    var scrollEndValue = startPos + endPos < maxScroll ? endPos : maxScroll - startPos
    var duration = 500
    var scroll = function(timestamp) {
        startTime = startTime || timestamp
            var elapsed = timestamp - startTime
            var progress = easeInOutCubic(elapsed, startPos, scrollEndValue, duration)
            root.scrollTop = progress
            elapsed < duration && requestAnimationFrame(scroll)
    }
    requestAnimationFrame(scroll)
        setTimeout(function() {window.location.hash = id;}, duration)
        e.preventDefault()
}

function updateClickListeners() {
    "use strict"

    var links = document.querySelectorAll("a")
    var i = links.length

    while (i--) {
        if (links.item(i).className.match(/\bsmooth-scroll\b/)) {
            links.item(i).addEventListener("click", listener)
        } else {
            links.item(i).removeEventListener("click", listener)
        }
    }
}

document.addEventListener("DOMContentLoaded", updateClickListeners)
window.addEventListener("resize", updateClickListeners)
