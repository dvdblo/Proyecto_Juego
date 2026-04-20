/*
 * API: funciones para interconectar página con backend y DB
 *
 * Daniel José Armas Azar A01786896
 * Guillermo Patricio González Martínez A01787393
 * David Blanco Ortiz A01786713
 */

//Función que lee y traduce el menu del día desde DB
async function readMenu(day) {
    const res = await fetch(`http://localhost:3000/menu/${day}`);
    const data = await res.json();

    let day_menu = [];

    for (const row of data[0]) {
        day_menu.push({nombre: row.product_name, img: row.img_url});
    }
    return day_menu;
}

//Función que lee y traduce información de los gatos desde DB
async function readCats() {
    const res = await fetch(`http://localhost:3000/cats`);
    const data = await res.json();

    let cats = [];

    for (const row of data) {
        let age = row.cat_age >= 12 ? `${row.cat_age/12} años` : `${row.cat_age} meses`
        cats.push({nombre: row.cat_name, edad: age, caracter: row.description, img: row.img_url});
    }
    return cats;
}
