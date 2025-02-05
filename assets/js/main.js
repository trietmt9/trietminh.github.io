const navMenu = document.getElementById("nav-menu"), 
      navToggle = document.getElementById("nav-toggle"),
      navClose = document.getElementById("nav-close")
// =================== SHOW MENU ===================
/* validate if constant exists */
if(navToggle)
{
    navToggle.addEventListener('click', () => {
        navMenu.classList.add("show-menu");
    })
}
// =================== MENU HIDE ===================
/* validate if constant exists */
if(navClose)
    {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove("show-menu");
        })
    }

// =================== REMOVE MENU MOBILE ===================
const navLinks = document.querySelectorAll(".nav-link");

function linkAction()
{
    //click on nav link remove nav menu
    const navMenu = document.getElementById("nav-menu");
    navMenu.classList.remove("show-menu");
}
navLinks.forEach(n=>n.addEventListener('click', linkAction));

// =================== CHANGE BACKGROUND HEADER ===================
function scrollHeader()
{
    const header = document.getElementById("header");
    if(this.scrollY >= 80) header.classList.add("scroll-header"); else header.classList.remove("scroll-header");
}
window.addEventListener("scroll", scrollHeader);

// =================== CERTIFICATE FILTER ===================
const filterContainer = document.querySelector(".certificates-fitler-inner"),
      filtersBtns = filterContainer.children,
      totalFilterBtns = filtersBtns.length,
      certificateItems = document.querySelectorAll(".certificates-item"),
      totalCertificateItems = certificateItems.length;

      for(let i=0; i<totalFilterBtns; i++)
      {
        filtersBtns[i].addEventListener("click", function() 
        {
            filterContainer.querySelector(".active").classList.remove("active");
            this.classList.add("active");

            const filterValue = this.getAttribute("data-filter");
            
            for(let k = 0; k < totalCertificateItems; k++)
            {
                if(filterValue === certificateItems[k].getAttribute("data-category"))
                {
                    certificateItems[k].classList.remove("hide");
                    certificateItems[k].classList.add("show");   
                }
                else
                {
                    certificateItems[k].classList.remove("show");
                    certificateItems[k].classList.add("hide");
                }
                if(filterValue ==="all")
                {
                    certificateItems[k].classList.remove("hide");
                    certificateItems[k].classList.add("show");
                }
            }
            });   
      }

// =================== THEME/DISPLAY CUSTOMIZATION ===================
const theme = document.querySelector("#theme-button");
const themeModal = document.querySelector(".custom-theme");
const fontSizes = document.querySelectorAll('.choose-size span');
const colorPalette = document.querySelectorAll('.choose-color span');
var root = document.querySelector(":root");
const Bg1 = document.querySelector(".bg-1");
const Bg2 = document.querySelector(".bg-2");
const Bg3 = document.querySelector(".bg-3");
// Close modal 

const closeThemeModal = (e) => {
    if(e.target.classList.contains("custom-theme"))
    {
        themeModal.style.display = 'none';
    }
}

// Open modal 
const openThemeModal = () => {

    themeModal.style.display = 'grid';
} 

theme.addEventListener("click", openThemeModal);
themeModal.addEventListener("click", closeThemeModal);

// =================== CUSTOMZIE FONT ===================
const removeSizeSelector = () => {
    fontSizes.forEach(size =>  {
        size.classList.remove('active')
    });
}
fontSizes.forEach(size => {
    size.addEventListener('click', () => {
        removeSizeSelector();
        let fontSize;
        size.classList.toggle('active'); 
        if(size.classList.contains("font-size-1"))
        {
            fontSize = '12px';
        }
        else if(size.classList.contains("font-size-2"))
        {
            fontSize = '14px';
        }
        else if(size.classList.contains("font-size-3"))
        {
            fontSize = '16px';
        }
        else if(size.classList.contains("font-size-4"))
        {
            fontSize = '18px';

        } 
        document.querySelector('html').style.fontSize = fontSize;
    })
})
// =================== PRIMARY COLOR ===================
const changeActiveColorClass = () => {
    colorPalette.forEach(colorPicker =>  {
        colorPicker.classList.remove('active')
    });
} 
colorPalette.forEach(color => {
    color.addEventListener('click', () => {
        let primaryHue; 
        changeActiveColorClass();
        if(color.classList.contains('color-1'))
        {
            primaryHue = 252;
        }
        else if(color.classList.contains('color-2'))
        {
            primaryHue = 52;
        }
        else if(color.classList.contains('color-3'))
        {
            primaryHue = 352;
        }
        else if(color.classList.contains('color-4'))
        {
            primaryHue = 152;
        }
        else if(color.classList.contains('color-5'))
        {
            primaryHue = 202;
        }
        color.classList.add("active");
        root.style.setProperty('--primary-color-hue', primaryHue);
    })
})
// =================== THEME BACKGROUND ===================
let lightColorLightness; 
let whiteColorLightness;
let darkColorLightness;

const changeBG = () => {
    root.style.setProperty('--dark-color-lightness', darkColorLightness);
    root.style.setProperty('--white-color-lightness', whiteColorLightness);
    root.style.setProperty('--light-color-lightness', lightColorLightness);
}
Bg1.addEventListener('click', () =>{
    darkColorLightness = '0%';
    whiteColorLightness = '95%';
    lightColorLightness = '95%';

    Bg1.classList.add('active');

    Bg2.classList.remove('active');
    Bg3.classList.remove('active');
    changeBG();

})

Bg2.addEventListener('click', () =>{
    darkColorLightness = '95%';
    whiteColorLightness = '20%';
    lightColorLightness = '15%';

    Bg2.classList.add('active');

    Bg1.classList.remove('active');
    Bg3.classList.remove('active');

    changeBG();
})

Bg3.addEventListener('click', () =>{
    darkColorLightness = '95%';
    whiteColorLightness = '10%';
    lightColorLightness = '0%';

    Bg3.classList.add('active');

    Bg2.classList.remove('active');
    Bg1.classList.remove('active');

    changeBG();
})

// =================== MENU SHOW ===================


var swiper = new Swiper(".testimonial-wrapper", {
    spaceBetween: 30,
    loop: 'true',

    pagination:
    {
        el: ".swiper-pagination",
        clickable: true,
    },
});

const sections = document.querySelectorAll("section[id]");


window.addEventListener("scroll", navHighlighter);

function navHighlighter() 
{
    let scrollY = window.pageYOffset;
    sections.forEach(current => 
    {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 50,
        sectionId = current.getAttribute("id");
        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight)
        {
            document.querySelector(".nav-menu a[href*=" + sectionId + "]").classList.add("active-link");
        }
        else 
        {
            document.querySelector(".nav-menu a[href*=" + sectionId + "]").classList.remove("active-link");
        }
    })
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("sendEmailButton").addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default anchor behavior

        // Get user input values
        let email = "minhtrietwork@gmail.com"; // Your email address
        let userEmail = document.getElementById("emailInput").value.trim();
        let subject = encodeURIComponent(document.getElementById("subjectInput").value.trim());
        let message = encodeURIComponent(document.getElementById("messageInput").value.trim());

        // Check if all fields are filled
        if (!userEmail || !subject || !message) {
            alert("Please fill in all fields before sending.");
            return;
        }

        // Construct the mailto URL (include user email in the message)
        let mailtoLink = `mailto:${email}?subject=${subject}&body=From: ${userEmail}%0A%0A${message}`;

        // Open the mail client
        window.location.href = mailtoLink;
    });
});