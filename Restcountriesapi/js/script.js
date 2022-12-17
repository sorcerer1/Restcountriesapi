async function getSpecificCountry() {
    try {
      const country = sessionStorage.getItem("country");
  
      if (!country) {
        history.back();
        return;
      }
  
      createLoadingHTML("flag", "Stitching the flag...");
      createLoadingHTML("details", "Writing the details...");
  
      showLoadingHTML("flag");
      showLoadingHTML("details");
  
      const req = await fetch(
        `https://restcountries.com/v3.1/name/${country}?fullText=true`
      );
  
      if (!req.ok) {
        console.error(`${req.status}: ${req.statusText}`);
        return;
      }
  
      const res = await req.json();
  
      res.forEach((data) => {
        createFlagContainerHTML(data.flags.svg, data);
        createDetailsContainerHTML(data);
        getBorderCountries(data.borders);
      });
    } catch (e) {
      if (e instanceof TypeError) {
        console.error(e);
      }
    }
  }
  
  function visitBorderCountry() {
    const borders = document.querySelectorAll(
      ".country-details__border-country-btn"
    );
  
    borders.forEach((border) => {
      border.addEventListener("click", () => {
        sessionStorage.setItem("country", border.innerText);
        location.reload();
      });
    });
  }
  
  function loadingBordersHTML(div, msg, icon = "") {
    const loading = document.createElement("p");
    loading.id = "loading";
    loading.innerHTML = `${icon} ${msg}`;
    div.appendChild(loading);
  }
  
  function createBordersHTML(borders) {
    const secondChildDiv = document.querySelector(
      ".country-details__border-countries"
    );
  
    if (borders === undefined) {
      loadingBordersHTML(secondChildDiv, "None");
      return;
    }
  
    const loader = document.getElementById("loading");
    loader.remove();
  
    borders.forEach((border) => {
      const borders = document.createElement("button");
      borders.className = "country-details__border-country-btn";
      borders.innerText = border;
      secondChildDiv.appendChild(borders);
    });
  
    visitBorderCountry();
  }
  
  function getBorderCountries(countries) {
    if (countries === undefined) {
      createBordersHTML(countries);
      return;
    }
    let bordersArray = [];
    let count = 0;
    countries.forEach(async (code) => {
      const req = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
      const res = await req.json();
  
      res.forEach((country) => {
        const borderCountry = country.name.common;
        bordersArray.push(borderCountry);
        count++;
      });
  
      if (count === countries.length) {
        createBordersHTML(bordersArray);
      }
    });
  }
  
  function getNativeName(obj) {
    const index = obj.length - 1;
  
    return obj[index].common;
  }
  
  function showLoadingHTML(type) {
    const mainDiv = document.querySelector(`.country-details__loading.${type}`);
  
    if (mainDiv.classList.contains("hide")) {
      mainDiv.classList.remove("hide");
    }
  }
  
  function formatNumber(number) {
    return number.toLocaleString();
  }
  
  function removeLoadingHTML(type) {
    const mainDiv = document.querySelector(`.country-details__loading.${type}`);
  
    if (!mainDiv.classList.contains("hide")) {
      mainDiv.classList.add("hide");
    }
  }
  
  function createLoadingHTML(type, msg) {
    const mainDiv = document.querySelector(`.country-details__loading.${type}`);
  
    const loadingMsg = document.createElement("h2");
    loadingMsg.className = "country-details__loading-msg";
    loadingMsg.innerHTML = `<i class="bx bx-loader-circle bx-fw bx-spin"></i> ${msg}`;
  
    mainDiv.appendChild(loadingMsg);
  }
  
  function createFlagContainerHTML(flagURL, country) {
    const flagContainer = document.querySelector(".country-details__flag");
  
    const flagImg = document.createElement("img");
    flagImg.setAttribute("src", flagURL);
    flagImg.setAttribute("alt", `Flag of ${country}`);
    flagImg.className = "country-details__flag-img";
    flagContainer.appendChild(flagImg);
  
    removeLoadingHTML("flag");
  }
  
  function createDetailsContainerHTML(country) {
    const parentDiv = document.querySelector(".country-details__text");
  
    const countryName = document.createElement("h1");
    countryName.className = "country-details__country-name bolder-text";
    countryName.innerText = country.name.common;
    parentDiv.appendChild(countryName);
  
    const firstChildDiv = document.createElement("div");
    firstChildDiv.className = "country-details__country-info";
  
    const leftDiv = document.createElement("div");
    leftDiv.className = "country-details__country-info-left";
  
    const leftNative = document.createElement("p");
    leftNative.className = "native-name bold-text";
  
    if (country.name.nativeName !== undefined) {
      leftNative.innerHTML = `Native Name: <span class="regular-text">${getNativeName(
        Object.values(country.name.nativeName)
      )}</span>`;
    } else {
      leftNative.innerHTML = `Native Name: <span class="regular-text">None</span>`;
    }
    leftDiv.appendChild(leftNative);
  
    const leftPop = document.createElement("p");
    leftPop.className = "population bold-text";
    leftPop.innerHTML = `Population: <span class="regular-text">${formatNumber(
      country.population
    )}</span>`;
    leftDiv.appendChild(leftPop);
  
    const leftRegion = document.createElement("p");
    leftRegion.className = "region bold-text";
    leftRegion.innerHTML = `Region: <span class="regular-text">${country.region}</span>`;
    leftDiv.appendChild(leftRegion);
  
    const leftSubRegion = document.createElement("p");
    leftSubRegion.className = "sub-region bold-text";
    leftSubRegion.innerHTML = `Sub Region: <span class="regular-text">${country.subregion}</span>`;
    leftDiv.appendChild(leftSubRegion);
  
    const leftCapital = document.createElement("p");
    leftCapital.className = "capital bold-text";
    leftCapital.innerHTML = `Capital: <span class="regular-text">${country.capital}</span>`;
    leftDiv.appendChild(leftCapital);
  
    firstChildDiv.appendChild(leftDiv);
  
    const rightDiv = document.createElement("div");
    rightDiv.className = "country-details__country-info-right";
  
    const rightDomain = document.createElement("p");
    rightDomain.className = "domain-level bold-text";
    rightDomain.innerHTML = `Top Level Domain: <span class="regular-text">${country.tld}</span>`;
    rightDiv.appendChild(rightDomain);
  
    const rightCurrency = document.createElement("p");
    rightCurrency.className = "currency bold-text";
  
    if (country.currencies !== undefined) {
      rightCurrency.innerHTML = `Currencies: <span class="regular-text">${
        Object.values(country.currencies)[0].name
      }</span>`;
    } else {
      rightCurrency.innerHTML = `Currencies: <span class="regular-text">None</span>`;
    }
    rightDiv.appendChild(rightCurrency);
  
    const rightLanguages = document.createElement("p");
    rightLanguages.className = "languages bold-text";
    if (country.languages !== undefined) {
      rightLanguages.innerHTML = `Languages: <span class="regular-text">${Object.values(
        country.languages
      )}</span>`;
    } else {
      rightLanguages.innerHTML = `Languages: <span class="regular-text">None</span>`;
    }
    rightDiv.appendChild(rightLanguages);
  
    firstChildDiv.appendChild(rightDiv);
  
    const secondChildDiv = document.createElement("div");
    secondChildDiv.className = "country-details__border-countries";
  
    const description = document.createElement("p");
    description.className = "country-details__description bold-text";
    description.innerText = "Border Countries:";
    secondChildDiv.appendChild(description);
  
    if (country.borders !== undefined) {
      loadingBordersHTML(
        secondChildDiv,
        "Finding borders...",
        '<i class="bx bx-loader-circle bx-fw bx-spin"></i>'
      );
    }
  
    parentDiv.appendChild(firstChildDiv);
    parentDiv.appendChild(secondChildDiv);
  
    removeLoadingHTML("details");
  }
  
  function goBack() {
    const back = document.querySelector(".country-main__back-btn");
    // const prevURL = document.referrer;
    back.addEventListener("click", () => history.back());
  }
  
  function toggleMobileMenu() {
    const close = document.getElementById("close-menu");
    const open = document.getElementById("open-menu");
    const menuBar = document.querySelector(".header__nav-menu-toggle");
  
    open.addEventListener("click", () => (menuBar.style.right = "0"));
  
    close.addEventListener("click", () => (menuBar.style.right = "-100%"));
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
    window.addEventListener("load", getSpecificCountry());
    toggleMobileMenu();
    goBack();
    mode();
    setTheme();
    hideMenuInLargeScreens();
  }
  
  // Main function
  main();