import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

createApp({
  data(){
    return{
      apiUrl:'https://vue3-course-api.hexschool.io/v2',
      apiPath:'joychiang',
      products:[],
      showProduct:{},
    }
  },
  methods: {
    checkAdmin(){
      const url=`${this.apiUrl}/api/user/check`;
      axios.post(url)
      .then(()=>{
        this.getProducts();
        console.log("驗證成功");
      })
      .catch((err)=>{
        alert(err.response.data.message)
        window.location='login.html'
        ;
      })
    },
    getProducts(){
      const url = `${this.apiUrl}/api/joychiang/admin/products/all`;
      axios.get(url)
      .then((res)=>{
        this.products=res.data.products
      })
      .catch((err)=>{
        alert(err.response.data.message);
      })
    }

  },
  mounted() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)joyToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;

    this.checkAdmin()
  },
}).mount('#app');