/* ================================================
    DEFINE VARIABLES ONCE (Gobal Selectors to avoid re-querying) 
  ================================================= */
const header = document.querySelector("header");
const navLinks = document.querySelectorAll("header nav a");
const sections = document.querySelectorAll("section");
const menuIcon = document.querySelector("#menu-icon");
const navbar = document.querySelector("header nav");

/* ================================================
   1. NAVIGATION & SCROLL LOGIC 
  ================================================= */

// TOGGLE MENU
menuIcon.addEventListener("click", () => {
  menuIcon.classList.toggle("bx-x");
  navbar.classList.toggle("active");
});

// SCROLL SPY & STICKY HEADER
window.onscroll = () => {
  // 1. Highlight Active Section
  sections.forEach((sec) => {
    let top = window.scrollY;
    let offset = sec.offsetTop - 150;
    let height = sec.offsetHeight;
    let id = sec.getAttribute("id");

    if (top >= offset && top < offset + height) {
      navLinks.forEach((links) => {
        links.classList.remove("active");
        // Efficiently select the active link
        let activeLink = document.querySelector(`header nav a[href="#{id}"]`);
        if (activeLink) activeLink.classList.add("active");
      });
    }
  });

  // 2. Sticky Header (Optimized: 'header' is now cached at the top)
  header.classList.toggle("sticky", window.scrollY > 100);

  // 3. CLOSE MENU ON SCROLL (UX Improvement)
  if (navbar.classList.contains("active")) {
    menuIcon.classList.remove("bx-x");
    navbar.classList.remove("active");
  }
};

/* ================================================
   2. RESUME TABS LOGIC 
  ================================================= */
const resumeBtns = document.querySelectorAll(".resume-btn");
const resumeDetails = document.querySelectorAll(".resume-detail");

resumeBtns.forEach((btn, idx) => {
  btn.addEventListener("click", () => {
    // Remove active class from all
    resumeBtns.forEach((b) => {
      b.classList.remove("active");
    });
    resumeDetails.forEach((d) => d.classList.remove("active"));

    // Add active class to current
    btn.classList.add("active");

    // Safety Check: Ensure the detail section exists before accessing it
    if (resumeDetails[idx]) {
      resumeDetails[idx].classList.add("active");
    }
  });
});

/* ================================================
   3. PROJECT CAROUSEL LOGIC (AUTO-PLAY)
  =============================================== */
const projectDetails = document.querySelectorAll(".project-detail");
const imgSlide = document.querySelector(".project-carousel .img-slide");

let index = 0;
let totalProjectItems = projectDetails.length;

const activeProject = () => {
  // Move the Image Slide exactly by 100% chuncks (since we removed the gap in CSS)
  imgSlide.style.transform = `translateX(-${index * 100}%)`;

  // Update Text Details
  projectDetails.forEach((detail) => {
    detail.classList.remove("active");
  });
  if (projectDetails[index]) {
    projectDetails[index].classList.add("active");
  }
};

// Auto-play timer: Changes project every 30 seconds (30000ms)
setInterval(() => {
  index++;

  // Loop back to the first project when reaching the end
  if (index >= totalProjectItems) {
    index = 0;
  }

  activeProject();
}, 30000);

/* =========================================
   4. SERVICES HOVER EFFECT (Glassmorphism)
   ========================================= */
const serviceBoxes = document.querySelectorAll(".services-box");

serviceBoxes.forEach((box) => {
  box.onmousemove = function (e) {
    let x = e.pageX - box.offsetLeft;
    let y = e.pageY - box.offsetTop;

    // Use CSS Variables for cleaner code if possible, but this works for dynamic light
    box.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(124, 240, 61, 0.15), var(--second-bg-color))`;
  };

  box.onmouseleave = function () {
    box.style.background = "";
  };
});

/* ======================================== 
  5. CONTACT FORM & TOAST NOTIFICATION 
  ========================================= */
const scriptURL =
  "https://script.google.com/macros/s/AKfycbyCe3KZUJDbTKStAOrKJccEV4YEQVeR9izuD_39ARJvRsaU007BnwMBJHBVJ-SIwJNg/exec";
const form = document.forms["submit-to-google-sheet"];

// Global timeout variable to prevent overlapping toasts
let toastTimeout;

function launchToast(message, isError = false) {
  const toast = document.getElementById("toast");
  const desc = document.getElementById("desc");
  const imgIcon = document.querySelector("#toast #img i");

  // 1. Set Message
  desc.innerText = message;

  // 2. Handle Success/Error Styling
  if (isError) {
    toast.style.borderLeft = "5px solid red";
    imgIcon.className = "bx bxs-error-circle";
    imgIcon.style.color = "red";
  } else {
    toast.style.borderLeft = "5px solid #61b752";
    imgIcon.className = "bx bxs-check-circle";
    imgIcon.style.color = "#61b752";
  }

  // 3. Show Toast (Clear previous timer first!)
  clearTimeout(toastTimeout);
  toast.className = "show";

  // 4. Hide after 5 seconds
  toastTimeout = setTimeout(function () {
    toast.className = toast.className.replace("show", "");
  }, 5000);
}

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector("button");
    const originalText = submitBtn.innerText;

    // Loading State
    submitBtn.innerHTML = "Sending...";
    submitBtn.disabled = true;

    fetch(scriptURL, { method: "POST", body: new FormData(form) })
      .then((response) => {
        launchToast("Message sent successfully! ✅");
        form.reset();
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
      })
      .catch((error) => {
        console.error("Error!", error.message);
        launchToast("Error! Please check internet.", true);
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
      });
  });
}
