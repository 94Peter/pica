package main

// [START import]
import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/94peter/pica/permission"

	"github.com/94peter/pica/model"
	"github.com/94peter/pica/util"

	"github.com/94peter/pica/resource/sms"

	"dforcepro.com/resource"
	"dforcepro.com/resource/logger"
	"github.com/gorilla/mux"
	yaml "gopkg.in/yaml.v2"

	mapi "github.com/94peter/pica/api"
	"github.com/94peter/pica/middle"
	mdb "github.com/94peter/pica/resource/db"
)

// [END import]
// [START main_func]

func main() {
	// [START setting_port]
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
		log.Printf("Defaulting to port %s", port)
	}

	env := os.Getenv("ENV")
	if env == "" {
		env = "dev"
		log.Printf("Defaulting to ENV %s", env)
	}

	timezone := os.Getenv("TIMEZONE")
	if timezone == "" {
		timezone = "Asia/Taipei"
		log.Printf("Defaulting to timezone %s", timezone)
	}

	myDI := GetConf(env, timezone)
	router := mux.NewRouter()
	initAcc(myDI)
	//middleConf := di.APIConf.Middle
	middle.SetDI(myDI)
	middlewares := middle.GetMiddlewares(
		// middle.DBMiddle(true),
		middle.DebugMiddle(true),
		middle.AuthMiddle(true),
		// middle.BasicAuthMiddle(middleConf.Auth),
	)

	apiConf := &mapi.APIconf{Router: router, MiddleWares: middlewares}
	mapi.SetDI(myDI)
	mapi.InitAPI(apiConf, mapi.AuthAPI(true), mapi.AdminAPI(true), mapi.ReportAPI(true), mapi.TrendAPI(true))
	log.Printf("Listening on port %s", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", port), router))
	// [END setting_port]
}

type di struct {
	// Mongodb  *db.Mongo         `yaml:"mongodb,omitempty"`
	// Redis    *db.Redis         `yaml:"redis,omitempty"`
	// Elastic  *db.Elastic       `yaml:"elastic,omitempty"`
	DBconf  *mdb.DBConf      `yaml:"dbConf"`
	Log     logger.Logger    `yaml:"log,omitempty"`
	APIConf resource.APIConf `yaml:"api,omitempty"`
	// SysMap   map[string]string `yaml:"sysMap,omitempty"`
	Location  *time.Location   `yaml:"-"`
	SMSConf   *sms.SMSConf     `yaml:"smsConf"`
	JWTConf   *util.JwtConf    `yaml:"jwtConf"`
	TrendConf *model.TrendConf `yaml:"trend"`
	LoginURL  string           `yaml:"loginURL"`
	Init      struct {
		Email string `yaml:"email"`
		Name  string `yaml:"name"`
		Phone string `yaml:"phone"`
	} `yaml:"init"`
}

func (d *di) GetLoginURL() string {
	return d.LoginURL
}

func (d *di) GetAuth() mdb.InterAuth {
	return d.DBconf.GetAuth()
}

func (d *di) GetLog() logger.Logger {
	return d.Log
}

func (d *di) GetAPIConf() resource.APIConf {
	return d.APIConf
}

func (d *di) GetDB() mdb.InterDB {
	return d.DBconf.GetDB()
}

func (d *di) GetTSDB() mdb.InterTSDB {
	return d.DBconf.GetTSDB()
}

func (d *di) GetSMS() sms.InterSMS {
	return d.SMSConf.GetSMS()
}

func (d *di) GetJWTConf() *util.JwtConf {
	return d.JWTConf
}

func (d *di) GetTrendItems() []string {
	return d.TrendConf.DailyItem
}

func (d *di) GetLocation() *time.Location {
	return d.Location
}

// 初始化設定檔，讀YAML檔
func GetConf(env string, timezone string) *di {
	const confFileTpl = "conf/%s/config.yml"
	yamlFile, err := ioutil.ReadFile(fmt.Sprintf(confFileTpl, env))
	if err != nil {
		panic(err)
	}
	myDI := di{}
	err = yaml.Unmarshal(yamlFile, &myDI)
	if err != nil {
		panic(err)
	}
	loc, err := time.LoadLocation(timezone)
	if err != nil {
		panic(err)
	}

	myDI.Location = loc
	myDI.Log.StartLog()
	return &myDI
}

func initAcc(d *di) {
	// 建立第一個帳號
	memberModel := model.GetMemberModel(d)
	if u := memberModel.GetMember(d.Init.Phone); u != nil {
		return
	}
	u := &model.User{
		Account:    d.Init.Phone,
		Name:       d.Init.Name,
		Email:      d.Init.Email,
		Phone:      d.Init.Phone,
		Category:   permission.Admin,
		Permission: permission.Admin,
		Pwd:        model.GetRandPwd(8),
		State:      model.UserStateInit,
	}
	if err := memberModel.CreateUser(u); err != nil {
		d.Log.Err(err.Error())
	}
}

// [END main_func]

// [START indexHandler]

// indexHandler responds to requests with our greeting.
// func indexHandler(w http.ResponseWriter, r *http.Request) {
// 	if r.URL.Path != "/" {
// 		http.NotFound(w, r)
// 		return
// 	}
// 	fmt.Fprint(w, "Hello, World!")
// }
