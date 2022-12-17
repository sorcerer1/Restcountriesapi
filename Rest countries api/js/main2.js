async function getAllCountries() {
  try {
    createLoadingHTML();
    showLoadingHTML();

    const req = await fetch("https://restcountries.com/v3.1/all");

    const res = await req.json();

    if (!req.ok) {
      removeLoadingHTML();
      createHTTPErrorHTML(req);
      showHTTPErrorHTML();
      refreshPage();
      return;
    }

    removeLoadingHTML();

    res.forEach((country) => createCountryCardHTML(country));

    viewCountryInfo();
    searchCountry();
    filterByRegion();
  } catch (e) {
    removeLoadingHTML();
    createHTTPErrorHTML(null, "Something went wrong!", e.message);
    showHTTPErrorHTML();
    refreshPage();
  }
}

function refreshPage() {
  const retry = document.querySelector(".fetch-error__retry-btn");

  retry.addEventListener("click", () => location.reload());
}

function showHTTPErrorHTML() {
  const errorContainer = document.querySelector(".fetch-error");

  if (errorContainer.classList.contains("hide")) {
    errorContainer.classList.remove("hide");
  }
}

function removeLoadingHTML() {
  const loadingDiv = document.querySelector(".index-main__loading-countries");

  if (!loadingDiv.classList.contains("hide")) {
    loadingDiv.classList.add("hide");
  }
}

function showLoadingHTML() {
  const loadingDiv = document.querySelector(".index-main__loading-countries");

  if (loadingDiv.classList.contains("hide")) {
    loadingDiv.classList.remove("hide");
  }
}

function createHTTPErrorHTML(request = null, status = null, msg = null) {
  const errorContainer = document.querySelector(".fetch-error");

  // Create error status code element
  const errorStatus = document.createElement("h2");
  errorStatus.className = "fetch-error__status";
  errorStatus.innerText = request ? request.status : status;

  // Create error message
  const errorMsg = document.createElement("p");
  errorMsg.className = "fetch-error__msg";
  errorMsg.innerText = request ? request.statusText : msg;

  // Create retry button
  const retryBtn = document.createElement("button");
  retryBtn.className = "fetch-error__retry-btn";
  retryBtn.setAttribute("type", "button");
  retryBtn.innerText = "Try Again";

  // Append to main div
  errorContainer.appendChild(errorStatus);
  errorContainer.appendChild(errorMsg);
  errorContainer.appendChild(retryBtn);
}

function createLoadingHTML() {
  const mainDiv = document.querySelector(".index-main__loading-countries");

  const loadingMsg = document.createElement("h2");
  loadingMsg.className = "index-main__loading-countries-msg";
  loadingMsg.innerHTML = `<i class="bx bx-loader-circle bx-fw bx-spin"></i> Getting all the
              countries, Please wait...`;

  mainDiv.appendChild(loadingMsg);
}

function createCountryCardHTML(country) {
  // Main container for all the country cards
  const countries = document.querySelector(".index-main__countries-container");

  // The main div container
  const parentDiv = document.createElement("div");
  parentDiv.className = "index-main__country-card";
  parentDiv.setAttribute("data-country", country.name.common);
  parentDiv.setAttribute("data-region", country.region);

  // The div for the flag
  const flagDiv = document.createElement("div");
  flagDiv.className = "index-main__country-flag";

  // Img element for the flag
  const imgFlag = document.createElement("img");
  imgFlag.className = "index-main__country-flag-img";
  imgFlag.setAttribute("src", country.flags.svg);
  imgFlag.setAttribute("alt", `Flag of ${country.name.common}`);

  // Append the img element to the flag div
  flagDiv.appendChild(imgFlag);

  // The div for the information
  const infoDiv = document.createElement("div");
  infoDiv.className = "index-main__country-info";

  // The country name h2 element
  const nameHeader = document.createElement("h2");
  nameHeader.className = "index-main__country-name bolder-text";
  nameHeader.innerText = country.name.common;

  // The pop p element
  const populationElement = document.createElement("p");
  populationElement.className = "index-main__country-population bold-text";
  const population = formatNumber(country.population);
  populationElement.innerHTML = `Population: <span class="regular-text">${population}</span>`;

  // The region p element
  const regionElement = document.createElement("p");
  regionElement.className = "index-main__country-region bold-text";
  regionElement.innerHTML = `Region: <span class="regular-text">${country.region}</span>`;

  // The capital p element
  const capitalElement = document.createElement("p");
  capitalElement.className = "index-main__country-capital bold-text";
  capitalElement.innerHTML = `Capital: <span class="regular-text">${country.capital}</span>`;

  // Append the country info to the info div
  infoDiv.appendChild(nameHeader);
  infoDiv.appendChild(populationElement);
  infoDiv.appendChild(regionElement);
  infoDiv.appendChild(capitalElement);

  // Append the div info to the parent div
  parentDiv.appendChild(flagDiv);
  parentDiv.appendChild(infoDiv);

  // Append all the divs to the main div container
  countries.appendChild(parentDiv);
}

function formatNumber(number) {
  return number.toLocaleString();
}

function toggleDropdown() {
  const toggleBtn = document.getElementById("dropdown-btn");
  const icon = document.querySelector(".index-main__filter-button-icon");
  const dropdownList = document.getElementById("dropdown");

  toggleBtn.addEventListener("click", () => {
    if (!icon.classList.contains("rotate")) {
      icon.classList.add("rotate");
      dropdownList.classList.remove("hide");
    } else {
      icon.classList.remove("rotate");
      dropdownList.classList.add("hide");
    }
  });
}

