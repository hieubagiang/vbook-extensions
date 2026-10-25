load('config.js');
function execute() {
    let response = fetch(BASE_URL);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let seen = {};
    let genres = [];
    doc.select("a[href^=/the-loai/]").forEach(function (el) {
        let href = el.attr("href");
        if (seen[href] || !el.text()) return;
        seen[href] = true;
        genres.push({ title: el.text(), input: href, script: "search.js" });
    });
    return Response.success(genres);
}
