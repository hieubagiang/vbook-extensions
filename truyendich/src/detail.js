load('config.js');
function execute(url) {
    if (!url) return Response.error("Thiếu URL đầu vào");
    url = storyUrl(url);
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let hd = doc.select("header:has(h1)").first();
    if (!hd) return Response.error("Không đọc được trang truyện");
    let cover = doc.select("meta[property=og:image]").attr("content");
    // Mỗi ô thông tin là <div><div><span>nhãn</span></div><p>giá trị</p></div>; không dùng parent() vì runtime không có.
    let authorEl = hd.select("div:has(> div > span:containsOwn(Tác giả)) > p").first();
    let author = authorEl ? authorEl.text() : "";
    let intro = doc.select("h2:contains(Giới thiệu truyện) + div div.prose").first();
    let description = intro ? intro.html() : "";
    let statusEl = hd.select("div:has(> div > span:containsOwn(Trạng thái)) > p").first();
    let status = statusEl ? statusEl.text() : "";
    let tags = [];
    hd.select("a[href^=/the-loai/]").forEach(function (el) {
        tags.push({ title: el.text(), input: el.attr("href"), script: "search.js" });
    });

    return Response.success({
        name: doc.select("h1").first().text(),
        author: author,
        cover: cover,
        description: description,
        detail: "Tác giả: " + author + "<br>" + status,
        url: url,
        type: "novel",
        format: "novel",
        ongoing: status.indexOf("Hoàn") === -1,
        tags: tags,
        genres: tags.length ? [{ title: "Cùng thể loại", input: tags[0].input, script: "search.js" }] : []
    });
}
