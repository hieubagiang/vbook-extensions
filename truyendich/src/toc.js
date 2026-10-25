load('config.js');
function execute(url) {
    if (!url) return Response.error("Thiếu URL đầu vào");
    url = normalizeUrl(url).replace(/\/$/, "");
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    // Trang có 2 lưới: "mới nhất" (vài chương) và danh sách trang; lấy lưới nhiều chương nhất.
    let best = null;
    doc.select("div.grid").forEach(function (g) {
        if (!best || g.select("a[href*=/chuong-]").size() > best.select("a[href*=/chuong-]").size()) best = g;
    });
    if (!best) return Response.error("Không thấy danh sách chương");

    let chapters = [];
    best.select("a[href*=/chuong-]").forEach(function (el) {
        let num = el.attr("href").match(/chuong-(\d+)/)[1];
        let title = el.select("span").first().text();
        chapters.push({
            name: "Chương " + num + (title ? ": " + title : ""),
            url: BASE_URL + el.attr("href"),
            description: "",
            lock: false,
            pay: false
        });
    });
    return Response.success(chapters);
}
