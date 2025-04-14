const toSlug = (str) => {
    return str
        .normalize("NFD")                 // tách các dấu ra khỏi chữ
        .replace(/[\u0300-\u036f]/g, "") // xoá các dấu
        .toLowerCase()                   // chuyển về chữ thường
        .replace(/\s+/g, "-")            // thay khoảng trắng bằng dấu gạch ngang
        .replace(/[^\w\-]+/g, "")        // xoá các ký tự không phải chữ, số, gạch ngang
        .replace(/\-\-+/g, "-")          // gộp nhiều dấu - thành một
        .replace(/^-+|-+$/g, "");
}

export {toSlug}