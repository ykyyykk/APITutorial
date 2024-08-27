const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const { request } = require("http");
const { resourceUsage } = require("process");
const { error } = require("console");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.listen(port, () => {
  console.log(`運行中 http://localhost:${port}`);
});

const db = new sqlite3.Database("./data/player.db", (error) => {
  if (error) {
    console.error("無法連接到資料庫", error);
  } else {
    console.log("已經連到SQLite資料庫");
  }
});

// 取得所有玩家
app.get("/getAllPlayers", (request, response) => {
  db.all("select * from player", (error, rows) => {
    if (error) {
      response.status(500).send(error.message);
    } else {
      response.json(rows);
    }
  });
});

// 取得單一玩家
app.get("/getPlayers/:id", (request, response) => {
  db.get(
    "select * from player where id = ?",
    [request.params.id],
    (error, row) => {
      if (error) {
        response.status(500).send(error.message);
      } else if (row) {
        response.json(row);
      } else {
        response.status(404).send("playe not found");
      }
    }
  );
});

// 渲染畫面 玩家資料操作的畫面
app.get("/", (request, response) => {
  response.render("PlayerForm");
});

//insert按鈕按下去呼叫
app.post("/api/insertPlayer", (request, response) => {
  const name = request.body.name;
  db.run("insert into player (name) values (?)", [name], (error) => {
    if (error) {
      response.status(500).send(error.message);
    } else {
      // 把資料送回playerform.Insert.success的data
      response.json({ name: name });
    }
  });
});

//update按鈕按下去呼叫
app.put("/api/updatePlayer", (request, response) => {
  db.run(
    "update player set name = ? where id = ?",
    [request.body.name, request.body.id],
    // 因為有用this.所以要用function
    function (error) {
      if (error) {
        response.status(500).send(error.message);
      } else if (this.changes === 0) {
        //找不到指定id時 會正確的顯示錯誤
        //但console的error 就不確定是不是正常的 PUT http://localhost:4000/api/updatePlayer 404 (Not Found)
        response.status(404).json({ error: "Player not found" });
      } else {
        response.json({ id: request.body.id, name: request.body.name });
      }
    }
  );
});

//delete按鈕按下去呼叫
app.delete("/api/deletePlayer", (request, response) => {
  db.run(
    "delete from player where id = ?",
    [request.body.id],
    function (error) {
      if (error) {
        response.status(500).send(error.message);
      } else if (this.changes === 0) {
        response.status(404).json({ error: "Player not found" });
      } else {
        // response.json({ id: request.body.id });
        //為了讓結果回傳 所以不能用send
        // response.status(201).send();
        response.status(201).json({ id: request.body.id });
      }
    }
  );
});

// 當網址是/view-player時 顯示模擬數據庫內容
app.get("/view-player", (request, response) => {
  db.all("select * from player", (error, rows) => {
    if (error) {
      response.status(500).send(error.message);
    } else {
      response.render("users", { users: rows });
    }
  });
});
