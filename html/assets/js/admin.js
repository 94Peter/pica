// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyA4sjMahzhHQ0B9iZlNNF4pRDYU1OoFxn4",
    authDomain: "pica957.firebaseapp.com",
    databaseURL: "https://pica957.firebaseio.com",
    projectId: "pica957",
    storageBucket: "pica957.appspot.com",
    messagingSenderId: "963515967780",
    appId: "1:963515967780:web:5b0ad8c23c1298ba"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);




const Login = {
    template: `
    <div id="login" class="login page">
        <h1>業績動態後台</h1>
        <div class="page-scroll">
        <div class="d-flex justify-content-center">
        <form action="#">
            <div class="form-group row">
                <label for="userAccount" class="col-3 col-form-label">帳號</label>
                <div class="col-9">
                    <input type="text" class="form-control" id="userAccount" placeholder="請輸入帳號">
                </div>
            </div>
            <div class="form-group row">
                <label for="userPassword" class="col-3 col-form-label">密碼</label>
                <div class="col-9">
                    <input type="password" class="form-control" id="userPassword" placeholder="請輸入密碼">
                </div>
            </div>
            <div class="form-group">
                <button type="button" class="btn btn-primary" @click="$emit('log-in')">登入</button>
                <button type="button" class="btn btn-link btn-forgot" @click="$emit('open-lightbox', 'forgot')">忘記密碼</button>
            </div>
        </form>
        </div>
        </div>
    </div>
    `,
    props: ['userdata']
}
const Main = {
    template: `
    <div id="main" class="main page">
        <h1>管理後台</h1>
        <div class="page-scroll">
        <div class="d-flex justify-content-center">
        <div class="row">
            <div class="col-12">
                <router-link class="btn btn-option" to="/manage-store">人員管理</router-link>
                <router-link class="btn btn-option" to="/manage-items">回報項目管理</router-link>
                <button type="button" class="btn btn-link btn-logout" @click="$emit('log-out')">登出</button>
            </div>
        </div>
        </div>
        </div>
    </div>
    `
}
const manageStore = {
    template: `
    <div id="manage-store" class="manage-store page">
        <h1>分店管理</h1>
        <button type="button" class="btn btn-add btn-icon" @click="$emit('open-lightbox', 'store-add')"></button>
        <div class="page-scroll">
            <div class="d-flex justify-content-center">
                <div class="row" v-if="datastore.length > 0">
                    <div class="col-12" v-for="item in datastore">
                        <button type="button" class="btn btn-option" @click="$emit('choose-store', item)">{{ item }}</button>
                    </div>
                </div>
                <p v-if="datastore.length === 0">無資料</p>
            </div>
        </div>
    </div>
    `,
    props: ['datastore'],
    methods: {
        showStore(){
            setTimeout(() => {
                fetch('https://pica957.appspot.com/v1/category', {
                    method: 'GET',
                    headers: new Headers({
                        'Auth-Token': sessionStorage.getItem('userToken')
                    })
                })
                .then(data => {
                    // console.log(data);
                    if(data.status === 200){           
                        data.json().then(function(json) { 
                            // console.log(json);   
                            vm.dataStore = json;
                        }); 
                    }else if(data.status === 204){
                        vm.dataStore = [];
                    }else if(data.status === 401){
                        vm.hintRed('登入失效，請重新登入！');
                        router.push({ name: "login"});
                    }
                    $('#load').hide();
                })
                .catch(function(err) {  
                    console.log('Fetch Error :-S', err);  
                    vm.hintRed('資料載入錯誤');
                    $('#load').hide(); //關閉等待
                });
            }, 100)
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => { 
            $('#load').show();
            vm.showStore();
            next();
        }) 
    }
}
const managePeople = {
    template: `
    <div id="manage-people" class="manage-people page">
        <h1>人員管理</h1>
        <button type="button" id="btn-add" class="btn btn-add btn-icon" @click="$emit('open-lightbox', 'person-add')"></button>
        <div class="page-scroll">
        <div class="d-flex justify-content-center">
        <div class="row">
            <div class="col-12"><h3>{{ currentstore }}</h3></div>
            <div class="col-12" v-for="item in datapeople" v-if="datapeople.length > 0">
                <button type="button" class="btn btn-edit btn-icon" @click="$emit('choose-person', item.phone, item.permission)"></button>
                <div class="person-item">
                    <span class="person-name">{{ item.name }}</span>
                    <span class="person-permission active" v-if="item.permission == 'manager'">
                        主管
                    </span>
                    <span class="person-permission" v-else>
                        業務
                    </span><br>
                    {{ item.phone }}<br>
                    {{ item.email }}
                </div>
            </div>
            <div class="col-12">
                <p class="empty" v-if="datapeople.length === 0">無資料</p>
            </div>
        </div>
        </div>
        </div>
    </div>
    `,
    props: ['datapeople', 'currentstore'],
    methods: {
        showPeople(){
            setTimeout(() => {
                fetch('https://pica957.appspot.com/v1/user?c=' + sessionStorage.getItem('currentStore'), {
                    method: 'GET',
                    headers: new Headers({
                        'Auth-Token': sessionStorage.getItem('userToken')
                    })
                })
                .then(data => {
                    // console.log(data);
                    if(data.status === 200){           
                        data.json().then(function(json) { 
                            // console.log(json);   
                            vm.dataPeople = json;
                        }); 
                    }else if(data.status === 204){
                        vm.dataPeople = [];
                    }else if(data.status === 401){
                        vm.hintRed('登入失效，請重新登入！');
                        router.push({ name: "login"});
                    }
                    $('#load').hide();
                })
                .catch(function(err) {  
                    console.log('Fetch Error :-S', err);  
                    vm.hintRed('資料載入錯誤');
                    $('#load').hide(); //關閉等待
                });
            }, 100)
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => { 
            $('#load').show();
            vm.showPeople();
            next();
        }) 
    }
}
const manageItems = {
    template: `
    <div id="manage-items" class="manage-items page">
        <h1>回報項目管理</h1>
        <button type="button" class="btn btn-send btn-icon" @click="$emit('send-report')"></button>
        <div class="page-scroll">
        <div class="d-flex justify-content-center">
        <div class="row">
            <div class="col-12 orders" v-if="datareport.length > 0">
                <draggable
                    :list="datareport"
                    :disabled="!enabled"
                    ghost-class="ghost"
                    @start="draggingT()"
                    @end="draggingF()"
                >
                    <div class="order" v-for="item, index in datareport">
                        <table class="table table-sm">
                            <tbody>
                                <tr>
                                    <th scope="row">項目單位</th>
                                    <td>{{item.name}}</td>
                                </tr>
                                <tr>
                                    <th scope="row">單　　位</th>
                                    <td>{{item.unit}}</td>
                                </tr>
                                <tr>
                                    <th scope="row">今日進展</th>
                                    <td>{{item.hasText}}</td>
                                </tr>
                                <tr>
                                    <th scope="row">動態顯示</th>
                                    <td>{{item.isShow}}</td>
                                </tr>
                            </tbody>
                        </table>
                        <button type="button" class="btn btn-edit btn-icon" @click="$emit('choose-item', index)"></button>
                    </div>
                </draggable>
            </div>        
            <div class="col-12">
                <p class="empty" v-if="datareport.length === 0">無資料</p>
            </div>
            <div class="col-12">
                <button type="button" class="btn btn-add2 btn-icon2" @click="$emit('open-lightbox', 'item-add')">新增欄位</button>
                <!--raw-displayer class="displayer" :value="datareport" title="datareport" /-->
            </div>
            </div>
        </div>
        </div>
    </div>
    `,
    props: ['datareport', 'isload', 'enabled', 'dragging'],
    methods: {
        draggingT(){
            this.$emit('start', true);
        },
        draggingF(){
            this.$emit('end', false);
        },
        showReport(){
            setTimeout(() => {
                fetch('https://pica957.appspot.com/v1/reportItem', {
                    method: 'GET',
                    headers: new Headers({
                        'Auth-Token': sessionStorage.getItem('userToken')
                    })
                })
                .then(data => {
                    // console.log(data);
                    if(data.status === 200){           
                        data.json().then(function(json) { 
                            // console.log(json);   
                            vm.dataReport = json;
                        }); 
                    }else if(data.status === 204){
                        vm.dataReport = [];
                    }else if(data.status === 401){
                        vm.hintRed('登入失效，請重新登入！');
                        router.push({ name: "login"});
                    }
                    $('#load').hide();
                })
                .catch(function(err) {  
                    console.log('Fetch Error :-S', err);  
                    vm.hintRed('資料載入錯誤');
                    $('#load').hide(); //關閉等待
                });
            }, 100)
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => { 
            $('#load').show();
            vm.showReport();
            next();
        }) 
    }
}

