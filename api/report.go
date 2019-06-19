package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/94peter/pica/util"

	"github.com/94peter/pica/model"
	"github.com/94peter/pica/permission"
)

type ReportAPI bool

func (api ReportAPI) Enable() bool {
	return bool(api)
}

func (api ReportAPI) GetAPIs() *[]*APIHandler {
	return &[]*APIHandler{
		&APIHandler{Path: "/v1/reportItem", Next: api.createReportItemEndpoint, Method: "POST", Auth: true, Group: permission.Backend},
		&APIHandler{Path: "/v1/reportItem", Next: api.getReportItemEndpoint, Method: "GET", Auth: true, Group: permission.All},
		&APIHandler{Path: "/v1/report", Next: api.createReportEndpoint, Method: "POST", Auth: true, Group: permission.Frontend},
		&APIHandler{Path: "/v1/report", Next: api.getReportEndpoint, Method: "GET", Auth: true, Group: permission.Frontend},
		&APIHandler{Path: "/v1/log/report", Next: api.getReportLog, Method: "GET", Auth: true, Group: permission.Frontend},
	}
}

func (api *ReportAPI) getReportEndpoint(w http.ResponseWriter, req *http.Request) {
	qVar := util.GetQueryValue(req, []string{"d"}, true)

	dateStr := (*qVar)["d"].(string)
	now := time.Now().In(di.GetLocation())
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	var qDate time.Time
	var err error
	if dateStr != "" {
		qDate, err = time.Parse(DateFormat, dateStr)
		qDate.In(di.GetLocation())
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("date format error"))
			return
		}
		if qDate.Sub(today).Hours() > 72 {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("only tree days ago can be queried"))
			return
		}
	} else {
		qDate = today
	}

	account := req.Header.Get("AuthAccount")
	sm := model.GetSalesModel(di)
	result := sm.GetAnswer(qDate, account)
	if result == nil {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	jsonByte, err := json.Marshal(result)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonByte)
}

func (api *ReportAPI) createReportItemEndpoint(w http.ResponseWriter, req *http.Request) {
	var reportItems []*model.ReportItem
	err := json.NewDecoder(req.Body).Decode(&reportItems)

	if err != nil {
		getLog().Debug(err.Error())
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Invalid JSON format"))
		return
	}

	for _, ri := range reportItems {
		if !ri.IsValid() {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
	}
	riModel := model.GetReportItmeModel(di)
	riModel.Item = reportItems
	err = riModel.Save()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}
	w.Write([]byte("ok"))
}

func (api *ReportAPI) getReportItemEndpoint(w http.ResponseWriter, req *http.Request) {
	riModel := model.GetReportItmeModel(di)
	data, err := riModel.Json()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(data)
}

type AnswerInput struct {
	DateStr string `json:"date"`
	date    time.Time
	Answers []*model.Answer `json:"answers"`
}

func (ai *AnswerInput) getDate() time.Time {
	if !ai.date.IsZero() {
		return ai.date
	}

	myDate, err := time.Parse(DateFormat, ai.DateStr)
	if err != nil {
		return time.Now().In(di.GetLocation())
	}
	myDate = myDate.In(di.GetLocation())
	myDate = myDate.Add(-8 * time.Hour)
	ai.date = myDate
	return ai.date
}

// 判斷日期是否正確 (當日18點後才能回報，只能回報三天前的資料)
func (ai *AnswerInput) isValidDate() bool {
	now := time.Now().In(di.GetLocation())
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())

	d := today.Sub(ai.getDate())
	// 當天六點後可以回報
	// if d.Nanoseconds() == 0 && now.Hour() >= model.AllowReportHour {
	// 	return true
	// }
	// 2天內的資料可以回報
	if d.Seconds() <= 86400 && d.Seconds() >= 0 { //3*24*60*60
		return true
	}
	return false
}

func (api *ReportAPI) createReportEndpoint(w http.ResponseWriter, req *http.Request) {
	var ai AnswerInput
	err := json.NewDecoder(req.Body).Decode(&ai)

	if err != nil {
		getLog().Debug(err.Error())
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Invalid JSON format"))
		return
	}

	if !ai.isValidDate() {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("report date error"))
		return
	}

	account := req.Header.Get("AuthAccount")
	mm := model.GetMemberModel(di)
	u := mm.GetMember(account)
	if u == nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("Not found account"))
		return
	}
	fmt.Println(*u)
	for _, a := range ai.Answers {
		a.Date = ai.getDate()
		a.U = u
	}

	sm := model.GetSalesModel(di)
	err = sm.Report(ai.Answers)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}
	w.Write([]byte("ok"))
}

func (api *ReportAPI) getReportLog(w http.ResponseWriter, req *http.Request) {
	sm := model.GetSalesModel(di)
	category := req.Header.Get("AuthCategory")
	result := sm.GetNotReportor(category)
	if len(result) == 0 {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}
