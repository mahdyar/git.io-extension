let hasCustomAddress = false;
let isShortened = false;
chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
  let url = tabs[0].url;
  let parser = document.createElement("a");
  parser.href = url;
  if (isGithubURL(parser.hostname)) {
    $("#active-tab-url").text(url);
    $("#shorten-btn").click(function () {
      if (hasCustomAddress && $("#custom-address-input").val() == "") {
        alert(
          "You should enter a custom address, if you changed your mind just use the random address button."
        );
      } else if (!isShortened) {
        let data = hasCustomAddress
          ? {
              url: url,
              code: $("#custom-address-input").val(),
            }
          : {
              url: url,
            };
        $(this).hide();
        $("#loading").show();
        $.ajax({
          url: "https://git.io",
          method: "POST",
          data: data,
          success: function (data, textStatus, request) {
            if (data == url) {
              let shortenedUrl = request.getResponseHeader("Location");
              $("#active-tab-url").text(shortenedUrl);
              $("#loading").hide();
              $("#custom-address-btn").hide();
              $("#custom-address").hide();
              $("#shorten-btn")
                .text("shortened!")
                .removeClass("is-not-shortened")
                .addClass("is-shortened")
                .show();
              isShortened = true;
            } else {
              alert("Somthing went wrong! try again.");
            }
          },
          error: function (request, status, error) {
            alert("Somthing went wrong! try again.");
            $("#shorten-btn").show();
            $("#loading").hide();
          },
        });
      }
    });
    $("#active-tab-url").click(function () {
      if (isShortened) {
        $("#custom-address-btn").text("Copied to clipboard!").slideDown();
        navigator.clipboard.writeText($(this).text());
      }
    });
  } else {
    $("#container").hide();
    $("#shortcuts").hide();
    $("#not-a-github-url").show();
  }
});

$("#custom-address-btn").click(function () {
  $(this).slideUp(100);
  $("#custom-address").slideDown(100);
  hasCustomAddress = true;
});

$("#random-address-btn").click(function () {
  $("#custom-address").slideUp(100);
  $("#custom-address-btn").slideDown(100);
  hasCustomAddress = false;
});

$("#shortcuts a").click(function (e) {
  e.preventDefault();
  var newURL = "chrome://extensions/shortcuts";
  chrome.tabs.create({ url: newURL });
  return false;
});
