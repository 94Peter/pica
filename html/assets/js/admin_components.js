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

Vue.component('store-add', { 
    template: `
    <div id="content-store-add" class="lightbox-content">
        <h2>分店名稱</h2>
        <form>
            <div class="form-group row">
                <div class="col-12">
                    <input type="text" class="form-control" id="storeName" placeholder="請輸入分店名稱">
                </div>
            </div>
            <div class="form-group checkBlock">
                <button type="button" class="btn btn-primary" @click="$emit('add-store')">新增</button>
            </div>
        </form>
    </div>
    `
})

Vue.component('person-add', { 
    template: `
    <div id="content-person-add" class="lightbox-content">
        <h2>人員資料</h2>
        <form>
            <div class="form-group row">
                <label for="personName" class="col-3 col-form-label">姓名</label>
                <div class="col-9">
                    <input type="text" class="form-control" id="personName" placeholder="請輸入姓名">
                </div>
            </div>
            <div class="form-group row">
                <label for="personPhone" class="col-3 col-form-label">電話</label>
                <div class="col-9">
                    <input type="text" class="form-control" id="personPhone" placeholder="請輸入電話">
                </div>
            </div>
            <div class="form-group row">
                <label for="personEmail" class="col-3 col-form-label">Email</label>
                <div class="col-9">
                    <input type="text" class="form-control" id="personEmail" placeholder="請輸入Email">
                </div>
            </div>
            <div class="form-group row">
                <label for="personPermission" class="col-3 col-form-label">權限</label>
                <div class="col-9 d-flex">
                    <div class="form-check col-6">
                        <input class="form-check-input" type="radio" name="person-add1" id="person-add1-1" value="manager">
                        <label class="form-check-label" for="person-add1-1">主管</label>
                    </div>
                    <div class="form-check col-6">
                        <input class="form-check-input" type="radio" name="person-add1" id="person-add1-2" value="sales" checked>
                        <label class="form-check-label" for="person-add1-2">業務</label>
                    </div>
                </div>
            </div>
            <div class="form-group checkBlock">
                <button type="button" class="btn btn-primary" @click="$emit('add-people')">新增</button>
            </div>
        </form>
    </div>
    `
})

Vue.component('person-btns', { 
    template: `
    <div id="content-person-btns" class="lightbox-content">
        <div class="row">
            <div class="col-12">
                <button type="button" class="btn btn-person-turn btn-action btn-info" @click="$emit('open-lightbox', 'person-category')">調店</button>
                <button type="button" class="btn btn-person-resign btn-action btn-info" @click="$emit('open-lightbox', 'person-delete')">離職</button>
                <button type="button" class="btn btn-person-permission btn-action btn-info" @click="$emit('open-lightbox', 'person-permission')">修改權限</button>
            </div>
        </div>
    </div>
    `
})

Vue.component('person-category', { 
    template: `
    <div id="content-person-category" class="lightbox-content">
        <h2>類別管理</h2>
        <div class="row">
            <div class="col-12">
                <div class="form-check form-check-inline col-4" v-for="(item, index) in datastore">
                    <input class="form-check-input" type="radio" name="person-category" :id="'person-category-' + index" :value="item" :checked="item == currentstore">
                    <label class="form-check-label" :for="'person-category-' + index" >{{ item }}</label>
                </div>
            </div>
        </div>
        <p class="currTxt">目前類別：{{ currentstore }}</p>
        <div class="row checkBlock">
            <div class="col-6">
                <button type="button" class="btn btn-primary" @click="$emit('transfer')">確定</button>
            </div>
            <div class="col-6">
                <button type="button" class="btn btn-secondary" @click="$emit('close-lightbox')">取消</button>
            </div>
        </div>
    </div>
    `,
    props: ['datastore', 'currentstore']
})

Vue.component('person-delete', { 
    template: `
    <div id="content-person-delete" class="lightbox-content">
        <h2>解除人員？</h2>
        <div class="row checkBlock">
            <div class="col-6">
                <button type="button" class="btn btn-primary" @click="$emit('leave')">確定</button>
            </div>
            <div class="col-6">
                <button type="button" class="btn btn-secondary" @click="$emit('close-lightbox')">取消</button>
            </div>
        </div>
    </div>
    `
})

Vue.component('person-permission', { 
    template: `
    <div id="content-person-permission" class="lightbox-content">
        <h2>請選擇權限</h2>
        <div class="row">
            <div class="col-12 d-flex">
                <div class="form-check form-check-inline col-6">
                    <input class="form-check-input" type="radio" name="person-permission" id="person-permission-1" value="manager" :checked="currentpermission == 'manager'">
                    <label class="form-check-label" for="person-permission-1">主管</label>
                </div>
                <div class="form-check form-check-inline col-6">
                    <input class="form-check-input" type="radio" name="person-permission" id="person-permission-2" value="sales" :checked="currentpermission == 'sales'">
                    <label class="form-check-label" for="person-permission-2">業務</label>
                </div>
            </div>
        </div>
        <p class="currTxt">目前類別：<template v-if="currentpermission == 'manager'">主管</template><template v-else>業務</template></p>
        <div class="row checkBlock">
            <div class="col-6">
                <button type="button" class="btn btn-primary" @click="$emit('change-permission')">確定</button>
            </div>
            <div class="col-6">
                <button type="button" class="btn btn-secondary" @click="$emit('close-lightbox')">取消</button>
            </div>
        </div>
    </div>
    `,
    props: ['currentpermission']
})

