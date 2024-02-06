import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import pagination from './pagination.js';
import ProductModal from './ProductModal.js'
let productModal = null;
let delProductModal = null;

createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'joychiang',
      products: [],
      isNew: false,
      pages: {},
      tempProduct: {
        imagesUrl: [],
      },
    }
  },
  methods: {
    checkAdmin() {
      let url = `${this.apiUrl}/api/user/check`;
      axios.post(url)
        .then(() => {
          this.getProducts();
        })
        .catch((err) => {
          alert(err.data.message)
          window.location = 'login.html'
            ;
        })
    },
    getProducts(page) {//參數預設值 page=1
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`;
      axios.get(url)
        .then((res) => {
          this.products = res.data.products;
          this.pages = res.data.pagination;
        })
        .catch((err) => {
          alert(err.data.message);
        })
    },
    openModal(status, item) {
      if (status === 'new') {
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        productModal.show();
      } else if (status === 'edit') {
        this.tempProduct = { ...item };
        if (!Array.isArray(this.tempProduct.imagesUrl)) {
          this.tempProduct.imagesUrl = []
        }
        this.isNew = false;
        productModal.show();
      } else if (status === 'delete') {
        this.tempProduct = item;
        delProductModal.show();
      }
    },
    updateProduct() {
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
      let http = 'put';

      if (this.isNew) {
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
        http = 'post';
      }

      axios[http](url, { data: this.tempProduct })
        .then((res) => {
          alert(res.data.message);
          productModal.hide();
          this.getProducts();// 取得所有產品的函式
        })
        .catch((err) => {
          alert(err.data.message);
        })
    },
    delProduct() {
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
      axios.delete(url)
        .then((res) => {
          alert(res.data.message);
          delProductModal.hide();
          this.getProducts()
        })
        .catch((err) => {
          alert(err.data.message);
        })
    },

  },
  mounted() {
    // 使用 `new bootstrap.Modal` 語法來建立 Modal 實體
    // 第一個參數是你要設定為 Modal 的 DOM 元素
    // 第二個參數則是各種選項設定
    productModal = new bootstrap.Modal(
      document.getElementById("productModal"),
      {
        Keyboard: false,
        backdrop: 'static'
      }
    ),
      delProductModal = new bootstrap.Modal(
        document.getElementById("delProductModal"),
        {
          Keyboard: false,
          backdrop: 'static'
        }
      );
    // 取出 Token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)joyToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;

    this.checkAdmin()
  },
  components: {
    pagination, ProductModal
  }
}).mount('#app');