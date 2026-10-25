load('config.js');
function execute(url) {
    if (!url) return Response.error("Thiếu URL đầu vào");
    url = normalizeUrl(url);
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let box = doc.select("#original-content-tab").first();
    // Nội dung rỗng = site đang giới hạn tốc độ (cooldown), không phải chương trống.
    if (!box || box.select("p").isEmpty()) return Response.error("Site đang giới hạn tốc độ, thử lại sau ít phút");

    let html = "";
    box.select("p").forEach(function (p) {
        let t = p.text();
        if (t && t !== "<content>") html += "<p>" + t + "</p>";
    });
    // h1 chỉ có tên chương; ghép số chương từ URL để thành "Chương N: tên".
    let h1 = doc.select("h1").first();
    let title = h1 ? h1.text() : "";
    let num = url.match(/\/chuong-(\d+)/);
    if (num && title.indexOf("Chương") !== 0) title = "Chương " + num[1] + (title ? ": " + title : "");
    return Response.success(html, title);
}
