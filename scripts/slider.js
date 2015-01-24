var slider = {
    element : null,
    imageFg : null,
    imageBg : null,
    iframeFg : null,
    iframeBg : null,
    bg : null,
    fg : null,
    albums : null,
    overview : null,
    imageContainer : null,
    spinner : null,
    imgBtns : null,
    bbBtns : null,
    currentAlbum : 0,
    currentImage : 0,
    isAnimating : false,
    isLoading: function() {
        return slider.spinner.style.display == "block";
    },
    showAndHideButtons: function() {
        imgCount = slider.albums[slider.currentAlbum].images.length;
        hiddenButtons = imgCount - slider.visibleButtons();
        if (visibleButtons < imgCount) {
            curImg = slider.currentImage;
            hiddenLeft = (hiddenButtons / 2) | 0;
            if (curImg <= hiddenLeft) hiddenLeft = curImg;
            hiddenRight = hiddenButtons - hiddenLeft;
            if (curImg >= imgCount - hiddenRight) {
                hiddenRight = imgCount - curImg - 1;
                hiddenLeft = hiddenButtons - hiddenRight;
            }
            console.log("Hidden left: " + hiddenLeft + "; Hidden right: " + hiddenRight);
            for (i = 0; i < imgCount; ++i) {
                if (i < hiddenLeft || i >= imgCount - hiddenRight )
                    slider.imgBtns.childNodes[i].style.display = "none";
                else
                    slider.imgBtns.childNodes[i].style.display = "inline-block";
            }
        }
    },
    changeImage: function(i, asc, animate) {
        console.log("ChangeImage: " + animate);
        if (!slider.isAnimating) {
            if (slider.isLoading()) slider.bg.onload = null;
            slider.imgBtns.childNodes[slider.currentImage].className = null;
            slider.imgBtns.childNodes[i].className = "active";
            slider.currentImage = i;
            slider.showAndHideButtons();
            slider.spinner.style.display = "block";
            album = slider.albums[slider.currentAlbum];
            if (slider.isFullscreen() && album.fullImages != null && album.fullImages[i] != null) {
                slider.bg.src = album.fullImages[i];
            }
            else {
                slider.bg.src = album.images[i];
            }
            var onload;
            if (animate) {
                onload = function() {
                    console.log("animate");
                    slider.bg.onload = null;
                    slider.bg.className = asc ? "animate-in-asc" : "animate-in-desc";
                    slider.fg.className = asc ? "animate-out-asc" : "animate-out-desc";
                    slider.isAnimating = true;
                    slider.spinner.style.display = "none";
                }
            } else {
                onload = function() {
                    console.log("dont animate");
                    slider.bg.onload = null;
                    slider.switchImages();
                    slider.spinner.style.display = "none";
                }
            }
            if (slider.bg.complete) onload();
            else slider.bg.onload = onload;
        }
    },
    right: function() {
        count = slider.albums[slider.currentAlbum].images.length;
        if (slider.currentImage + 1 >= count) i = 0;
        else i = slider.currentImage + 1;
        console.log("Count: " + count + "; i: " + slider.currentImage);
        slider.changeImage(i, true, true);
    },
    left: function() {
        count = slider.albums[slider.currentAlbum].images.length;
        if (slider.currentImage <= 0) i = count - 1;
        else i = slider.currentImage - 1;
        console.log("left");
        slider.changeImage(i, false, true);
    },
    switchImages: function() {
        imageTmp = slider.fg;
        slider.fg = slider.bg;
        slider.bg = imageTmp;
        slider.fg.style.zIndex = 10;
        slider.bg.style.zIndex = 0;
        slider.bg.style.opacity = 0;
        slider.fg.style.opacity = 1;
    },
    animationListener: function(e) {
        if (e.target != slider.fg && e.target != slider.bg) {
            console.log("overview!");
            e.target.style.zIndex = -1;
        }
        if (e.target == slider.fg) {
            e.target.src = "";
        }
        e.target.className = "";
        if (slider.fg.className == "" && slider.bg.className == "") {
            console.log("Switch images!");
            slider.switchImages();
            slider.isAnimating = false;
        }
    },
    addEventListener: function(element, type, callback) {
        pfx = ["webkit", "moz", "MS", "o", ""];
        for (var p = 0; p < pfx.length; p++) {
            if (!pfx[p]) type = type.toLowerCase();
            element.addEventListener(pfx[p]+type, callback, false);
        }
    },
    removeEventListener: function(element, type, callback) {
        pfx = ["webkit", "moz", "MS", "o", ""];
        for (var p = 0; p < pfx.length; p++) {
            if (!pfx[p]) type = type.toLowerCase();
            element.removeEventListener(pfx[p]+type, callback, false);
        }
    },
    isFullscreen: function() {
        return document.fullscreenElement || document.mozFullScreenElement ||
            document.webkitFullscreenElement || document.msFullscreenElement;
    },
    toggleFullscreen: function() {
        if (slider.isFullscreen()) {
            (document.exitFullscreen && document.exitFullscreen())
             || (document.mozCancelFullScreen && document.mozCancelFullScreen())
             || (document.webkitExitFullscreen && document.webkitExitFullscreen())
             || (document.msExitFullscreen && document.msExitFullscreen());
        } else {
            (slider.element.requestFullScreen && slider.element.requestFullScreen())
             || (slider.element.mozRequestFullScreen && slider.element.mozRequestFullScreen())
             || (slider.element.msRequestFullScreen && slider.element.msRequestFullScreen())
             || (slider.element.webkitRequestFullScreen && slider.element.webkitRequestFullScreen());
        }
    },
    hideOverview: function() {
        console.log("hideOverview");
        slider.overview.style.display = "none";
        slider.removeEventListener(slider.overview, "TransitionEnd", slider.hideOverview);
    },
    hideContainer: function() {
        console.log("hideContainer");
        slider.imageContainer.style.display = "none";
        slider.removeEventListener(slider.overview, "TransitionEnd", slider.hideContainer);
    },
    visibleButtons: function() {
        btnWidth = parseInt(window.getComputedStyle(slider.bbBtns.firstChild).width);
        return (slider.element.clientWidth / btnWidth - 4) | 0;
    },
    showAlbum: function(album) {
        slider.currentAlbum = album;
        slider.addEventListener(slider.overview, "TransitionEnd", slider.hideOverview);
        slider.overview.style.opacity = 0;
        slider.currentImage = 0;
        if (slider.albums[album].video) {
            console.log("Video!");
            slider.fg = slider.iframeFg;
            slider.bg = slider.iframeBg;
            slider.imageBg.style.display = "none";
            slider.imageFg.style.display = "none";
        } else {
            console.log("Images!");
            slider.fg = slider.imageFg;
            slider.bg = slider.imageBg;
            slider.iframeBg.style.display = "none";
            slider.iframeFg.style.display = "none";
        }
        visibleButtons = slider.visibleButtons();
        while(child = slider.imgBtns.firstChild) { slider.imgBtns.removeChild(child) }
        function fChangeImage(i) {
            return function() {
                slider.changeImage(i, i > slider.currentImage, true);
            };
        }
        for (i = 1; i <= slider.albums[album].images.length; ++i) {
            child = document.createElement("span");
            child.innerHTML = i;
            child.onclick = fChangeImage(i - 1);
            slider.imgBtns.appendChild(child);
            if (i > visibleButtons) child.style.display = "none";
        }
        slider.bg.style.display = "block";
        slider.fg.style.display = "block";
        slider.imageContainer.style.display = "block";
        slider.bbBtns.style.display = "inline-block";
        slider.changeImage(0, true, false);
    },
    showOverview: function() {
        slider.fg.src = "";
        slider.overview.style.display = "block";
        slider.overview.style.opacity = 1;
        slider.bbBtns.style.display = "none";
        slider.hideContainer();
    },
    calcThumbSize: function() {
        if (slider.isFullscreen()) {
            wwidth = window.innerWidth;
            wheight = window.innerHeight;
        } else {
            wwidth = Math.max(window.innerHeight, window.innerWidth);
            wheight = Math.min(window.innerHeight, window.innerWidth);
        }
        height = Math.max(slider.element.clientWidth * (wheight / wwidth), 450);
        slider.element.style.height =  height + "px";
        thumbs = document.getElementsByClassName("thumb");
        // Reset width and height to remove eventual scrollbar
        for (i = 0; i< thumbs.length; ++i) {
            thumbs[i].style.width = 0;
            thumbs[i].style.height = 0;
        }
        style = window.getComputedStyle(thumbs[0]);
        width = ((slider.element.clientWidth -
                    (parseInt(style.marginRight) + parseInt(style.marginLeft)) -
                    (parseInt(style.paddingRight) + parseInt(style.paddingLeft))) | 0) + "px";
        sliderHeight = slider.element.clientHeight - document.getElementById("bottombar").clientHeight;
        height = ((sliderHeight -
                    (parseInt(style.marginTop) + parseInt(style.marginBottom)) -
                    (parseInt(style.paddingTop) + parseInt(style.paddingBottom))) | 0) + "px";
        for (i = 0; i< thumbs.length; ++i) {
            thumbs[i].style.width = width;
            thumbs[i].style.height = height;
        }
    },
    init: function(element, albums) {
        this.albums = albums;
        this.element = element;
        this.element.className += "slider";

        /* Setup images */
        this.imageContainer = document.createElement("div");
        this.imageContainer.id = "imageContainer";
        this.imageFg = document.createElement("img");
        this.addEventListener(this.imageFg, "AnimationEnd", this.animationListener);
        this.imageBg = document.createElement("img");
        this.addEventListener(this.imageBg, "AnimationEnd", this.animationListener);
        this.iframeFg = document.createElement("iframe");
        this.addEventListener(this.iframeFg, "AnimationEnd", this.animationListener);
        this.iframeBg = document.createElement("iframe");
        this.addEventListener(this.iframeBg, "AnimationEnd", this.animationListener);
        this.spinner = document.createElement("div");
        this.spinner.id = "spinner";
        this.imageContainer.appendChild(this.imageBg);
        this.imageContainer.appendChild(this.imageFg);
        this.imageContainer.appendChild(this.iframeBg);
        this.imageContainer.appendChild(this.iframeFg);
        this.imageContainer.appendChild(this.spinner);
        this.bg = this.imageBg;
        this.fg = this.imageFg;

        /* Setup arrows */
        imgRight = document.createElement("div");
        imgRight.id = "right";
        imgRight.innerHTML = "<span>&gt;</span>";
        imgRight.onclick = this.right;
        imgLeft = document.createElement("div");
        imgLeft.id = "left";
        imgLeft.innerHTML = "<span>&lt;</span>";
        imgLeft.onclick = this.left;

        /* Setup bottom bar & buttons */
        bottomBar = document.createElement("div");
        bottomBar.id = "bottombar";
        overviewBtn = document.createElement("span");
        overviewBtn.innerHTML = "&#61450;";
        overviewBtn.id = "overviewBtn";
        overviewBtn.onclick = this.showOverview;
        fullscreenBtn = document.createElement("span");
        fullscreenBtn.innerHTML = "&#61618;";
        fullscreenBtn.id = "fullscreenBtn";
        fullscreenBtn.onclick = this.toggleFullscreen;
        this.bbBtns = document.createElement("div");
        this.bbBtns.id = "bbBtns";
        leftBtn = document.createElement("span");
        leftBtn.innerHTML = "<";
        leftBtn.onclick = this.left;
        this.imgBtns = document.createElement("div");
        rightBtn = document.createElement("span");
        rightBtn.innerHTML = ">";
        rightBtn.onclick = this.right;
        this.bbBtns.appendChild(leftBtn);
        this.bbBtns.appendChild(this.imgBtns);
        this.bbBtns.appendChild(rightBtn);
        bottomBar.appendChild(overviewBtn);
        bottomBar.appendChild(this.bbBtns);
        bottomBar.appendChild(fullscreenBtn);

        /* Setup thumbnail page */
        showAlbum = function (i) {
            return function() { slider.showAlbum(i); };
        }
        this.overview = document.createElement("div");
        this.overview.id = "overview";

        this.element.appendChild(this.imageContainer);
        this.element.appendChild(imgRight);
        this.element.appendChild(imgLeft);
        this.element.appendChild(bottomBar);
        this.element.appendChild(this.overview);

        for (i = 0; i < albums.length; ++i) {
            album = albums[i]
            thumbImg = document.createElement("img");
            if (album.thumb != null) thumbImg.src = album.thumb;
            else thumbImg.src = album.images[0];
            thumbDesc = document.createElement("p");
            thumbDesc.innerHTML = album.name;
            thumb = document.createElement("div");
            thumb.className = "thumb";
            thumb.appendChild(thumbImg);
            thumb.appendChild(thumbDesc);
            thumb.onclick = showAlbum(i);
            this.overview.appendChild(thumb);
        }
        this.calcThumbSize();
        window.onresize = this.calcThumbSize;
        console.log("slider initialized");
    }
}
