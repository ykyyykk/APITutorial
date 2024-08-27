$(document).ready(() => {
  $("#insert").on("click", (event) => Insert(event));
  $("#update").on("click", (event) => Update(event));
  $("#delete").on("click", (event) => Delete(event));
});

function Insert(event) {
  // 避免重新整理清除資料
  event.preventDefault();

  $.ajax({
    url: "/api/insertPlayer",
    method: "POST",
    data: { id: $("#id").val(), name: $("#name").val() },
    success: (data) => {
      $("#result").html(`<p>Player Created: Name = ${data.name}</p>`);
    },
    error: (xhr) => {
      $("#result").html(`<p>Error: ${xhr.responseJSON.error}</p>`);
    },
  });
}

function Update(event) {
  // 避免重新整理清除資料
  event.preventDefault();

  $.ajax({
    url: "/api/updatePlayer",
    method: "PUT",
    data: { id: $("#id").val(), name: $("#name").val() },
    success: (data) => {
      $("#result").html(`<p>Player AfterUpdate: Name = ${data.name}</p>`);
    },
    error: (xhr) => {
      console.log("Error response:", xhr); // Log the error response for debugging
      $("#result").html(
        `<p>Error: ${
          xhr.responseJSON ? xhr.responseJSON.error : "Unknown error"
        }</p>`
      );
    },
  });
}

function Delete(event) {
  // 避免重新整理清除資料
  event.preventDefault();

  $.ajax({
    url: "/api/deletePlayer",
    method: "DELETE",
    // 送回indexDatabase.js
    data: { id: $("#id").val() },
    success: (data) => {
      $("#result").html(`<p>Player ${data.id} delete success</p>`);
    },
    error: (xhr) => {
      console.log("Error response:", xhr); // Log the error response for debugging
      $("#result").html(
        `<p>Error: ${
          xhr.responseJSON ? xhr.responseJSON.error : "Unknown error"
        }</p>`
      );
    },
  });
}
