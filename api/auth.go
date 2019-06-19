package api

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/94peter/pica/util"

	"github.com/94peter/pica/model"
)

type AuthAPI bool

func (api AuthAPI) Enable() bool {
	return bool(api)
}

func (api AuthAPI) GetAPIs() *[]*APIHandler {
	return &[]*APIHandler{
		&APIHandler{Path: "/v1/token", Next: api.tokenEndpoint, Method: "GET", Auth: false},
		&APIHandler{Path: "/v1/setting/init", Next: api.initEndpoint, Method: "PUT", Auth: true},
		&APIHandler{Path: "/v1/setting/pwd", Next: api.pwdEndpoint, Method: "PUT", Auth: true},
		&APIHandler{Path: "/v1/setting/stock", Next: api.stockEndpoint, Method: "PUT", Auth: true},
	}
}

type pwdInput struct {
	NewPwd     string `json:"new"`
	ConfirmPwd string `json:"confirm"`
}

func (pi *pwdInput) isValid() error {
	if ok, err := util.IsValidPwd(pi.NewPwd); !ok {
		return err
	}
	if pi.NewPwd != pi.ConfirmPwd {
		return errors.New("Confirm password error")
	}
	return nil
}

func (api *AuthAPI) pwdEndpoint(w http.ResponseWriter, req *http.Request) {
	ii := pwdInput{}
	err := json.NewDecoder(req.Body).Decode(&ii)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Invalid JSON format"))
		return
	}

	if err := ii.isValid(); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}
	account := req.Header.Get("AuthAccount")
	mm := model.GetMemberModel(di)

	if err := mm.ChangePwd(account, ii.NewPwd); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}
	w.Write([]byte("ok"))
}

type initInput struct {
	Pwd struct {
		Original string `json:"original"`
		New      string `json:"new"`
		Confirm  string `json:"confirm"`
	} `json:"pwd"`
	Stock       float32 `json:"stock"`
	Performance float32 `json:"performance"`
}

func (ii *initInput) valid(u *model.User) (bool, error) {
	if ii.Stock < 0 {
		return false, errors.New("stock must bigger than 0")
	}
	if ii.Performance < 0 {
		return false, errors.New("performance must bigger than 0")
	}
	if ii.Pwd.Original == "" {
		return false, errors.New("original pwd not be empty")
	}
	if len(ii.Pwd.New) < 8 {
		return false, errors.New("new pwd length must bigger than 8")
	}
	if ii.Pwd.New != ii.Pwd.Confirm {
		return false, errors.New("new pwd & confirm pwd not match")
	}

	if util.MD5(ii.Pwd.Original) != u.Pwd {
		return false, errors.New("pwd not match")
	}

	return true, nil
}

func (ii *initInput) exec(u *model.User) error {
	mm := model.GetMemberModel(di)

	if err := mm.ChangePwd(u.Account, ii.Pwd.New); err != nil {
		return err
	}

	u.Stock = ii.Stock
	u.Performance = ii.Performance
	u.State = model.UserStateNormal
	u.Pwd = util.MD5(ii.Pwd.New)
	return mm.UpdateUser(u)
}

func (api *AuthAPI) initEndpoint(w http.ResponseWriter, req *http.Request) {
	ii := initInput{}
	err := json.NewDecoder(req.Body).Decode(&ii)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Invalid JSON format"))
		return
	}

	account := req.Header.Get("AuthAccount")
	mm := model.GetMemberModel(di)
	user := mm.GetMember(account)
	if ok, err := ii.valid(user); !ok {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	if err := ii.exec(user); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}
	w.Write([]byte("OK"))
}

type stockInput struct {
	Value float32 `json:"value"`
}

func (si *stockInput) valid() (bool, error) {
	if si.Value < 0 {
		return false, errors.New("value must bigger than 0")
	}
	return true, nil
}

func (si *stockInput) exec(account string) error {
	mm := model.GetMemberModel(di)
	user := mm.GetMember(account)
	user.Stock = si.Value
	user.State = model.UserStateNormal
	return mm.UpdateUser(user)
}

func (api *AuthAPI) stockEndpoint(w http.ResponseWriter, req *http.Request) {
	si := stockInput{}
	err := json.NewDecoder(req.Body).Decode(&si)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}
	if ok, err := si.valid(); !ok {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	account := req.Header.Get("AuthAccount")
	if err := si.exec(account); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}
	w.Write([]byte("OK"))
}

// 交換firebase token to pica token
func (api *AuthAPI) tokenEndpoint(w http.ResponseWriter, req *http.Request) {
	ftoken := req.Header.Get("Auth-Token")
	if ftoken == "" {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	mm := model.GetMemberModel(di)
	user := mm.VerifyToken(ftoken)
	if user == nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	token, err := user.GetToken(di.GetJWTConf())
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		di.GetLog().Err(err.Error())
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"token":      token,
		"state":      user.State,
		"permission": user.Permission,
	})
}
