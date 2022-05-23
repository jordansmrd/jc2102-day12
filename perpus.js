class Produk {
  constructor(bookName, Author, Week, TotalPage, Category, Status, Id) {
    this.bookName = bookName;
    this.Author = Author;
    this.Week = Week;
    this.TotalPage = TotalPage;
    this.Status = Status;
    (this.Category = Category), (this.Id = Id);
  }
}

class Cart extends Produk {
  constructor(bookName, Author, Week, TotalPage, Category, Status, Id) {
    super(bookName, Author, Week, TotalPage, Category, Status, Id);
  }
}

class Renter extends Produk {
  constructor(bookName, Author, Week, TotalPage, Category, Status, Id, Name) {
    super(bookName, Author, Week, TotalPage, Category, Status, Id);
    this.Name = Name;
    this.dueDate = new Date();
  }
}

let DaftarProduk = [
  new Produk(
    "Death Note Vol 1",
    "Takeshi Obata",
    1,
    221,
    "Horror",
    "Available",
    0
  ),
  new Produk(
    "Death Note Vol 2",
    "Takeshi Obata",
    1,
    323,
    "Horror",
    "Available",
    1
  ),
  new Produk(
    "Death Note Vol 3",
    "Takeshi Obata",
    1,
    443,
    "Horror",
    "Available",
    2
  ),
  new Produk("Earth", "JJ", 1, 532, "Science", "Available", 3),
];

let arrCart = [];
let arrRenter = [];
let tempDaftarProduk = [];

function disbaledButton() {
  document.getElementById("btnCheckout").disabled = true;
  document.getElementById("txtNamaPeminjam").disabled = true;

  document.getElementById("txtNamaPeminjam").disabled = true;

  let status = "Check Out";
  arrCart.forEach((a, idx) => {
    document.getElementById("ddCartWeek_" + idx).disabled = true;
    document.getElementById("btnDeleteCart_" + a.Id).disabled = true;
  });
}

function enabledButton() {
  document.getElementById("btnCheckout").disabled = false;
  document.getElementById("txtNamaPeminjam").disabled = false;

  document.getElementById("txtNamaPeminjam").disabled = false;

  let status = "Check Out";
  arrCart.forEach((a, idx) => {
    document.getElementById("ddCartWeek_" + idx).disabled = false;
    document.getElementById("btnDeleteCart_" + a.Id).disabled = false;
  });
}

let statusCheckOut = "";

function renderCheckOut() {
  let Nama = document.getElementById("txtNamaPeminjam").value;
  let htmlResult = "";

  if (arrCart.length > 0 && Nama != "") {
    startCounter();
    disbaledButton();

    htmlResult = `
          <td>
                      Waktu Pembayaran <span id="sMenit"></span> : <span id="sDetik"></span>
                  </td>
                  <td>
                    Nominal dibayar  <input id="txtNominalCO" type="number">
                  </td>  
                  <td>
                      <button onclick="AddToRenter()">Confirm</button>  
                      <button onclick="AddToRenter('cancel')">Cancel</button>  

                  </td>
          `;

    document.getElementById("trCheckOut").innerHTML = htmlResult;
  } else {
    alert("Cart Kosong atau nama peminjam belum diisi");
  }
}

function changeWeekCart(idx) {
  arrCart[idx].Week = document.getElementById("ddCartWeek_" + idx).value;
  renderCart();
}

let totalharga = 0;

function renderCart() {
  let htmlResult = "";
  totalharga = 0;
  let temp = DaftarProduk.map(function (i) {
    return i.bookName;
  });

  arrCart.forEach(
    (item, idx) => {
      item.Id = temp.indexOf(item.bookName);
      totalharga += parseInt(item.Week) * 5000;

      htmlResult += `
            <tr>
            <td>
                   ${idx + 1} 
                </td>
                <td>
                    ${item.bookName} 

                </td>
                <td>
                    ${item.Author} 
                </td>
                
                <td>
                    <select id="ddCartWeek_${idx}"  onchange="changeWeekCart(${idx})">
                        <option ${
                          item.Week == 1 ? "selected" : ""
                        } value="1">Rp.5000 / 1 Week </option>
                        <option  ${
                          item.Week == 2 ? "selected" : ""
                        }  value="2">Rp.10000 / 2 Week </option>
                        <option  ${
                          item.Week == 3 ? "selected" : ""
                        }  value="3">Rp.15000 / 3 Week</option>
                        <option  ${
                          item.Week == 4 ? "selected" : ""
                        }  value="4">Rp.20000 / 4 Week</option>
                    </select>                
                </td>
                <td>
                    ${item.TotalPage} 
                </td>
                <td>
                    ${item.Category} 
                </td>
                <td>
                    <button id="btnDeleteCart_${
                      item.Id
                    }" onclick="deleteCart(${idx})">Delete From Cart</button>
                </td>
                </tr>
                `;
    }

    // alert(harga)
  );
  document.getElementById("labelHarga").innerHTML =
    "Rp." + totalharga.toLocaleString();

  document.getElementById("CartBody").innerHTML = htmlResult;
}