let routes = [{
        path: "/",
        name: "login",
        component: Login
    },
    {
        path: "/main",
        name: "main",
        component: Main
    },
    {
        path: "/manage-store",
        name: "manage-store",
        component: manageStore
    },
    {
        path: "/manage-people",
        name: "manage-people",
        component: managePeople
    },
    {
        path: "/manage-items",
        name: "manage-items",
        component: manageItems
    },
    { path: '*', redirect: '/' }
]
let router = new VueRouter({
    // mode: 'history',
    history: true,
    routes: routes, //路由表
});
let id = 1;
let vm = new Vue({
    el: '#app',
    router,
    data: {
        isOpenLightbox: false,
        currentLightbox: '',
        currentItem: -1,
        userData: {
            account: '',
            password: '',
            token: ''
        },
        dataStore: [],
        dataPeople: [],
        dataReport: [],
        currentStore: sessionStorage.getItem('currentStore') ? sessionStorage.getItem('currentStore') : '',
        currentPermission: '',
        personPhone: '',
        dragging: false,
        enabled: true
    },
    methods: {
        login () { //console.log('login');
        this.userData.account = document.querySelector("#userAccount").value;
        this.userData.password = document.querySelector("#userPassword").value;
        if(this.userData.account.length < 1 && this.userData.password.length < 1){
            vm.hintRed('請輸入帳號密碼！');
            return;
        }
        sessionStorage.setItem('userToken', '');
        $('#load').show(); //開啟等待
        
        //firebase 登入
        firebase.auth().signInWithEmailAndPassword(this.userData.account, this.userData.password).then(function(result) {
            // var user = result.user;
            // console.log(user);
            //交換token
            firebase.auth().onAuthStateChanged(function(user) {
                if(user){
                    user.getIdToken().then(function(data) {
                        vm.userData.token = data;
                        //setTimeout(function(){
                            fetch('https://pica957.appspot.com/v1/token', {
                                method: 'GET',
                                headers: new Headers({
                                    'Auth-Token': vm.userData.token
                                })
                            })
                            .then(data => {
                                // console.log(data);
                                if(data.status === 200){         
                                    data.json().then(function(json) { 
                                        // console.log(json);   
                                        if(json.permission == 'admin'){
                                            sessionStorage.setItem('userToken', json.token);
                                            vm.userData.permission = json.permission;
                                            sessionStorage.setItem('permission', json.permission);
                                            vm.hintGreen('登入成功');
                                            router.push({ name: "main"});
                                        }else{
                                            vm.hintRed('權限不足，請重新登入！');
                                        }  
                                        
                                    });   
                                }else if(data.status === 401){
                                    vm.hintRed('登入失效，請重新登入！');
                                    router.push({ name: "login"});
                                }
                                $('#load').hide();
                            })
                            .catch(function(err) {  
                                console.log('Fetch Error :-S', err);  
                                vm.hintRed('登入錯誤，請重新登入！');
                                $('#load').hide(); //關閉等待
                                document.querySelector("#userPassword").value = ''; //清除密碼
                            });
                        //}, 1000);
                    });
                }
            });
        }).catch(function(error) {
            var errorCode = error.code;
            // var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found') {
                vm.hintRed('帳號或密碼錯誤，請重新輸入！');
            } else {
                vm.hintRed('請輸入帳號密碼！');
            }
            document.querySelector("#userPassword").value = ''; //清除密碼
            $('#load').hide();  //關閉等待
            // console.log(error);
        });
        },
        logout () { //console.log('logout');
            vm.closeLightbox(); //關閉lightbox
            $('#load').show(); //開啟等待
            firebase.auth().signOut().then(function() {
                //清空資訊
                sessionStorage.setItem('userToken', '');
                sessionStorage.setItem('currentStore', '');
                router.push({ name: "login"});  //回登入頁
                $('#load').hide(); //關閉等待
                vm.hintGreen('已成功登出！');
            }).catch(function(error) {
                vm.hintRed('登出錯誤！');
                $('#load').hide(); //關閉等待
            });
        },
        forgotPwd() {
            firebase.auth().sendPasswordResetEmail(document.querySelector("#userforgot").value)
            .then(function() {
                vm.hintGreen('信件已寄出，請到信箱重新設定密碼！');
                vm.closeLightbox();  //關閉lightbox
            })
            .catch(function(error) {
                var errorCode = error.code;//console.log(errorCode);
                if (errorCode === 'auth/invalid-email') {
                    vm.hintRed('信箱格式錯誤，請重新輸入！');
                } else if(errorCode) {
                    vm.hintRed('沒有此會員，請重新輸入！');
                }
            });
        },
        addStore () { //console.log('addStore');
            var data = {
                "name": document.querySelector("#storeName").value
            };
            $('#load').show();
            fetch('https://pica957.appspot.com/v1/category', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: new Headers({
                    'Auth-Token': sessionStorage.getItem('userToken')
                })
            })
            .catch(error => console.error('Error:', error))
            .then(response => {
                if(response.status === 200){           
                    // console.log('Success:', response);
                    vm.closeLightbox();  //關閉
                    vm.hintGreen('新增成功');
                    vm.refreshStore();
                    // setTimeout(() => {
                    //     router.go(0);
                    // }, 1000);
                }else if(response.status === 500){
                    vm.hintRed('伺服器錯誤，請稍候再試');
                    $('#load').hide();
                }else if(response.status === 400){
                    console.log('Failed:', response);
                    vm.hintRed('新增錯誤');
                    $('#load').hide();
                }
            });
        },
        refreshStore(){
            $('#load').show();
            fetch('https://pica957.appspot.com/v1/category', {
                method: 'GET',
                headers: new Headers({
                    'Auth-Token': sessionStorage.getItem('userToken')
                })
            })
            .then(data => {
                // console.log(data);
                if(data.status === 200){           
                    data.json().then(function(json) { 
                        // console.log(json);   
                        vm.dataStore = json;
                    }); 
                }else if(data.status === 204){
                    vm.dataStore = [];
                }else if(data.status === 401){
                    vm.hintRed('登入失效，請重新登入！');
                    router.push({ name: "login"});
                }
                $('#load').hide();
            })
            .catch(function(err) {  
                console.log('Fetch Error :-S', err);  
                vm.hintRed('資料載入錯誤');
                $('#load').hide(); //關閉等待
            });
        },
        chooseStore (n) { //console.log('chooseStore');
            this.currentStore = n;
            sessionStorage.setItem('currentStore', n);
            router.push({ name: "manage-people"});
        },
        addPeople () { //console.log('addPeople');
            var data = {
                email: document.querySelector("#personEmail").value,
                name: document.querySelector("#personName").value,
                phone: document.querySelector("#personPhone").value,
                category: sessionStorage.getItem('currentStore'),
                permission: document.querySelector("input[name=person-add1]:checked").value
            };
            // console.log(data);
            $('#load').show();
            fetch('https://pica957.appspot.com/v1/user', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: new Headers({
                    'Auth-Token': sessionStorage.getItem('userToken')
                })
            })
            .catch(error => console.error('Error:', error))
            .then(response => {
                if(response.status === 200){           
                    // console.log('Success:', response);
                    vm.closeLightbox();  //關閉
                    vm.hintGreen('新增成功');
                    vm.refreshPeople();
                    // setTimeout(() => {
                    //     router.go(0);
                    // }, 1000);
                }else if(response.status === 500){
                    vm.hintRed('伺服器錯誤，請稍候再試');
                    $('#load').hide();
                }else if(response.status === 400){
                    console.log('Failed:', response);
                    vm.hintRed('新增錯誤');
                    $('#load').hide();
                }
            });
        },
        refreshPeople(){
            setTimeout(() => {
                fetch('https://pica957.appspot.com/v1/user?c=' + sessionStorage.getItem('currentStore'), {
                    method: 'GET',
                    headers: new Headers({
                        'Auth-Token': sessionStorage.getItem('userToken')
                    })
                })
                .then(data => {
                    // console.log(data);
                    if(data.status === 200){           
                        data.json().then(function(json) { 
                            // console.log(json);   
                            vm.dataPeople = json;
                        }); 
                    }else if(data.status === 204){
                        vm.dataPeople = [];
                    }else if(data.status === 401){
                        vm.hintRed('登入失效，請重新登入！');
                        router.push({ name: "login"});
                    }
                    $('#load').hide();
                })
                .catch(function(err) {  
                    console.log('Fetch Error :-S', err);  
                    vm.hintRed('資料載入錯誤');
                    $('#load').hide(); //關閉等待
                });
            }, 100)
        },
        choosePerson (phone, permission) { //console.log('choosePerson');
            this.personPhone = phone;
            this.currentPermission = permission;
            vm.openLightbox('person-btns');
        },
        addReport: function(){   //console.log('addReport')
            var hasText = (document.querySelector("input[name=itemText]:checked").value == 'true') ? true : false;
            var isShow = (document.querySelector("input[name=itemShow]:checked").value == 'true') ? true : false;
            this.dataReport.push({
                name: document.querySelector("#itemName").value,
                unit: document.querySelector("#itemUnit").value,
                hasText: hasText,
                isShow: isShow
            });
            this.closeLightbox();  //關閉
        },
        modifyReport: function(){   //console.log('modifyReport')
            var hasText = (document.querySelector("input[name=itemText2]:checked").value == 'true') ? true : false;
            var isShow = (document.querySelector("input[name=itemShow2]:checked").value == 'true') ? true : false;
            this.dataReport[this.currentItem].name = document.querySelector("#itemName2").value;
            this.dataReport[this.currentItem].unit = document.querySelector("#itemUnit2").value;
            this.dataReport[this.currentItem].hasText = hasText;
            this.dataReport[this.currentItem].isShow = isShow;
            this.closeLightbox(); //關閉
        },
        deleteReport: function(){   //console.log('deleteReport')
            var data = this.dataReport;
            data.splice(this.currentItem, 1);
            // console.log(data)
            this.dataReport = data;
            this.closeLightbox();  //關閉
        },
        chooseReport: function(index){   //console.log('chooseReport')
            this.currentItem = index;
            // console.log(this.currentItem);
            this.openLightbox('item-btns');   //開啟修改和刪除的項目
        },
        sendReport () { //console.log('sendReport');
            var data = this.dataReport;
            // console.log(data);
            fetch('https://pica957.appspot.com/v1/reportItem', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: new Headers({
                    'Auth-Token': sessionStorage.getItem('userToken')
                })
            })
            .catch(error => console.error('Error:', error))
            .then(response => {
                if(response.status === 200){           
                    // console.log('Success:', response);
                    vm.closeLightbox();  //關閉
                    vm.hintGreen('送出成功');
                    router.push({ name: "main"});
                    // setTimeout(() => {
                    //     router.go(0);
                    // }, 1000);
                }else if(response.status === 500){
                    vm.hintRed('伺服器錯誤，請稍候再試');
                }else if(response.status === 400){
                    console.log('Failed:', response);
                    vm.hintRed('送出錯誤');
                }
                $('#load').hide();
            });
        },
        transfer(){ //console.log('transfer');
            var data = {
                phone: this.personPhone,
                category: document.querySelector("input[name=person-category]:checked").value
            };//console.log(JSON.stringify(data));
            $('#load').show();
            fetch('https://pica957.appspot.com/v1/user/category', {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: new Headers({
                    'Auth-Token': sessionStorage.getItem('userToken')
                })
            })
            .catch(error => console.error('Error:', error))
            .then(response => {
                if(response.status === 200){           
                    // console.log('Success:', response);
                    vm.hintGreen('調店修改成功！');
                    vm.refreshPeople();  //重整
                    vm.closeLightbox();  //關閉lightbox
                }else if(response.status === 500){
                    vm.hintRed('伺服器錯誤，請稍候再試');
                }else if(response.status === 400){
                    console.log('Failed:', response);
                    vm.hintRed('調店修改錯誤');
                }else if(data.status === 401){
                    vm.hintRed('登入失效，請重新登入！');
                    router.push({ name: "login"});
                }
                $('#load').hide();
            });
        },
        leave(){ //console.log('leave');
            $('#load').show();
            fetch('https://pica957.appspot.com/v1/user/' + this.personPhone, {
                method: 'DELETE',
                headers: new Headers({
                    'Auth-Token': sessionStorage.getItem('userToken')
                })
            })
            .catch(error => console.error('Error:', error))
            .then(response => {
                if(response.status === 200){           
                    // console.log('Success:', response);
                    vm.hintGreen('人員刪除成功！');
                    vm.refreshPeople();  //重整
                    vm.closeLightbox();  //關閉lightbox
                }else if(response.status === 500){
                    vm.hintRed('伺服器錯誤，請稍候再試');
                }else if(response.status === 400){
                    console.log('Failed:', response);
                    vm.hintRed('人員刪除錯誤');
                }else if(data.status === 401){
                    vm.hintRed('登入失效，請重新登入！');
                    router.push({ name: "login"});
                }
                $('#load').hide();
            });
        },
        changePermission(){ //console.log('changePermission');
            var data = {
                phone: this.personPhone,
                permission: document.querySelector("input[name=person-permission]:checked").value
            };//console.log(JSON.stringify(data));
            $('#load').show();
            fetch('https://pica957.appspot.com/v1/user/permission', {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: new Headers({
                    'Auth-Token': sessionStorage.getItem('userToken')
                })
            })
            .catch(error => console.error('Error:', error))
            .then(response => {
                if(response.status === 200){           
                    // console.log('Success:', response);
                    vm.hintGreen('權限修改成功！');
                    vm.refreshPeople();  //重整
                    vm.closeLightbox();  //關閉lightbox
                }else if(response.status === 500){
                    vm.hintRed('伺服器錯誤，請稍候再試');
                }else if(response.status === 400){
                    console.log('Failed:', response);
                    vm.hintRed('權限修改錯誤');
                }else if(data.status === 401){
                    vm.hintRed('登入失效，請重新登入！');
                    router.push({ name: "login"});
                }
                $('#load').hide();
            });
        },
        goBack () {
            window.history.length > 1
                ? this.$router.go(-1)
                : this.$router.push('/')
        },
        openLightbox(n) {
            this.isOpenLightbox = true
            this.currentLightbox = n
            if(n == 'person-category'){
                fetch('https://pica957.appspot.com/v1/category', {
                    method: 'GET',
                    headers: new Headers({
                        'Auth-Token': sessionStorage.getItem('userToken')
                    })
                })
                .then(data => data.json())
                .then(json => {
                    // console.log(json)
                    vm.dataStore = json
                });
            }
            return 'lightbox-' + this.currentLightbox
        },
        closeLightbox() {
            this.isOpenLightbox = false
            this.currentLightbox = ''
        },
        draggingT(){
            this.dragging = true;
        },
        draggingF(){
            this.dragging = false;
        },
        hintGreen(txt) {
            $('#success').text(txt);
            $('#success').show();
            TweenMax.to('#success', .4, {opacity: 1, y: -20});
            TweenMax.to('#success', .3, {delay: 1.4, opacity: 0, y: 0, onComplete: function(){
                $('#success').hide();
            }});
        },
        hintRed(txt) {
            $('#failed').text(txt);
            $('#failed').show();
            TweenMax.to('#failed', .4, {opacity: 1, y: -20});
            TweenMax.to('#failed', .3, {delay: 1.4, opacity: 0, y: 0, onComplete: function(){
                $('#failed').hide();
            }});
        }
    }
})

router.beforeEach((to, from, next) => {
    // console.log('to:'+to.name);
    
    // var userToken = sessionStorage.getItem('userToken');
    // if(!userToken){
 
    //     if(to.name != 'login'){
    //         !!userToken ? next() : next('/');
    //     }else{
    //             next();
    //     }
    // }else{
        next();
    // }
})
