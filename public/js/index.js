const socket = io();
const containerProducts = document.getElementById("container-products");

/* socket.on("new-product", (data) => {
  containerProducts.innerHTML += `
    <div class="col-md-4 py-2">
    <div class="card text-center border border-0">
      <img
        src=${products.thumbnails}
        class="card-img-top"
        id="img-cont"
        alt=${products.title}
      />
      <div class="card-body">
        <p class="card-text">${products.category}</p>
        <p class="card-text">${products.title}</p>
        <p class="card-text">$ ${products.price}</p>
        <button>Agregar al carrito</button>
      </div>
    </div>
  </div>
                                    `;
});
socket.on("delete-product", (products) => {
  containerProducts.innerHTML = "";
  products.forEach((prod) => {
    containerProducts.innerHTML += `
      <div class="col-md-4 py-2">
      <div class="card text-center border border-0">
        <img
          src=${prod.thumbnails}
          class="card-img-top"
          id="img-cont"
          alt=${prod.title}
        />
        <div class="card-body">
          <p class="card-text">${prod.category}</p>
          <p class="card-text">${prod.title}</p>
          <p class="card-text">$ ${prod.price}</p>
          <button>Agregar al carrito</button>
        </div>
      </div>
    </div>
                                      `;
  });
});*/
socket.on("products", (data) => {
  containerProducts.innerHTML = "";
  data.forEach((prod) => {
    containerProducts.innerHTML += `
      <div class="col-md-4 py-2">
      <div class="card text-center border border-0">
        <img
          src=${prod.thumbnails}
          class="card-img-top"
          id="img-cont"
          alt=${prod.title}
        />
        <div class="card-body">
          <p class="card-text">${prod.category}</p>
          <p class="card-text">${prod.title}</p>
          <p class="card-text">$ ${prod.price}</p>
          <button>Agregar al carrito</button>
        </div>
      </div>
    </div>
                                      `;
  });
});