Vue.component('item-add', { 
    template: `
    <div id="content-item-add" class="lightbox-content">
        <h2>新增項目資料</h2>
        <form>
            <div class="form-group row">
                <label for="itemName" class="col-3 col-form-label">項目名稱</label>
                <div class="col-9">
                    <input type="text" class="form-control" id="itemName" placeholder="請輸入項目名稱">
                </div>
            </div>
            <div class="form-group row">
                <label for="itemUnit" class="col-3 col-form-label">單位</label>
                <div class="col-9">
                    <input type="text" class="form-control" id="itemUnit" placeholder="例如：件">
                </div>
            </div>
            <div class="form-group row">
                <label for="personPermission" class="col-3 col-form-label">今日進展</label>
                <div class="col-9 d-flex">
                    <div class="form-check form-check-inline col-6">
                        <input class="form-check-input" type="radio" name="itemText" id="itemText-1" value="true">
                        <label class="form-check-label" for="itemText-1">YES</label>
                    </div>
                    <div class="form-check form-check-inline col-6">
                        <input class="form-check-input" type="radio" name="itemText" id="itemText-2" value="false" checked>
                        <label class="form-check-label" for="itemText-2">NO</label>
                    </div>
                </div>
            </div>
            <div class="form-group row">
                <label for="personPermission" class="col-3 col-form-label">動態顯示</label>
                <div class="col-9 d-flex">
                    <div class="form-check form-check-inline col-6">
                        <input class="form-check-input" type="radio" name="itemShow" id="itemShow-1" value="true">
                        <label class="form-check-label" for="itemShow-1">YES</label>
                    </div>
                    <div class="form-check form-check-inline col-6">
                        <input class="form-check-input" type="radio" name="itemShow" id="itemShow-2" value="false" checked>
                        <label class="form-check-label" for="itemShow-2">NO</label>
                    </div>
                </div>
            </div>
            <div class="form-group checkBlock">
                <button type="button" class="btn btn-primary" @click="$emit('add-report')">新增</button>
            </div>
        </form>
    </div>
    `
})

Vue.component('item-btns', { 
    template: `
    <div id="content-item-btns" class="lightbox-content">
        <div class="row">
            <div class="col-12">
                <button type="button" class="btn btn-item-edit btn-action btn-info" @click="$emit('open-lightbox', 'item-edit')">修改</button>
                <button type="button" class="btn btn-item-delete btn-action btn-info" @click="$emit('open-lightbox', 'item-delete')">刪除</button>
            </div>
        </div>
    </div>
    `
})

Vue.component('item-edit', { 
    template: `
    <div id="content-item-edit" class="lightbox-content">
        <h2>修改項目資料</h2>
        <form>
            <div class="form-group row">
                <label for="itemName2" class="col-3 col-form-label">項目名稱</label>
                <div class="col-9">
                    <input type="text" class="form-control" id="itemName2" placeholder="請輸入姓名" :value="datareport[currentitem].name">
                </div>
            </div>
            <div class="form-group row">
                <label for="itemUnit2" class="col-3 col-form-label">單位</label>
                <div class="col-9">
                    <input type="text" class="form-control" id="itemUnit2" placeholder="請輸入單位" :value="datareport[currentitem].unit">
                </div>
            </div>
            <div class="form-group row">
                <label for="personPermission" class="col-3 col-form-label">今日進展</label>
                <div class="col-9 d-flex">
                    <div class="form-check form-check-inline col-6">
                        <input class="form-check-input" type="radio" name="itemText2" id="itemText2-1" value="true" :checked="datareport[currentitem].hasText">
                        <label class="form-check-label" for="itemText2-1">YES</label>
                    </div>
                    <div class="form-check form-check-inline col-6">
                        <input class="form-check-input" type="radio" name="itemText2" id="itemText2-2" value="false" :checked="!datareport[currentitem].hasText">
                        <label class="form-check-label" for="itemText2-2">NO</label>
                    </div>
                </div>
            </div>
            <div class="form-group row">
                <label for="personPermission" class="col-3 col-form-label">動態顯示</label>
                <div class="col-9 d-flex">
                    <div class="form-check form-check-inline col-6">
                        <input class="form-check-input" type="radio" name="itemShow2" id="itemShow2-1" value="true" :checked="datareport[currentitem].isShow">
                        <label class="form-check-label" for="itemShow2-1">YES</label>
                    </div>
                    <div class="form-check form-check-inline col-6">
                        <input class="form-check-input" type="radio" name="itemShow2" id="itemShow2-2" value="false" :checked="!datareport[currentitem].isShow">
                        <label class="form-check-label" for="itemShow2-2">NO</label>
                    </div>
                </div>
            </div>
            <div class="form-group d-flex checkBlock">
                <div class="col-6">
                    <button type="button" class="btn btn-primary" @click="$emit('modify-report')">確定</button>
                </div>
                <div class="col-6">
                    <button type="button" class="btn btn-secondary" @click="$emit('close-lightbox')">取消</button>
                </div>
            </div>
        </form>
    </div>
    `,
    props: ['datareport', 'currentitem']
})

Vue.component('item-delete', { 
    template: `
    <div id="content-item-delete" class="lightbox-content">
        <h2>刪除項目？</h2>
        <div class="row checkBlock">
            <div class="col-6">
                <button type="button" class="btn btn-primary" @click="$emit('delete-report')">確定</button>
            </div>
            <div class="col-6">
                <button type="button" class="btn btn-secondary" @click="$emit('close-lightbox')">取消</button>
            </div>
        </div>
    </div>
    `
})

Vue.component('raw-displayer', {
    template: `  <div>
                    <h3>{{ title }}</h3>
                    <pre>{{ valueString }}</pre>
                </div>`,
    props : {
        name: "raw-displayer",
        title: {
            required: true,
            type: String
        },
        value: {
            required: true
        }
    },
    computed: {
        valueString() {
            return JSON.stringify(this.value, null, 2);
        }
    },

})