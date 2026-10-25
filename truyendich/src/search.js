load('config.js');
function execute(query, page) {
    query = query || "";
    page = page || "1";

    let url;
    if (query.indexOf("/") === 0 || query.indexOf("http") === 0) {
        let base = query.indexOf("http") === 0 ? query : BASE_URL + query;
        url = base + (base.indexOf("?") === -1 ? "?" : "&") + "page=" + page;
    } else {
        url = BASE_URL + "/tim-kiem?q=" + encodeURIComponent(query) + "&page=" + page;
    }
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let items = listCards(doc);
    let hasNext = !doc.select("a:containsOwn(Trang sau)").isEmpty() || (query.indexOf("/") === 0 && items.length > 0);
    return Response.success(items, hasNext ? (parseInt(page) + 1).toString() : "");
}
