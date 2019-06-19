package api

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/94peter/pica/util"

	"github.com/94peter/pica/model"
	"github.com/94peter/pica/permission"
)

type TrendAPI bool

func (api TrendAPI) Enable() bool {
	return bool(api)
}

func (api TrendAPI) GetAPIs() *[]*APIHandler {
	return &[]*APIHandler{
		&APIHandler{Path: "/v1/trend/daily", Next: api.getDailyTrendItemEndpoint, Method: "GET", Auth: true, Group: permission.Frontend},
		&APIHandler{Path: "/v1/trend/category", Next: api.getCategoryTrendEndpoint, Method: "GET", Auth: true, Group: permission.Frontend},
	}
}

func (api *TrendAPI) getDailyTrendItemEndpoint(w http.ResponseWriter, req *http.Request) {
	queryVars := util.GetQueryValue(req, []string{"c", "date"}, false)
	var queryDate time.Time
	var err error
	date, ok := (*queryVars)["date"]
	if !ok {
		queryDate = time.Now().In(di.GetLocation())
		addDay := -1
		if queryDate.Hour() > 18 {
			addDay = 0
		}
		queryDate = time.Date(queryDate.Year(), queryDate.Month(), queryDate.Day()+addDay, 0, 0, 0, 0, queryDate.Location())
	} else {
		queryDate, err = time.Parse(DateFormat, date.(string))
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
			return
		}
		queryDate = queryDate.In(di.GetLocation())
		queryDate = time.Date(queryDate.Year(), queryDate.Month(), queryDate.Day(), 0, 0, 0, 0, queryDate.Location())
	}

	tm := model.GetTrendModel(di)
	result := tm.GetDailyData(queryDate)
	if len(result) == 0 {
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
func (api *TrendAPI) getCategoryTrendEndpoint(w http.ResponseWriter, req *http.Request) {
	queryVars := util.GetQueryValue(req, []string{"c", "date"}, false)
	var queryDate time.Time
	var err error
	date, ok := (*queryVars)["date"]
	if !ok {
		queryDate = time.Now().In(di.GetLocation())
		addDay := -1
		if queryDate.Hour() > 18 {
			addDay = 0
		}
		queryDate = time.Date(queryDate.Year(), queryDate.Month(), queryDate.Day()+addDay, 0, 0, 0, 0, queryDate.Location())
	} else {
		queryDate, err = time.Parse(DateFormat, date.(string))
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
			return
		}
		queryDate = queryDate.In(di.GetLocation())
		queryDate = time.Date(queryDate.Year(), queryDate.Month(), queryDate.Day(), 0, 0, 0, 0, queryDate.Location())
	}

	c, ok := (*queryVars)["c"]
	tm := model.GetTrendModel(di)
	today := time.Date(queryDate.Year(), queryDate.Month(), 1, 0, 0, 0, 0, queryDate.Location())
	end := time.Date(queryDate.Year(), queryDate.Month()+1, 1, 0, 0, 0, 0, queryDate.Location())
	var result *model.MonthTrend
	if !ok {
		result = tm.GetAreaData(today, end)
	} else {
		result = tm.GetCategoryData(c.(string), today, end)
	}
	if result == nil {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	jsonByte, _ := result.ToJSON()
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonByte)
	return
}