let countDown;
function startCounter() {
  let seconds = 30;
  let minutes = 2;
  let counter = minutes > 0 ? minutes * 60 + seconds : seconds;

  statusCheckOut = "yes";

  countDown = setInterval(() => {
    seconds = parseInt(seconds);
    minutes = parseInt(minutes);

    if (counter < 0) {
      clearInterval(countDown);
      statusCheckOut = "";
      enabledButton();
      arrCart.forEach((a) => {
        DaftarProduk[a.Id].Status = "Available";
      });
      arrCart.splice(0, arrCart.length);
      renderCart();
      renderData();

      alert("Waktu Pembayaran Anda Sudah Habis");
      document.getElementById("trCheckOut").innerHTML = "";

      return;
    }

    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    document.getElementById("sDetik").innerHTML = seconds;
    document.getElementById("sMenit").innerHTML = minutes;

    if (counter % 60 == 0) {
      seconds = 60;
      minutes--;
    }
    counter--;
    seconds--;
  }, 1000);
}

function renderData() {
  let htmlResult = "";
  let filterNamaBuku = document.getElementById("filterNamaBuku").value;

  let filterCat = document.getElementById("filterCat").value;

  DaftarProduk.forEach((item, index) => {
    item.Id = index;
  });

  tempDaftarProduk = DaftarProduk;

  if (filterCat != "All") {
    tempDaftarProduk = DaftarProduk.filter(function (buku) {
      return buku.Category == filterCat;
    });
  }

  if (filterNamaBuku != "") {
    tempDaftarProduk = tempDaftarProduk.filter(function (buku) {
      console.log(
        buku.bookName.toLowerCase().indexOf(filterNamaBuku.toLowerCase())
      );

      return (
        buku.bookName.toLowerCase().indexOf(filterNamaBuku.toLowerCase()) !== -1
      );
    });
  }

  tempDaftarProduk.forEach((item, idx) => {
    htmlResult += `
            <tr>
            <td>
                   ${idx + 1} 
                </td>
                <td>
                    ${item.bookName} 

                </td>
                <td>
                    ${item.Author} 
                </td>
                <td>
                    <select id="ddCartPrice_${item.Id.toString()}" >
                        <option value="1" >Rp.5000 / 1 Week  </option>
                        <option value="2" >Rp.10000 / 2 Week </option>
                        <option value="3" >Rp.15000 / 3 Week </option>
                        <option value="4" >Rp.20000 / 4 Week </option>
                    </select>                  
                </td>
                <td>
                    ${item.TotalPage} 
                </td>
                <td>
                    ${item.Category} 
                </td>
                <td>
                    ${item.Status} 
                </td>
                <td>
                    <button onclick="deleteData(${item.Id})">Delete</button>
                    <button onclick="AddToCart(${item.Id})">Add To Cart</button>
                </td>
                
                </tr>
                `;
  });
  document.getElementById("produkBody").innerHTML = htmlResult;
}

function renderRent() {
  let temp = DaftarProduk.map(function (i) {
    return i.bookName;
  });

  let htmlResult = "";
  let totalharga = 0;

  arrRenter.forEach((item, idx) => {
    item.Id = temp.indexOf(item.bookName);

    htmlResult += `
            <tr>
            <td>
                   ${idx + 1} 
                </td>
                <td>
                    ${item.Name} 

                </td>
                <td>
                    ${item.bookName} 

                </td>
                <td>
                    ${item.Author} 
                </td>
                <td>
                    ${item.TotalPage} 
                </td>
                <td>
                    ${item.dueDate.toLocaleDateString()} 
                </td>
                
              
                <td>
                    ${item.Category} 
                </td>
                <td>
                    <button onclick="ReturnBook(${idx})">Return Book</button>
                </td>
                </tr>
                `;
  });
  document.getElementById("RentBody").innerHTML = htmlResult;
  document.getElementById("labelHarga").innerHTML = "Rp.0";
}

