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


Date.prototype.format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

Date.prototype.addDays = function(days) {
    this.setDate(this.getDate() + days);
    return this;
  }

const Login = {
    template: `
    <div id="login" class="login page">
        <h1>業績動態系統</h1>
        <div class="page-scroll">
        <div class="d-flex justify-content-center">
        <form>
            <div class="form-group row">
                <label for="userAccount" class="col-3 col-form-label">帳號</label>
                <div class="col-9">
                    <input type="email" class="form-control" id="userAccount" placeholder="請輸入信箱">
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
    `
}
const First = {
    template: `
    <div id="first" class="first page">
        <h1>初次登入</h1>
        <div class="page-scroll">
        <div class="d-flex justify-content-center">
        <form>
            <div class="form-group row">
                <label for="userOrigin" class="col-3 col-form-label">原始密碼</label>
                <div class="col-9">
                    <input type="password" class="form-control" id="userOrigin" placeholder="請輸入初次登入密碼">
                </div>
            </div>
            <div class="form-group row">
                <label for="userNew" class="col-3 col-form-label">新密碼</label>
                <div class="col-9">
                    <input type="password" class="form-control" id="userNew" placeholder="請輸入新密碼">
                    <small id="emailHelp" class="form-text">＊八個字母以上的英文、數字和符號</small>
                </div>
            </div>
            <div class="form-group row">
                <label for="userConfirm" class="col-3 col-form-label">確認密碼</label>
                <div class="col-9">
                    <input type="password" class="form-control" id="userConfirm" placeholder="請再次輸入密碼">
                </div>
            </div>
            <div class="form-group row">
                <label for="userStock" class="col-3 col-form-label">庫存數量</label>
                <div class="col-9">
                    <input type="number" class="form-control" id="userStock" placeholder="請輸入庫存數量">
                </div>
            </div>
            <div class="form-group row">
                <label for="userPerformance" class="col-3 col-form-label">最高業績</label>
                <div class="col-9">
                    <input type="number" class="form-control" id="userPerformance" placeholder="請輸入最高業績">
                    <small id="emailHelp" class="form-text">＊單位（萬）NTD</small>
                </div>
            </div>
            <div class="form-group">
                <button type="button" class="btn btn-primary" @click="$emit('first-login')">確認</button>
            </div>
        </form>
        </div>
        </div>
    </div>
    `
}
const Today = {
    template: `
    <div id="list-today" class="list-today page">
        <h1>今日進展</h1>
        <div class="title-time">
            <input type="text" id="select-date" class="form-control" @touchstart="$emit('select-date')" @mousedown="$emit('select-date')">
        </div>
        <div class="page-scroll">
        <div class="d-flex justify-content-center">
        <div class="content">
            <table class="table table-sm table-striped" v-if="datatoday.length > 0">
                <tbody>
                    <tr>
                        <th scope="col">姓名</th>
                        <th scope="col">類別</th>
                        <th scope="col">數量</th>
                        <th scope="col">進展</th>
                    </tr>
                    <tr v-for="item in datatoday">
                        <td>{{ item.name }}</td>
                        <td>{{ item.type }}</td>
                        <td>{{ item.value }}</td>
                        <td>{{ item.msg }}</td>
                    </tr>
                </tbody>
            </table>
            <p class="empty" v-if="datatoday.length === 0">無資料</p>
        </div>
        </div>
        </div>
    </div>
    `,
    props: ['datatoday'],
    created() {
        setTimeout(() => {
            // console.log(vm.isSettingStock);
            if(new Date().getDate() == 1 && !vm.isSettingStock){
                vm.openLightbox('setting-stock');
                vm.isSettingStock = true;
            }
        }, 100)
    },
    methods: {
        showToday(){
            setTimeout(() => {
                var todayDate = new Date().toISOString().slice(0, 10);
                document.querySelector('#select-date').value = todayDate;
                fetch('https://pica957.appspot.com/v1/trend/daily?date=' + todayDate, {
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
                            vm.dataToday = json;
                        }); 
                    }else if(data.status === 204){
                        vm.dataToday = [];
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
            vm.showToday();
            next();
        }) 
    }
}
const All = {
    template: `
    <div id="list-all" class="list-all page">
        <h1>全區動態</h1>
        <div class="title-time">
            <input type="text" id="select-month" class="form-control" @touchstart="$emit('select-month')" @mousedown="$emit('select-month')">
        </div>
        <div class="page-scroll">
        <div class="d-flex justify-content-center">
        <div class="row">
            <div class="col-12 lists">
                <div class="list">
                    <table class="table table-sm table-responsive-sm" v-if="dataall.data">
                        <tbody>
                            <tr>
                                <th scope="row" v-for="item in dataall.columns">
                                    {{ item }}
                                </th>
                            </tr> 
                            <tr v-for="item in dataall.data">
                                <template v-for="(i, index) in item">
                                <td v-if="index == 0"><h4>{{ i }}<button class="btn btn-detail" @click="$emit('choose-store', i)"></button></h4></td>
                                <td v-else-if="index != 0 && index != 1">{{ i }}</td>
                                </template>
                            </tr>
                            <tr>
                                <td>總計</td>
                                <template class="sum" v-for="(item, index) in dataall.total">
                                    <td v-if="index != 0 && index != 1">{{ item }}</td>
                                </template>
                            </tr>
                        </tbody>
                    </table>
                    <p class="empty" v-if="!dataall.data">無資料</p>
                </div>
            </div>        
            </div>
            </div>
        </div>
    </div>
    `,
    props: ['dataall'],
    methods: {
        showAll(){
            setTimeout(() => {
                var todayDate = new Date().toISOString().slice(0, 10);
                document.querySelector('#select-month').value = todayDate;
                fetch('https://pica957.appspot.com/v1/trend/category?date=' + todayDate, {
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
                            vm.dataAll = json;
                        }); 
                    }else if(data.status === 204){
                        vm.dataAll = [];
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
            vm.showAll();
            next();
        }) 
    }
}
const Store = {
    template: `
    <div id="list-store" class="list-store page">
        <h1 class="title">{{ currentstore }}動態</h1>
        <div class="title-time">
            <input type="text" id="select-month2" class="form-control" @touchstart="$emit('select-month')" @mousedown="$emit('select-month')">
        </div>
        <div class="page-scroll">
        <div class="d-flex justify-content-center">
        <div class="row">
            <div class="col-12 lists">
                <div class="list">
                    <table class="table table-sm table-responsive-sm" v-if="datastore.data">
                    <tbody>
                        <tr v-if="datastore.columns">
                            <th scope="row" v-for="item in datastore.columns">
                                {{ item }}
                            </th>
                        </tr> 
              
                        <tr v-for="item in datastore.data" v-if="datastore.data">
                            <template v-for="(i, index) in item">
                                <td v-if="index == 0"><h4>{{ i }}<br>
                                <template v-for="(mark, index2) in item[1]">
                                    <span :class="'mark' + index2 + '_' + mark" v-if="mark != 0"></span>
                                </template></h4>
                                </td>
                                <td v-else-if="index != 0 && index != 1">{{ i }}</td>
                            </template>
                        </tr>
                        <tr v-if="datastore.total">
                            <td>總計</td>
                            <template class="sum" v-for="(item, index) in datastore.total">
                                <td v-if="index != 0 && index != 1">{{ item }}</td>
                            </template>
                        </tr>
                    </tbody>
                    </table>
                    <p class="empty" v-if="!datastore.data">無資料</p>
                </div>
            </div>        
            </div>
            </div>
        </div>
    </div>
    `,
    props: ['datastore', 'currentstore'],
    methods: {
        showStore(){
            setTimeout(() => {
                var todayDate = new Date().toISOString().slice(0, 10);
                document.querySelector('#select-month2').value = todayDate;
                fetch('https://pica957.appspot.com/v1/trend/category?c=' + sessionStorage.getItem('currentStore') + '&date=' + todayDate, {
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
                            for(var i = 0, l = json.data.length; i < l; i++){
                                json.data[i][1] = json.data[i][1].split(',');
                                // console.log(json.data[i][1]);
                            }
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
const Report = {
    template: `
    <div id="return-form" class="return-form page">
        <h1>個人回報</h1>
        <div class="title-time">
            <input type="text" id="select-report-date" class="form-control" @touchstart="$emit('select-date')" @mousedown="$emit('select-date')">
        </div>
        <div class="page-scroll">
        <div class="d-flex justify-content-center">
        <form v-if="reportreturn.length > 0">
            <div class="block" v-for="(item, index) in reportreturn">
                <div class="form-group form-group3">
                    <label class="col-form-label" :for="'return-value' + index">{{ item.name }}</label>
                    <input v-if="item.unit === '萬'" type="number" class="form-control return-value"  :id="'return-value' + index" placeholder="請輸入金額">
                    <input v-else type="number" class="form-control return-value"  :id="'return-value' + index" :placeholder="'請輸入' + item.unit + '數'">
                    <span>{{ item.unit }}</span>
                </div>
                <div class="form-group" v-if="item.hasText">
                    <!-- <label class="col-form-label" :for="'return-msg' + index">今日進度</label> -->
                    <textarea class="form-control return-msg" :id="'return-msg' + index" placeholder="請輸入內容"></textarea>
                </div>
            </div>
            <div class="form-group">
                <button type="button" class="btn btn-primary" @click="$emit('send-report')">送出</button>
            </div>
        </form>
        <p class="empty" v-if="reportreturn.length === 0">未回傳表單</p>
        </div>
        </div>
    </div>
    `,
    props: ['reportreturn'],
    methods: {
        showReturn(){
            setTimeout(() => {
                nowDate = new Date();
                if (nowDate.getHours() < 2) {
                    nowDate = nowDate.addDays(-1);
                }
                var todayDate = nowDate.format("yyyy-MM-dd");
                document.querySelector('#select-report-date').value = todayDate;
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
                            vm.reportReturn = json;
                        }); 
                    }else if(data.status === 204){
                        vm.reportReturn = [];
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
            vm.showReturn();
            next();
        }) 
    }
}
const Setting = {
    template: `
    <div id="setting" class="setting page">
        <h1>設定</h1>
        <div class="page-scroll">
        <div class="d-flex justify-content-center">
        <div class="row">
            <div class="col-12">
                <button type="button" class="btn btn-option" @click="$emit('open-lightbox', 'setting-edit')">修改密碼</button>
                <button type="button" class="btn btn-option" @click="$emit('open-lightbox', 'setting-stock')">庫存校正</button>
            </div>
        </div>
        </div>
        </div>
    </div>
    `
}
const Log = {
    template: `
    <div id="return-log" class="return-log page">
        <h1>回報日誌</h1>
        <div class="page-scroll">
        <div class="d-flex justify-content-center">
            <div class="content">
                <h4 v-if="new Date().getHours() < 18">{{ new Date().addDays(-1).format("yyyy-MM-dd") }}未回報人員</h4>
                <h4 v-else>{{ new Date().format("yyyy-MM-dd") }}未回報人員</h4>
                <table class="table table-sm table-striped" v-if="reportlog.length > 0">
                    <tbody>
                        <tr>
                            <th scope="col">姓名</th>
                            <th scope="col">電話</th>
                        </tr>
                        <tr v-for="item in reportlog">
                            <td>
                            <span class="person-permission active" v-if="item.permission == 'manager'">主管</span>
                            <span class="person-permission active" v-else-if="item.permission == 'admin'">管理員</span>
                            <span class="person-permission" v-else>業務</span> {{ item.name }}</td>
                            <td>{{ item.phone }}</td>
                        </tr>
                    </tbody>
                </table>
                <p class="empty" v-if="reportlog.length === 0">無</p>
            </div>
        </div>
        </div>
    </div>
    `,
    props: ['reportlog'],
    methods: {
        showLog(){
            setTimeout(() => {
                fetch('https://pica957.appspot.com/v1/log/report', {
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
                            vm.reportLog = json;
                        }); 
                    }else if(data.status === 204){
                        vm.reportLog = [];
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
            vm.showLog();
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
        path: "/first",
        name: "first",
        component: First
    },
    {
        path: "/today",
        name: "today",
        component: Today
    },
    {
        path: "/all",
        name: "all",
        component: All
    },
    {
        path: "/store",
        name: "store",
        component: Store
    },
    {
        path: "/Report",
        name: "report",
        component: Report
    },
    {
        path: "/setting",
        name: "setting",
        component: Setting
    },
    {
        path: "/log",
        name: "log",
        component: Log
    },
    { path: '*', redirect: '/' }
]
let router = new VueRouter({
    // mode: 'history',
    history: true,
    routes: routes, //路由表
});
let id = 1, userToken = '';
let vm = new Vue({
    el: '#app',
    router,
    data: {
        isOpenLightbox: false,
        currentLightbox: '',
        userData: {
            account: '',
            password: '',
            token: '',
            permission: sessionStorage.getItem('permission') ? sessionStorage.getItem('permission') : ''
        },
        dataToday: [],
        dataAll: {},
        dataStore: {},
        reportReturn: [],
        reportLog: {},
        currentStore: sessionStorage.getItem('currentStore') ? sessionStorage.getItem('currentStore') : '',
        isSettingStock: false
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
                                                if(json.permission == 'manager' || json.permission == 'sales' || json.permission == 'admin'){
                                                    sessionStorage.setItem('userToken', json.token);
                                                    vm.userData.permission = json.permission;
                                                    sessionStorage.setItem('permission', json.permission);
                                                    vm.hintGreen('登入成功');
                                                    switch(json.state){
                                                        case 'reset':
                                                        case 'normal':
                                                            router.push({ name: "today"});
                                                            break;
                                                        case 'init':
                                                            router.push({ name: "first"});
                                                            break;
                                                    }      
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
                sessionStorage.setItem('permission', '');
                sessionStorage.setItem('chooseStore', '');
                sessionStorage.setItem('choosePeople', '');
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
        firstLogin () {  //console.log('firstLogin');
            var data = {
                pwd: {
                    original: document.querySelector("#userOrigin").value,
                    new: document.querySelector("#userNew").value,
                    confirm: document.querySelector("#userConfirm").value
                },
                stock: parseInt(document.querySelector("#userStock").value),
                performance:  parseInt(document.querySelector("#userPerformance").value)
            };
            // console.log(JSON.stringify(data));

            $('#load').show();
            fetch('https://pica957.appspot.com/v1/setting/init', {
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
                    vm.hintGreen('註冊成功，請重新登入！');
                    router.push({ name: "login"})  //回登入頁
                    sessionStorage.setItem('userToken', '');
                }else if(response.status === 500){
                    vm.hintRed('伺服器錯誤，請稍候再試');
                }else if(response.status === 400){
                    console.log('Failed:', response);
                    vm.hintRed('格式錯誤，請重新填寫資料');
                    document.querySelector("#userOrigin").value = ''; //清除密碼
                    document.querySelector("#userNew").value = ''; //清除密碼
                    document.querySelector("#userConfirm").value = ''; //清除密碼
                }
                $('#load').hide();
            });
        },
        showDate (date){            
            fetch('https://pica957.appspot.com/v1/trend/daily?date=' + date, {
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
                        vm.dataToday = json;
                    }); 
                }else if(data.status === 204){
                    vm.dataToday = [];
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
        showMonthALL (date) {
            fetch('https://pica957.appspot.com/v1/trend/category?date=' + date, {
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
                        vm.dataAll = json;
                    }); 
                }else if(data.status === 204){
                    vm.dataAll = [];
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
        showMonthStore (date) {
            fetch('https://pica957.appspot.com/v1/trend/category?c=' + sessionStorage.getItem('currentStore') + '&date=' + date, {
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
        updatePassword() {  //console.log('updatePassword');
            // var originPwd = document.querySelector("#changeOrigin").value;
            var newPwd = document.querySelector("#changeNew").value;
            var confirmPwd = document.querySelector("#changeConfirm").value;
            // if(originPwd != this.userData.password){
            //     vm.hintRed('舊密碼輸入錯誤，請重新輸入');
            //     document.querySelector("#changeOrigin").value = ''; //清除密碼
            //     document.querySelector("#changeNew").value = ''; //清除密碼
            //     document.querySelector("#changeConfirm").value = ''; //清除密碼
            //     return;
            // }
            if(newPwd != confirmPwd){
                vm.hintRed('新密碼輸入錯誤，請重新輸入');
                document.querySelector("#changeOrigin").value = ''; //清除密碼
                document.querySelector("#changeNew").value = ''; //清除密碼
                document.querySelector("#changeConfirm").value = ''; //清除密碼
                return;
            }
            
            var data = {
                new: newPwd,
                confirm: confirmPwd
            };
            // console.log(JSON.stringify(data));
            $('#load').show();
            fetch('https://pica957.appspot.com/v1/setting/pwd', {
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
                    vm.hintGreen('密碼更新成功，請重新登入！');
                    router.push({ name: "login"})  //回登入頁
                    sessionStorage.setItem('userToken', '');
                    vm.closeLightbox();  //關閉lightbox
                }else if(response.status === 500){
                    vm.hintRed('伺服器錯誤，請稍候再試');
                }else if(response.status === 400){
                    console.log('Failed:', response);
                    vm.hintRed('密碼更新錯誤，請包含八個字母以上的英文、數字和符號');
                    document.querySelector("#changeOrigin").value = ''; //清除密碼
                    document.querySelector("#changeNew").value = ''; //清除密碼
                    document.querySelector("#changeConfirm").value = ''; //清除密碼
                }else if(data.status === 401){
                    vm.hintRed('登入失效，請重新登入！');
                    router.push({ name: "login"});
                }
                $('#load').hide();
            });
            // var user = firebase.auth().currentUser;
            // user.updatePassword(newPwd).then(function() {
            //     alert('更新成功，請重新登入');
            //     this.logout();
            // }).catch(function(error) {
            //     console.log(error)
            // });
        },
        updateStock() {  //console.log('updateStock');
            var num = parseInt(document.querySelector("#userStock").value);
            if(num > -1){
                var data = {
                    value: num
                };
                $('#load').show();
                fetch('https://pica957.appspot.com/v1/setting/stock', {
                    method: 'PUT',
                    body: JSON.stringify(data),
                    headers: new Headers({
                        'Auth-Token': sessionStorage.getItem('userToken')
                    })
                })
                // .then(res => res.json())
                .catch(error => console.error('Error:', error))
                .then(response => {
                    if(response.status === 200){           
                        // console.log('Success:', response);
                        vm.hintGreen('更新成功');
                        vm.closeLightbox();  //關閉lightbox
                    }else if(response.status === 500){
                        vm.hintRed('伺服器錯誤，請稍候再試');
                    }else if(response.status === 400){
                        console.log('Failed:', response);
                        vm.hintRed('更新錯誤');
                    }
                    $('#load').hide();
                })
            }else{
                vm.hintRed('請輸入正確數字')
            }
        },
        sendReport() {  //console.log('sendReport');
            var answers = [];
            $('.return-value').each(function(i){
                // console.log(i);
                // console.log($(this).val());
                var answer = {
                    name: vm.reportReturn[i].name,
                    unit: vm.reportReturn[i].unit,
                    hasText: vm.reportReturn[i].hasText,
                    isShow: true,
                    value: Number($(this).val())
                };
                if(vm.reportReturn[i].hasText){
                    answer.msg = $('#return-msg'+i).val();
                }
                answers.push(answer);
            });
            var todayDate = $('#select-report-date').val();
            var data = {
                // date: new Date().toJSON(),
                date: todayDate,
                answers: answers
            };
            console.log(JSON.stringify(data));
            $('#load').show();
            fetch('https://pica957.appspot.com/v1/report', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: new Headers({
                    'Auth-Token': sessionStorage.getItem('userToken')
                })
            })
            // .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                if(response.status === 200){           
                    // console.log('Success:', response);
                    vm.hintGreen('回報成功');
                    router.push({ name: "today"});
                }else if(response.status === 500){
                    vm.hintRed('伺服器錯誤，請稍候再試');
                }else if(response.status === 400){
                    console.log('Failed:', response);
                    vm.hintRed('回報錯誤');
                }
                $('#load').hide();
            });
            // .then(response => {
            //     if(response.ok === true){
            //         // console.log('Success:', response);
            //         vm.hintGreen('回報成功');
            //         $('.return-value').val('');
            //         $('.return-msg').val('');
            //     }else{
            //         console.log('Failed:', response);
            //         vm.hintRed('回報錯誤');
            //     }
            //     $('#load').hide();
            // });
        },
        goBack () {
            window.history.length > 1
                ? this.$router.go(-1)
                : this.$router.push('/')
        },
        openLightbox(n) {
            this.isOpenLightbox = true;
            this.currentLightbox = n;
            return 'lightbox-' + this.currentLightbox;
        },
        closeLightbox() {
            this.isOpenLightbox = false;
            this.currentLightbox = '';
        },
        chooseStore(index) {
            sessionStorage.setItem('currentStore', index);
            this.currentStore = sessionStorage.getItem('currentStore');
            router.push({ name: "store"});
        },
        selectDate() {
            $('#select-date').datepicker({
                language: 'zh',
                maxDate: new Date(),
                autoClose: true,
                onSelect: function (fd, d, picker) {
                    vm.showDate(fd);
                }
            });
            $('#select-report-date').datepicker({
                language: 'zh',
                minDate: new Date().addDays(-1),
                maxDate: new Date(),
                autoClose: true,
                onSelect: function (fd, d, picker) {
                    vm.showDate(fd);
                }
            });
        },
        selectMonth() {
            $('#select-month').datepicker({
                language: 'zh',
                // view: 'months',
                // minView: 'months',
                // dateFormat: 'mm',
                autoClose: true,
                onSelect: function (fd, d, picker) {
                    // console.log(fd);
                    vm.showMonthALL(fd);
                }
            });
            $('#select-month2').datepicker({
                language: 'zh',
                view: 'months',
                // minView: 'months',
                // dateFormat: 'mm',
                autoClose: true,
                onSelect: function (fd, d, picker) {
                    // console.log(fd);
                    vm.showMonthStore(fd);
                }
            });
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
    next()
    // var userToken = sessionStorage.getItem('userToken');
    // if(!userToken){
    //     // if(to.name != 'login'){
    //     //     !!userToken ? next() : next('/');
    //     // }
    // }
})