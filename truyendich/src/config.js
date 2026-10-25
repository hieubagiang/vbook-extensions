let BASE_URL = "https://truyendich.space";
try {
    if (DOMAIN) {
        BASE_URL = DOMAIN;
    }
} catch (error) {
}

function normalizeUrl(url) {
    return url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
}

// URL chương/bản ai|cv về URL trang truyện /doc-truyen/<slug>.
function storyUrl(url) {
    return normalizeUrl(url).replace(/\/chuong-\d+.*$/, "").replace(/\/(?:ai|cv)\/([^\/]+)\/?$/, "/$1").replace(/\/$/, "");
}

// Site chặn nếu gọi dồn dập: bỏ qua redirect /cooldown, /forbidden thì fetch trả !ok hoặc trang rỗng.
function listCards(doc) {
    // Trang danh sách dạng hàng: tác giả/số chương nằm ngoài thẻ <a> bìa, nên gom theo thẻ cha.
    let info = {};
    doc.select("div.group:has(> a[href^=/doc-truyen/] img)").forEach(function (card) {
        let a = card.select("a[href^=/doc-truyen/]").first();
        if (!a) return;
        let author = card.select("span.line-clamp-1").first();
        let m = card.text().match(/(\d[\d.,]*)\s*chương/);
        let parts = [];
        if (author && author.text()) parts.push(author.text());
        if (m) parts.push(m[1] + " chương");
        info[a.attr("href")] = parts.join(" · ");
    });

    let seen = {};
    let items = [];
    doc.select("a[href^=/doc-truyen/]:has(img)").forEach(function (a) {
        let href = a.attr("href");
        if (!/^\/doc-truyen\/[^\/]+$/.test(href) || seen[href]) return;
        let img = a.select("img").first();
        if (!img) return;
        seen[href] = true;
        let cover = img.attr("src");
        let description = info[href];
        if (description === undefined) {
            // Thẻ dạng lưới: số chương và nhãn FULL nằm trong chính thẻ <a>.
            let text = a.text();
            let m = text.match(/Chương\s*(\d+)/);
            description = (m ? "Chương " + m[1] : "") + (/\bFULL\b/.test(text) ? (m ? " · " : "") + "Full" : "");
        }
        items.push({
            name: img.attr("alt").replace(/^Ảnh bìa truyện\s*/, ""),
            cover: cover.indexOf("/") === 0 ? BASE_URL + cover : cover,
            link: BASE_URL + href,
            description: description
        });
    });
    return items;
}
