load('config.js');
// TOC phân trang server-render: /doc-truyen/<slug>/trang-N, 50 chương mỗi trang.
function execute(url) {
    if (!url) return Response.error("Thiếu URL đầu vào");
    url = storyUrl(url);
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    // latestChapterNumber nằm trong dữ liệu RSC nhúng, không có trong DOM
    let m = response.text().match(/latestChapterNumber\\?":(\d+)/);
    if (!m) return Response.error("Không đọc được số chương");
    let total = parseInt(m[1]);
    let pages = [];
    for (let i = 1; i <= Math.ceil(total / 50); i++) {
        pages.push(url.replace(/\/$/, "") + "/trang-" + i);
    }
    return Response.success(pages);
}
