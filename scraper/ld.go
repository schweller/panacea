package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"reflect"
	"strconv"
	"strings"

	"github.com/gocolly/colly/v2"
	"github.com/gocolly/colly/v2/debug"
)

type FeedList struct {
	Status int
	Feed   []struct {
		Id int
	}
}

type Game struct {
	Id   int
	Body string
	Name string
	Meta struct {
		Link1 string `json:"link-01"`
		Link2 string `json:"link-02"`
		Link3 string `json:"link-03"`
		Link4 string `json:"link-04"`
	}
	Github string
	Event  int `json:"parent"`
	Path   string
	Magic  struct {
		Overall int `json:"grade-01-result"`
	}
}

type GameList struct {
	Status int
	Node   []Game
}

type EventNodeList struct {
	Status int
	Node   []Event
}

type Event struct {
	Id   int
	Body string
	Name string
	Path string
}

type Languages struct {
	Id        int
	Languages []interface{}
}

func join(strs []string) string {
	var sb strings.Builder
	for _, str := range strs {
		var foo string
		if str == strs[len(strs)-1] {
			foo = fmt.Sprintf("%s", str)
		} else {
			foo = fmt.Sprintf("%s+", str)
		}
		sb.WriteString(foo)
	}

	return sb.String()
}

func get_slug(url string, nodes []struct{ Id int }) string {
	var str_array []string
	for _, obj := range nodes {
		intStr := strconv.FormatInt(int64(obj.Id), 10)
		str_array = append(str_array, intStr)
	}

	return join(str_array)
}

func get_iterable(obj struct{}) []interface{} {
	v := reflect.ValueOf(obj)
	values := make([]interface{}, v.NumField())

	for i := 0; i < v.NumField(); i++ {
		values[i] = v.Field(i).Interface()
	}

	return values
}

