export const getFormatDate = (date, format = "MM/DD/YYYY") => {
    var d = date.getDate();
    var m = date.getMonth();
    m += 1;
    var y = date.getFullYear();

    var newdate = (m + "/" + d + "/" + y);
    return newdate;
}