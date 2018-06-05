const d3 = require("d3");
const $ = require("jquery");
import "./style.scss";

const state = {
  'nutrient': '',
  'animal': [],
  'veg': [],
}

$('.nutrients').change(() => {
  state.nutrient = $(".nutrients option:selected")[0].value;
  $('.food-list').empty();
  selectNutrient();
  // document.querySelector('#state').innerHTML = JSON.stringify(state, null, 4);
})

const slugify = (s) => s.replace(/\s/g, "-").toLowerCase();
const upper = (s) => s.charAt(0).toUpperCase() + s.substr(1);
const unit = (n) => ({
  "protein": "g",
  "iron": "mg"
})[n];

const createItem = (nutrient, type, name, serving, size) => {
  const item = $('.food-list' + (type === 'animal' ? '.animal' : '.veg')).append(
    $('<div/>')
      .attr("id", slugify(name))
      .addClass("food-item")
      .html(`
      <img src="./assets/images/${slugify(name)}.png">
      <div>
        <h4>${name}</h4>
        <p>${upper(nutrient)}: ${serving} ${unit(nutrient)}<br>
           Size: ${size}
        </p>
      </div>
      `).click(
        el => {
          el.currentTarget.parentNode.classList[1];
          if (el.currentTarget.parentNode.classList.contains('animal') && !el.currentTarget.classList.contains('removed')) {
            el.currentTarget.classList.add('removed')
            state.animal.push(el.currentTarget.id);
          } else {
            el.currentTarget.classList.remove('removed');
            state.animal = state.animal.filter(e => e !== el.currentTarget.id)
          }
          if (el.currentTarget.parentNode.classList.contains('veg') && !el.currentTarget.classList.contains('substitute')) {
            el.currentTarget.classList.add('substitute')
            state.veg.push(el.currentTarget.id);
          } else {
            el.currentTarget.classList.remove('substitute')
            state.veg = state.veg.filter(e => e !== el.currentTarget.id)
          }
          document.querySelector('#state').innerHTML = JSON.stringify(state, null, 4);
        }
      )
  );
}

const selectNutrient = () => {
  d3.csv(`./assets/data/${state.nutrient}.csv`, (error, data) => {
    data.forEach(el => createItem(state.nutrient, el.category, el.food, el.nutrientAmt, el.size))
  })
}
