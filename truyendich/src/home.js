function execute() {
    return Response.success([
        { title: "Truyện mới", input: "/danh-sach/truyen-moi", script: "search.js" },
        { title: "Truyện hot", input: "/danh-sach/truyen-hot", script: "search.js" },
        { title: "Dịch AI", input: "/danh-sach/truyen-dich-ai", script: "search.js" },
        { title: "Truyện full", input: "/danh-sach/truyen-full", script: "search.js" }
    ]);
}
