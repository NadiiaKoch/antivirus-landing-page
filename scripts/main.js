"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const apiUrl = "https://veryfast.io/t/front_test_api.php";
  const loader = document.getElementById("loader");
  const productsContainer = document.getElementById("products");

  loader.classList.remove("hidden");

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      loader.classList.add("hidden");

      data.result.elements.forEach((product) => {
        const productElement = createProductCard(product);
        productsContainer.appendChild(productElement);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      loader.classList.add("hidden");
    });
});

function createProductCard(product) {
  const isMonthly = product.license_name.toLowerCase().includes("monthly");
  const priceText = isMonthly ? "/mo" : "/per year";
  const isDiscounted = product.price_key === "50%";

  const productElement = document.createElement("div");
  productElement.className = "card";

  productElement.innerHTML = `
    <div class="card__price-wrapper">
      ${
        product.is_best
          ? '<div class="card__price-discount">Best Value</div>'
          : ""
      }
      ${
        isDiscounted
          ? '<img class="card__price-percent" src="./assets/50OFF.svg" alt="50% OFF">'
          : ""
      }
      <div class="card__price">$${
        product.amount
      }<span class="card__price-period">${priceText}</span>
      </div>
      ${isDiscounted ? `<div class="card__price-old">$9.99</div>` : ""}
    </div>
    <div class="card__description">
      <div class="card__description-name">${product.name_prod}</div>
      <div class="card__description-license">${product.license_name}</div>
      <button class="card__description-button">Download
        <img src="./assets/download.svg" alt="Download"/>
      </button>
    </div>
  `;

  const button = productElement.querySelector(".card__description-button");
  button.onclick = () => handleDownload(product.link);

  return productElement;
}

function handleDownload(link) {
  window.location.href = link;

  setTimeout(() => showDownloadArrow(), 1500);
}

function detectBrowser() {
  const userAgent = navigator.userAgent;
  const isChrome =
    /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor);
  const isFirefox = /Firefox/.test(userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
  const isEdge = /Edg/.test(userAgent);

  return { isChrome, isFirefox, isSafari, isEdge };
}

function showDownloadArrow() {
  const arrowElement = document.createElement("img");

  const { isChrome, isFirefox, isSafari, isEdge } = detectBrowser();

  if (isChrome || isEdge || isSafari) {
    arrowElement.src = "./assets/down.svg";
    arrowElement.style.bottom = "70px";
    arrowElement.style.left = "5px";
  } else if (isFirefox) {
    arrowElement.src = "./assets/up.svg";
    arrowElement.style.top = "55px";
    arrowElement.style.right = "5px";
  } else {
    arrowElement.src = "./assets/down.svg";
    arrowElement.style.bottom = "70px";
    arrowElement.style.left = "5px";
  }

  arrowElement.className = "download-arrow bounce";
  document.body.appendChild(arrowElement);

  setTimeout(() => arrowElement.classList.add("show-arrow"), 10);
  setTimeout(() => arrowElement.classList.add("hide-arrow"), 5000);
  setTimeout(() => arrowElement.remove(), 6500);
}
