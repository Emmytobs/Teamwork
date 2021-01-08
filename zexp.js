
function main() {
    // return new Date("2020-12-31 12:41:31.914925").toLocaleDateString()
    const date = new Date("2020-12-31 12:41:31.914925");
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const dateSTring = date.toDateString();
    return hours >= 12 ? `${dateSTring} (${hours}:${minutes} PM)` : `${dateSTring} (${hours}:${minutes} AM)`
}

console.log(main())