func main() {

	// games file
	fName := "games.json"
	file, err := os.Create(fName)
	if err != nil {
		log.Fatalf("Cannot create file %q: %s\n", fName, err)
		return
	}
	defer file.Close()

	// events file
	eventFName := "events.json"
	eventFile, err := os.Create(eventFName)
	if err != nil {
		log.Fatalf("Cannot create file %q: %s\n", eventFName, err)
		return
	}
	defer eventFile.Close()

	// languages file
	langFName := "languages.json"
	langFile, err := os.Create(langFName)
	if err != nil {
		log.Fatalf("Cannot create file %q: %s\n", langFName, err)
		return
	}
	defer langFile.Close()

	plan, _ := ioutil.ReadFile("data/languages.json")
	var langData []Languages
	json.Unmarshal(plan, &langData)

	games := make([]Game, 0, 400)
	events := make([]Event, 0, 400)
	// allLanguages := make([]Languages, 0, 400)

	c := colly.NewCollector()
	// var d []struct{ Id int }

	d := c.Clone()
	e := c.Clone()

	// Event data
	f := c.Clone()

	// Github Data
	githubCollector := colly.NewCollector(
		colly.Debugger(&debug.LogDebugger{}),
	)

	githubCollector.OnRequest(func(r *colly.Request) {
		r.Headers.Set("Accept", "application/vnd.github+json")
		r.Headers.Set("Authorization", fmt.Sprintf("Bearer %s", os.Getenv("TOKEN")))
		fmt.Println("Visiting", r.URL)
	})

	githubCollector.OnResponse(func(r *colly.Response) {
		gameId := r.Ctx.Get("gameId")
		fmt.Println(gameId)
		var languages []interface{}
		var foo Languages

		foo.Id, _ = strconv.Atoi(gameId)

		var result map[string]interface{}
		json.Unmarshal([]byte(r.Body), &result)

		for key, value := range result {
			// Each value is an interface{} type, that is type asserted as a string
			fmt.Println(key, value.(float64))
		}

		languages = append(languages, result)
		foo.Languages = languages

		lang := foo

		langData = append(langData, lang)
		// allLanguages = append(allLanguages, lang)
	})

	c.OnRequest(func(r *colly.Request) {
		fmt.Println("Visiting", r.URL)
	})

	c.OnResponse(func(r *colly.Response) {
		data := &FeedList{}
		err := json.Unmarshal(r.Body, data)
		if err != nil {
			log.Fatal(err)
		}

		// get events data
		slug := get_slug("foo", data.Feed)

		eventsUrl := fmt.Sprintf(
			"https://api.ldjam.com/vx/node2/get/%s",
			slug,
		)

		if os.Getenv("GET_EVENT") == "true" {
			f.Visit(eventsUrl)
		}

		if os.Getenv("DEBUG") == "true" {
			intStr := strconv.FormatInt(int64(data.Feed[0].Id), 10)
			u := fmt.Sprintf(
				"https://api.ldjam.com/vx/node/feed/%s/grade-01-result+reverse+parent/item/game/compo?limit=400",
				intStr,
			)

			d.Visit(u)
		} else {
			for _, obj := range data.Feed {
				intStr := strconv.FormatInt(int64(obj.Id), 10)
				u := fmt.Sprintf(
					"https://api.ldjam.com/vx/node/feed/%s/grade-01-result+reverse+parent/item/game/compo?limit=400",
					intStr,
				)

				d.Visit(u)
			}
		}

	})

	f.OnRequest(func(r *colly.Request) {
		fmt.Println("Visiting", r.URL)
	})

	// Get all events
	f.OnResponse(func(r *colly.Response) {
		data := &EventNodeList{}
		err := json.Unmarshal(r.Body, data)
		if err != nil {
			log.Fatal(err)
		}

		for _, event := range data.Node {
			events = append(events, event)
		}

		return
	})

	d.OnRequest(func(r *colly.Request) {
		fmt.Println("Visiting", r.URL)
	})

	// Get games in an event
	d.OnResponse(func(r *colly.Response) {
		data := &FeedList{}
		err := json.Unmarshal(r.Body, data)
		if err != nil {
			log.Fatal(err)
		}

		slug := get_slug("foo", data.Feed)

		u := fmt.Sprintf(
			"https://api.ldjam.com/vx/node2/get/%s",
			slug,
		)

		e.Visit(u)
		return
	})

	e.OnRequest(func(r *colly.Request) {
		fmt.Println("Visiting", r.URL)
	})

	// Get games in an event
	e.OnResponse(func(r *colly.Response) {
		data := &GameList{}
		err := json.Unmarshal(r.Body, data)
		if err != nil {
			log.Fatal(err)
		}

		// check if link has github
		// get the github language data
		// https://api.github.com/repos/user/reponame/languages
		// biggest byte count

		for _, game := range data.Node {

			v := reflect.ValueOf(game.Meta)
			values := make([]interface{}, v.NumField())

			for i := 0; i < v.NumField(); i++ {
				values[i] = v.Field(i).Interface()
			}

			if os.Getenv("GET_LANG") == "true" {
				getLang := true
				for i := range langData {
					if langData[i].Id == game.Id {
						getLang = false
						fmt.Println("Github index already saved")
						break
					}
				}

				if getLang {
					for _, link := range values {
						if str, ok := link.(string); ok {
							if check_is_github(str) {
								u := get_github_slug(str)
								if u != "invalid url" {
									u = fmt.Sprintf("https://api.github.com/repos/%s/languages", u)
									intStr := strconv.FormatInt(int64(game.Id), 10)
									r.Ctx.Put("gameId", intStr)
									githubCollector.Request("GET", u, nil, r.Ctx, nil)
								}
							}
						}
					}
				}
			}
			games = append(games, game)
		}

		return
	})

	c.Visit("https://api.ldjam.com/vx/node/feed/9/parent/event?limit=200")

	enc := json.NewEncoder(file)
	eventEnc := json.NewEncoder(eventFile)
	langEnc := json.NewEncoder(langFile)

	enc.SetIndent("", "  ")
	eventEnc.SetIndent("", "  ")
	langEnc.SetIndent("", "  ")

	enc.Encode(games)
	eventEnc.Encode(events)
	langEnc.Encode(langData)
}

func request_language_count(link string) {
	u := fmt.Sprintf("https://api.github.com/repos/%s/languages", link)
	resp, err := http.Get(u)
	if err != nil {
		log.Fatalln(err)
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}

	log.Println(string(body))
}

func get_github_slug(link string) string {
	u, err := url.Parse(strings.TrimSpace(link))
	if err != nil {
		return "invalid url"
	}
	fmt.Println("?")

	s := strings.Split(u.Path, "/")
	fmt.Println(link)
	fmt.Println(s)
	fmt.Println(len(s))
	if len(s) == 1 {
		return "invalid url"
	}

	return fmt.Sprintf("%s/%s", s[1], s[2])
}

func check_is_github(link string) bool {
	if strings.Contains(link, "github.com") {
		return true
	}

	return false
}

// Roadmap
// Get main language (if github)

// get events
// https://api.ldjam.com/vx/node/feed/9/parent/event?limit=200
// get nodes
// https://api.ldjam.com/vx/node2/get/296279+276397+258323+233335+212256+176557+159347+139254+120415+97793+73256+49883+32802+11392+10291+9405+10
// get games
// https://api.ldjam.com/vx/node/feed/296586/smart+parent/item/game/compo?limit=24
// get nodes
// https://api.ldjam.com/vx/node2/get/303752+297795+305921+303223+303965+304101+300977+304716+305905+296745+305557+298693+299960+298748+299211+305972+305861+299853
// get node meta
// get link tag with 42332 (source code)
//
