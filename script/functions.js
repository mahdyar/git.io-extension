function isGithubURL(hostname) {
  return (
    /^.*.github.com$/.test(hostname) ||
    hostname == "github.com" ||
    /^.*.github.io$/.test(hostname) ||
    /^.*.githubusercontent.com$/.test(hostname)
  );
}
