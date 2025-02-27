// Global variables
let allProducts = [];      // Will store all products from API
let filteredProducts = []; // Will store filtered products based on search/filter
const API_URL = "https://fakestoreapi.com/products";

// DOM Elements
const container = document.getElementById("container");
const searchBar = document.getElementById("searchBar");
const categoryFilter = document.getElementById("category");
const errorMessage = document.getElementById("errorMessage");
const loadingSpinner = document.getElementById("loading");
const sortButtons = document.querySelectorAll("button[value]");

// Wait for the page to fully load before running the code
document.addEventListener("DOMContentLoaded", () => {
  // Show loading spinner
  loadingSpinner.innerHTML = '<div class="spinner"></div>';

  // Fetch products from the API
  fetchProducts();

  // Set up event listeners
  setupEventListeners();
});

// Fetch products from API
const fetchProducts = async () => {
  try {
    const response = await fetch(API_URL);

    // Check if the response is successful
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Parse the JSON response
    allProducts = await response.json();
    console.log(allProducts);
    filteredProducts = [...allProducts]; // Create a copy

    // Display the products
    displayProducts(allProducts);

    // Hide loading spinner
    loadingSpinner.innerHTML = "";
  } catch (error) {
    // Handle any errors
    console.error("Error fetching products:", error);
    errorMessage.style.display = "block";
    errorMessage.textContent = "Failed to load products. Please try again later. Connection error!";
    loadingSpinner.innerHTML = "";
  }
};

// Display products in the container
const displayProducts = (products) => {
  // Clear the container first
  container.innerHTML = "";

  // Check if there are any products to display
  if (products.length === 0) {
    errorMessage.textContent =
      "Oops!Your search didn't return any products. Perhaps try a more general search term?";
      errorMessage.style.display = "block"; 
    return;
  }

  // Clear any previous error messages
  errorMessage.textContent = "";
  errorMessage.style.display = "none";  

  // Create and append product cards
  createProductCards(products, container);
};

