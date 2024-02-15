import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

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
            status:{
              addCartLoading:''
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
                console.log(order);
                axios
                    .put(`${apiUrl}/api/${apiPath}/cart/${item.id}` , {data:order})
                    .then(res => {
                        console.log(res);
                        this.getCart()
                    })
                    .catch(err => {
                        console.log(err);
                    })
         },
         getCart(){
            axios.get(`${apiUrl}/api/${apiPath}/cart`)
                .then(res => {
                    console.log(res);
                    this.carts = res.data.data;
                    console.log(this.carts);
                });
            
         }
    },
    components: {
        userModal,
    },
    mounted() {
        this.getProducts(),
        this.getCart()
    },
})
app.mount('#app')