function Add() {
  let bookName = document.getElementById("txtBookName").value;
  let author = document.getElementById("txtAuthor").value;

  let status = document.getElementById("ddStatus").value;
  let week = 1;
  let category = document.getElementById("ddCategory").value;
  let totalPage = document.getElementById("txtTotalPage").value;

  const newProduct = new Produk(
    bookName,
    author,
    week,
    totalPage,
    category,
    status,
    parseInt(DaftarProduk.length)
  );
  DaftarProduk.push(newProduct);
  renderData();
  document.getElementById("txtBookName").value = "";
  document.getElementById("txtAuthor").value = "";
  document.getElementById("txtTotalPage").value = "";
}
function AddToCart(idx) {
  let bookName = DaftarProduk[idx].bookName;
  let author = DaftarProduk[idx].Author;

  let status = "In Cart";

  let week = document.getElementById("ddCartPrice_" + idx).value;

  let category = DaftarProduk[idx].Category;
  let totalPage = DaftarProduk[idx].TotalPage;

  if (statusCheckOut == "yes") {
    return alert("Cant Add While CheckOut");
  }
  if (DaftarProduk[idx].Status != "Available") {
    return alert("Book Status In Cart");
  } else {
    let cart = new Cart(
      bookName,
      author,
      week,
      totalPage,
      category,
      status,
      idx
    );
    arrCart.push(cart);
  }

  DaftarProduk[idx].Status = status;

  renderData();
  renderCart();
}

function AddToRenter(cancel) {
  let InputNominal = document.getElementById("txtNominalCO").value;
  let Kembalian = parseInt(InputNominal) - totalharga;
  let status = "Rented";
  let Nama = document.getElementById("txtNamaPeminjam").value;

  if (Nama == "") {
    return alert("isi nama peminjam");
  }

  if (cancel != null) {
    enabledButton();
    clearInterval(countDown);
    statusCheckOut = "";
    return (document.getElementById("trCheckOut").innerHTML = "");
  }
  if (Kembalian < 0) {
    return alert("Uang Anda Kurang");
  }

  clearInterval(countDown);
  document.getElementById("trCheckOut").innerHTML = "";
  statusCheckOut = "";
  arrCart.forEach((book) => {
    let renter = new Renter(
      book.bookName,
      book.Author,
      book.Week,
      book.TotalPage,
      book.Category,
      book.Status,
      book.Id,
      Nama
    );
    renter.dueDate.setDate(renter.dueDate.getDate() + parseInt(book.Week) * 7);
    arrRenter.push(renter);
    DaftarProduk[book.Id].Status = status;
  });
  alert(
    "Terima kasih " +
      Nama +
      " Kembalian Anda Sebesar Rp." +
      Kembalian.toLocaleString()
  );
  arrCart = [];
  renderData();
  renderCart();
  renderRent();

  console.log(arrRenter);
}

function ReturnBook(idx) {
  let status = "Available";

  DaftarProduk[arrRenter[idx].Id].Status = status;
  arrRenter.splice(idx, 1);
  renderData();
  renderCart();
  renderRent();
}

function deleteData(deleteIdx) {
  if (DaftarProduk[deleteIdx].Status != "Available") {
    return alert("Gagal Delete, Stock terdapat di Cart");
  }
  DaftarProduk.splice(deleteIdx, 1);
  renderData();
  renderCart();
  renderRent();
}

function deleteCart(deleteIdx) {
  if (arrCart[deleteIdx].Status == "Check Out") {
    return alert("Tidak dapat menghapus produk saat check out");
  }
  let idxProduk = arrCart[deleteIdx].Id;

  DaftarProduk[idxProduk].Status = "Available";
  arrCart.splice(deleteIdx, 1);

  renderData();
  renderCart();
  renderRent();
}

renderData();