// Create product cards function
const createProductCards = (products, container) => {
  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("card");

    // Add a small fade-in animation to each card with a slight delay based on index
    productDiv.style.animation = `fadeIn 0.5s ease-out ${product.id * 0.05}s both`;

    const like = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3.7301 15.5149L3.0246 11.4352C2.8484 10.4162 3.632 9.4842 4.665 9.4842H9.8461C10.3596 9.4842 10.7506 9.0233 10.6675 8.516L10.0048 4.4714C9.8972 3.8143 9.9279 3.142 10.0951 2.4975C10.2336 1.9636 10.6455 1.535 11.1872 1.3609L11.3322 1.3144C11.6596 1.2092 12.0169 1.2337 12.3256 1.3824C12.6653 1.5461 12.9139 1.8447 13.006 2.1999L13.4817 4.0337C13.6331 4.6172 13.8535 5.1805 14.1378 5.7126C14.5532 6.4902 15.1953 7.1125 15.8629 7.6877L17.3016 8.9275C17.7073 9.2771 17.9203 9.8006 17.8742 10.3344L17.062 19.7271C16.9875 20.5886 16.2672 21.25 15.4034 21.25H10.7548C7.2735 21.25 4.3025 18.8244 3.7301 15.5149Z" /><path fill-rule="evenodd" clip-rule="evenodd" d="M21.0323 8.7349C20.6311 8.7176 20.2874 9.0194 20.2528 9.4196L19.2812 20.6561C19.2188 21.3779 19.7873 22 20.5133 22C21.1971 22 21.75 21.4453 21.75 20.7627V9.4842C21.75 9.0826 21.4336 8.7522 21.0323 8.7349Z"/></svg>`; // Like icon
    
    const dislike = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.2699 8.48505L20.9754 12.5648C21.1516 13.5838 20.368 14.5158 19.335 14.5158H14.1539C13.6404 14.5158 13.2494 14.9767 13.3325 15.484L13.9952 19.5286C14.1028 20.1857 14.0721 20.858 13.9049 21.5025C13.7664 22.0364 13.3545 22.465 12.8128 22.6391L12.6678 22.6856C12.3404 22.7908 11.9831 22.7663 11.6744 22.6176C11.3347 22.4539 11.0861 22.1553 10.994 21.8001L10.5183 19.9663C10.3669 19.3828 10.1465 18.8195 9.86218 18.2874C9.44683 17.5098 8.80465 16.8875 8.13711 16.3123L6.69838 15.0725C6.29272 14.7229 6.07968 14.1994 6.12584 13.6656L6.93801 4.27293C7.0125 3.41139 7.7328 2.75 8.59658 2.75H13.2452C16.7265 2.75 19.6975 5.17561 20.2699 8.48505Z" /><path fill-rule="evenodd" clip-rule="evenodd" d="M2.96767 15.2651C3.36893 15.2824 3.71261 14.9806 3.74721 14.5804L4.71881 3.34389C4.78122 2.6221 4.21268 2 3.48671 2C2.80289 2 2.25 2.55474 2.25 3.23726V14.5158C2.25 14.9174 2.5664 15.2478 2.96767 15.2651Z"/></svg>`; // Dislike icon
    
    const cart = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 3h1l3.6 7.59-1.35 2.44C3.52 14.1 4.48 16 6 16h11v-2H6l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.67-1.43c-.16-.35-.52-.57-.9-.57H1v2z"/><circle cx="7" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/><path d="M16 18c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>`; // Cart icon
    
    const favorite = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`; // Favorite icon
    
    const download = `<a href="${product.image}" download="product-${product.id}.jpg" class="download-button"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 9h-4V3H9v6H5l7 7 7-7zm-7 9c-5 0-9-1-9-4v4c0 3 4 4 9 4s9-1 9-4v-4c0 3-4 4-9 4z" /></svg></a>`; // Download icon

    // Create product div element
    productDiv.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <h2>${product.category || "General"}</h2>
      <div class="cardTexts">
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <div>
          <span class="rating">
              <p class="rate">&#9733; &#9733; &#9733; &#9733; &#9733;</p>
              <p>${product.rating.rate} 
                  <span>(${product.rating.count}) <small>Ratings</small></span>
              </p>
              <p id="price">$${product.price}</p>
          </span>
          <div>
            <button id="like">${like}</button>
            <button id="dislike">${dislike}</button>
            <button id="cart">${cart}</button>
            <button id="favorite">${favorite}</button>
            <button id="download">${download}</button>
          </div>
        </div>
      </div>
    `;

    // Add event listeners to product div buttons
    productDivbuttons = productDiv.querySelectorAll("button");
    productDivbuttons.forEach((button) => {
      button.addEventListener("click", () => {
        const liked = productDiv.querySelector("#like");
        const diliked = productDiv.querySelector("#dislike");
        button.querySelector("svg").classList.toggle("active");
        
        switch (button.id) {
          case "like":
            alert(
              `You have liked: ${product.title} Under: ${product.category} With an ID of No: ${product.id}`
            );
            if (
              diliked &&
              diliked.querySelector("svg").classList.contains("active")
            ) {
              diliked.querySelector("svg").classList.remove("active");
            }
            break;
            
          case "dislike":
            alert(
              `You have disliked: ${product.title} Under: ${product.category} With an ID of No: ${product.id}`
            );
            if (
              liked &&
              liked.querySelector("svg").classList.contains("active")
            ) {
              liked.querySelector("svg").classList.remove("active");
            }
            break;
            
          case "cart":
            alert(
              `You have Added: ${product.title} Under: ${product.category} To your carts`
            );
            break;
            
          case "favorite":
            alert(
              `You have Added: ${product.title} Under: ${product.category} to your favorites`
            );
            break;
            
          case "download":
            alert(
              `You have downloaded: ${product.title} Image Under: ${product.category}`
            );
            break;
            
          default:
            break;
        }
      });
    });
    
    container.appendChild(productDiv);
  });
};

// Set up all event listeners
const setupEventListeners = () => {
  // Search functionality
  searchBar.addEventListener("input", filterProducts);

  // Category filter
  categoryFilter.addEventListener("change", filterProducts);

  // Sorting buttons
  sortButtons.forEach((button) => {
    button.addEventListener("click", () => {
      sortProducts(button.value);
    });
  });
};

// Filter products based on search text and category
const filterProducts = () => {
  const searchText = searchBar.value.toLowerCase();
  const categoryValue = categoryFilter.value;

  // Filter products based on search text and category
  filteredProducts = allProducts.filter((product) => {
    // Check if product title or description contains the search text
    const matchesSearch =
      product.title.toLowerCase().includes(searchText) ||
      product.description.toLowerCase().includes(searchText);

    // Check if product matches selected category or if no category is selected
    const matchesCategory = !categoryValue || product.category.includes(categoryValue);

    // Return true if product matches both search and category criteria
    return matchesSearch && matchesCategory;
  });

  // Display the filtered products
  displayProducts(filteredProducts);
};

// Sort products
const sortProducts = (sortValue) => {
  // Make a copy of the filtered products to sort to avoid story that touches when maying on filtered products you are trying to look for a product  by name (A-Z, Z-A) OR other cases
  const sortedProducts = [...filteredProducts];

  // Sort based on the selected option
  switch (sortValue) {
    case "price-asc":
      sortedProducts.sort((a, b) => a.price - b.price);
      break;
      
    case "price-desc":
      sortedProducts.sort((a, b) => b.price - a.price);
      break;
      
    case "name-asc":
      sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
      break;
      
    case "name-desc":
      sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
      break;
  }

  // There's a function up there that is responsible for sorting the products when the user clicks on the button (line 105)

  // Display the sorted products
  displayProducts(sortedProducts);

  // Update visual indication of active sort button
  sortButtons.forEach((btn) => {
    if (btn.value === sortValue) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
};