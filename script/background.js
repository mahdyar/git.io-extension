chrome.commands.onCommand.addListener(function (command) {
  if (command == "shorten-url-copy-to-clipboard") {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      let url = tabs[0].url;
      let parser = document.createElement("a");
      parser.href = url;
      if (isGithubURL(parser.hostname)) {
        $.ajax({
          url: "https://git.io",
          method: "POST",
          data: {
            url: url,
          },
          success: function (data, textStatus, request) {
            if (data == url) {
              let shortenedUrl = request.getResponseHeader("Location");
              chrome.tabs.executeScript(tabs[0].id, {
                code: `navigator.clipboard.writeText("${shortenedUrl}");                  `,
              });
              alert("Shotened URL copied to clipboard!");
            } else {
              alert("Somthing went wrong! try again.");
            }
          },
          error: function (request, status, error) {
            alert("Somthing went wrong! try again.");
          },
        });
      } else {
        alert(
          "It only works on GitHub domains.\n Go to mhdyr.ir/gs for more information!"
        );
      }
    });
  }
});
