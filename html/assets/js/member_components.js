Vue.component('forgot', { 
    template: `
    <div id="content-forgot" class="lightbox-content">
        <h2>請輸入 Email 帳號</h2>
        <form>
            <div class="form-group row">
                <div class="col-12">
                    <input type="text" class="form-control" id="userforgot" placeholder="請輸入Email">
                </div>
            </div>
            <div class="form-group checkBlock">
                <button type="button" class="btn btn-primary" @click="$emit('forgot-pwd')">送出</button>
            </div>
        </form>
    </div>
    `
})

Vue.component('menu2', { 
    template: `
    <div id="content-menu" class="lightbox-content">
        <div class="row">
            <div class="col-12">
                <router-link class="btn btn-menu-day btn-action btn-info" v-on:click.native="$emit('close-lightbox')" to="today">今日進展</router-link>
                <router-link class="btn btn-menu-all btn-action btn-info" v-on:click.native="$emit('close-lightbox')" to="all">全區動態</router-link>
                <router-link class="btn btn-menu-self btn-action btn-info" v-on:click.native="$emit('close-lightbox')" to="report">個人回報</router-link>
                <router-link class="btn btn-menu-setting btn-action btn-info" v-on:click.native="$emit('close-lightbox')" to="setting">設　　定</router-link>
                <router-link class="btn btn-menu-log btn-action btn-info" v-on:click.native="$emit('close-lightbox')" to="log" v-if="userdata.permission != 'sales'">回報日誌</router-link>
                <button type="button" class="btn btn-menu-logout btn-action btn-secondary" @click="$emit('log-out')">登　　出</button>
            </div>
        </div>
    </div>
    `,
    props: ['userdata']
})

Vue.component('return-edit', { 
    template: `
    <div id="content-return-edit" class="lightbox-content">
        <h2>此日已回報，修改資料？</h2>
        <div class="row checkBlock">
            <div class="col-6">
                <button type="button" class="btn btn-primary">確定</button>
            </div>
            <div class="col-6">
                <button type="button" class="btn btn-secondary" @click="$emit('close-lightbox')">取消</button>
            </div>
        </div>
    </div>
    `
})

Vue.component('return-check', { 
    template: `
    <div id="content-return-check" class="lightbox-content">
        <h2>確認修改內容？</h2>
        <table class="table table-sm table-striped">
            <tbody>
                <tr>
                    <th scope="col"></th>
                    <th scope="col">修改前</th>
                    <th scope="col">修改後</th>
                </tr>
                <tr>
                    <th scope="row">委託</th>
                    <td>7</td>
                    <td>10</td>
                </tr>
                <tr>
                    <th scope="row">委託進度</th>
                    <td>0000</td>
                    <td>123456</td>
                </tr>
                <tr>
                    <th scope="row">帶看進度</th>
                    <td>11111</td>
                    <td>12345467</td>
                </tr>
                <tr>
                    <th scope="row">成交件數</th>
                    <td>2（件）</td>
                    <td>1（件）</td>
                </tr>
                <tr>
                    <th scope="row">成交業績</th>
                    <td>1,500,000</td>
                    <td>2,000,000</td>
                </tr>
            </tbody>
        </table>
        <div class="row checkBlock">
            <div class="col-6">
                <button type="button" class="btn btn-primary">確定</button>
            </div>
            <div class="col-6">
                <button type="button" class="btn btn-secondary" @click="$emit('close-lightbox')">取消</button>
            </div>
        </div>
    </div>
    `
})

Vue.component('setting-edit', { 
    template: `
    <div id="content-setting-edit" class="lightbox-content">
        <h2>修改密碼</h2>
        <form>
            <div class="form-group form-group5">
                <label for="changeOrigin" class="col-form-label">舊密碼</label>
                <input type="password" class="form-control" id="changeOrigin" placeholder="請輸入舊密碼">
            </div>
            <div class="form-group form-group5">
                <label for="changeNew" class="col-form-label">新密碼</label>
                <input type="password" class="form-control" id="changeNew" placeholder="請輸入新密碼">
                <small id="emailHelp" class="form-text">＊八個字母以上的英文、數字和符號</small>
            </div>
            <div class="form-group form-group5">
                <label for="changeConfirm" class="col-form-label">確認密碼</label>
                <input type="password" class="form-control" id="changeConfirm" placeholder="請再次輸入新密碼">
            </div>
        </form>
        <div class="row checkBlock">
            <div class="col-6">
                <button type="button" class="btn btn-primary" @click="$emit('update-password')">確定</button>
            </div>
            <div class="col-6">
                <button type="button" class="btn btn-secondary" @click="$emit('close-lightbox')">取消</button>
            </div>
        </div>
    </div>
    `
})

Vue.component('setting-stock', { 
    template: `
    <div id="content-setting-stock" class="lightbox-content">
        <h2>請輸入庫存數量</h2>
        <form>
            <div class="form-group form-group5">
                <label for="userCheck3" class="col-form-label">庫存數量</label>
                <input type="number" class="form-control" id="userStock">
            </div>
        </form>
        <div class="row checkBlock">
            <div class="col-6">
                <button type="button" class="btn btn-primary" @click="$emit('update-stock')">確定</button>
            </div>
            <div class="col-6">
                <button type="button" class="btn btn-secondary" @click="$emit('close-lightbox')">取消</button>
            </div>
        </div>
    </div>
    `
})

