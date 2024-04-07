let slideIndex = 1;
showSlides(slideIndex);

let slideInterval = setInterval(autoShowSlides, 5000);

function plusSlides(n) {
    clearInterval(slideInterval);
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    clearInterval(slideInterval);
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("img_carusel_cont");
    let dots = document.getElementsByClassName("dot");

    if (slides && dots) {
        if (n > slides.length) { slideIndex = 1 };
        if (n < 1) { slideIndex = slides.length };

        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }

        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }

        slides[slideIndex - 1].style.display = "block";
        dots[slideIndex - 1].className += " active";
    }
}

function autoShowSlides() {
    plusSlides(1);
    slideInterval = setInterval(autoShowSlides, 5000); // Reiniciar el intervalo después de avanzar a la siguiente diapositiva

}

const carrusel = document.querySelector(".btnRightCarusel");
if (carrusel) {
    carrusel.addEventListener('click', function () {
        autoShowSlides();
    });
}