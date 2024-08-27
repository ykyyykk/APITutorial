const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const { request } = require("http");
const app = express();
const port = 4000;

//模擬的數據庫
let userDatabase = [
  { id: 1, name: "alice" },
  { id: 2, name: "jeff" },
];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// 單調的用json顯示userDatabase內容
app.get("/showUserDatabaseInJson", (request, response) => {
  response.json(userDatabase);
});

// 當網址是/view-users時 顯示模擬數據庫內容
app.get("/view-userDatabase", (request, response) => {
  response.render("userDatabase", { userDatabase });
});

// /users/1 會得到{"id":1,"name":"alice"}
app.get("/users/:id", (request, response) => {
  const user = userDatabase.find((u) => u.id == request.params.id);
  if (user) {
    response.json(user);
  } else {
    response.status(400).send("user not found");
  }
});

// 一個使用者介面讓人方便輸入id
app.get("/viewUserForm", (request, response) => {
  response.render("viewUserForm");
});

//增加user表單會連過來 但不會跳轉到顯示所有user
app.post("/users", (request, response) => {
  const newUser = { id: userDatabase.length + 1, name: request.body.name };
  userDatabase.push(newUser);
  response.status(201).json(newUser);
});

app.get("/new-user", (request, response) => {
  response.render("newUserForm");
});

app.listen(port, () => {
  console.log(`運行中 http://localhost:${port}`);
});
