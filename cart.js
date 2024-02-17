import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
      VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
  });

  VeeValidateI18n.loadLocaleFromURL('zh_TW.json');

  VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize('zh_TW'),
    validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
  });

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'joychiang';

const userModal = {
    props: ["tempProduct","addCart"],
    data() {
        return {
            productModal: null,
            qty:1
        }
    },
    template: `#userProductModal`,
    methods: {
        open() {
            this.productModal.show()
        },
        close() {
            this.productModal.hide()
        },
    },
    watch:{
        tempProduct(){
            this.qty=1
        }
    },
    mounted() {
        this.productModal = new bootstrap.Modal(this.$refs.modal)

    }
}

const app = createApp({
    data() {
        return {
            products: [],
            tempProduct: {},
            form: {
                user: {
                  name: '',
                  email: '',
                  tel: '',
                  address: '',
                },
                message: '',
              },
            status:{
              addCartLoading:'',
              cartQtyLoading:'',
              removeLoading :''
            },
            carts:{}
        }
    },
    methods: {
        getProducts() {
            axios.get(`${apiUrl}/api/${apiPath}/products/all`)
                .then(res => {
                    // console.log(res);
                    this.products = res.data.products
                })
        },
        openModal(product) {
            this.tempProduct = product;
            this.$refs.userModal.open()
        },
        addCart(product_id ,qty=1) {
            const order={
            product_id,
            qty
            };
            this.status.addCartLoading = product_id
            axios.post(`${apiUrl}/api/${apiPath}/cart` , {data:order})
                .then(res => {
                    console.log(res);
                    alert(res.data.message);
                    this.status.addCartLoading = "";
                    this.$refs.userModal.close();
                    this.getCart()

                })
         },
         changeCartQty(item ,qty=1){
            const order={
                product_id:item.product_id,
                qty,
                };
                this.status.cartQtyLoading = item.id
                axios
                    .put(`${apiUrl}/api/${apiPath}/cart/${item.id}` , {data:order})
                    .then(res => {
                        this.status.cartQtyLoading = ""
                        this.getCart()
                    })
                    .catch(err => {
                        alert(err.data.message);
                    })
         },
         removeCartItem(id){
                this.status.removeLoading = id
                axios
                    .delete(`${apiUrl}/api/${apiPath}/cart/${id}`)
                    .then(res => {
                        alert(res.data.message);
                        this.status.removeLoading = ""
                        this.getCart()
                    })
                    .catch(err => {
                        console.log(err);
                    })
         },
         removeAllCart(){
            axios
                .delete(`${apiUrl}/api/${apiPath}/carts`)
                .then(res => {
                    alert(res.data.message);
                    this.getCart()
                })
                .catch(err => {
                    alert(err.data.message);
                })
        },
         getCart(){
            axios.get(`${apiUrl}/api/${apiPath}/cart`)
                .then(res => {
                    this.carts = res.data.data;
                });
            
         }
    },
    components: {
        userModal,
        VForm: Form,
        VField: Field,
        ErrorMessage: ErrorMessage,
    },
    mounted() {
        this.getProducts(),
        this.getCart()
    },
});

app.mount('#app')