function viewCountryInfo() {
  const countries = document.querySelectorAll(".index-main__country-card");

  countries.forEach((country) => {
    country.addEventListener("click", () => {
      const selectedCountry = country.getAttribute("data-country");
      sessionStorage.setItem("country", selectedCountry);
      location.href = "country.html";
    });
  });
}

function toggleMobileMenu() {
  const close = document.getElementById("close-menu");
  const open = document.getElementById("open-menu");
  const menuBar = document.querySelector(".header__nav-menu-toggle");

  open.addEventListener("click", () => (menuBar.style.right = "0"));

  close.addEventListener("click", () => (menuBar.style.right = "-100%"));
}

function searchCountry() {
  const find = document.querySelector(".index-main__search-input");
  const countries = document.querySelectorAll(".index-main__country-card ");

  [...countries].forEach((country) => {
    find.addEventListener("keyup", () => {
      if (
        country
          .getAttribute("data-country")
          .toLowerCase()
          .indexOf(find.value.toLowerCase()) !== -1
      ) {
        country.classList.remove("d-none");
      } else {
        country.classList.add("d-none");
      }
    });
  });
}

function filterByRegion() {
  const countries = document.querySelectorAll(".index-main__country-card ");
  const regions = document.querySelectorAll(".index-main__dropdown-list-item");

  [...regions].forEach((region) => {
    region.addEventListener("click", () => {
      [...countries].forEach((country) => {
        if (region.innerText === "None") {
          country.classList.remove("d-none");
          return;
        }

        if (region.innerText !== country.getAttribute("data-region")) {
          country.classList.add("d-none");
        } else {
          country.classList.remove("d-none");
        }
      });
    });
  });
}

function mode() {
  const modeTogglers = document.querySelectorAll(".mode");

  const darkColors = {
    bg: "hsl(207, 26%, 17%)",
    txt: "hsl(0, 0%, 100%)",
    elements: "hsl(209, 23%, 22%)",
  };

  const lightColors = {
    bg: "hsl(0, 0%, 98%)",
    txt: "hsl(200, 15%, 8%)",
    elements: "hsl(0, 0%, 100%)",
  };

  modeTogglers.forEach((modeToggler) => {
    modeToggler.addEventListener("click", () => {
      const mode = modeToggler.getAttribute("data-mode");
      if (mode === "light") {
        const { bg, txt, elements } = darkColors;
        document.documentElement.style.setProperty("--bg-color-light", bg);
        document.documentElement.style.setProperty("--txt-light", txt);
        document.documentElement.style.setProperty(
          "--light-elements",
          elements
        );

        modeToggler.setAttribute("data-mode", "dark");
        modeToggler.innerHTML = '<i class="bx bx-sun bx-fw"></i> Light Mode';
        sessionStorage.setItem("theme", "dark");
      } else {
        const { bg, txt, elements } = lightColors;
        document.documentElement.style.setProperty("--bg-color-light", bg);
        document.documentElement.style.setProperty("--txt-light", txt);
        document.documentElement.style.setProperty(
          "--light-elements",
          elements
        );

        modeToggler.setAttribute("data-mode", "light");
        modeToggler.innerHTML = '<i class="bx bx-moon bx-fw"></i> Dark Mode';
        sessionStorage.setItem("theme", "light");
      }
      setTheme();
    });
  });
}

function setTheme() {
  const theme = sessionStorage.getItem("theme");
  const modeTogglers = document.querySelectorAll(".mode");

  const darkColors = {
    bg: "hsl(207, 26%, 17%)",
    txt: "hsl(0, 0%, 100%)",
    elements: "hsl(209, 23%, 22%)",
  };

  const lightColors = {
    bg: "hsl(0, 0%, 98%)",
    txt: "hsl(200, 15%, 8%)",
    elements: "hsl(0, 0%, 100%)",
  };

  modeTogglers.forEach((modeToggler) => {
    if (theme === "light" || theme === null) {
      modeToggler.setAttribute("data-mode", "light");
      modeToggler.innerHTML = '<i class="bx bx-moon bx-fw"></i> Dark Mode';
    } else {
      modeToggler.setAttribute("data-mode", "dark");
      modeToggler.innerHTML = '<i class="bx bx-sun bx-fw"></i> Light Mode';
    }
  });

  if (theme === "light" || theme === null) {
    const { bg, txt, elements } = lightColors;
    document.documentElement.style.setProperty("--bg-color-light", bg);
    document.documentElement.style.setProperty("--txt-light", txt);
    document.documentElement.style.setProperty("--light-elements", elements);
  } else {
    const { bg, txt, elements } = darkColors;
    document.documentElement.style.setProperty("--bg-color-light", bg);
    document.documentElement.style.setProperty("--txt-light", txt);
    document.documentElement.style.setProperty("--light-elements", elements);
  }
}

function hideMenuInLargeScreens() {
  window.addEventListener("resize", () => {
    const width = window.innerWidth;
    if (width > 768) {
      const menuBar = document.querySelector(".header__nav-menu-toggle");
      menuBar.style.right = "-100%";
    }
  });
}

function main() {
  window.addEventListener("load", getAllCountries());
  toggleDropdown();
  toggleMobileMenu();
  mode();
  setTheme();
  hideMenuInLargeScreens();
}

// Main function
main();