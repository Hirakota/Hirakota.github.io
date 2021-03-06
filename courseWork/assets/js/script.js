//Base of food
let foodList;
fetch('/assets/js/data.json')
.then(response => response.json())
.then(data => {
    foodList = data;

    //* Select types render
    const selFrm = new DocumentFragment();
    selFrm.appendChild(defaultOption);
    foodList.forEach((value, index) => {
        const newOption = document.createElement('option');
        newOption.value = index;
        newOption.innerText = value.type;
        selFrm.appendChild(newOption);
    })
    typeSel.appendChild(selFrm);
});
class Food {
    constructor(type, name, weight, energy) {
        this.type = type;
        this.name = name;
        this.weight = weight;
        this.energy = energy;
    }
}
    
//* DOM Elements
const dailyTable = document.getElementById('dailyTable');
const dailySum = document.getElementById('dailySum');

const typeSel = document.getElementById('typeSel');
const nameSel = document.getElementById('foodSel');
const weightInp = document.getElementById('weightInp');
const saveListBtn = document.getElementById('addBtn');
const addBtn = document.getElementById('saveListBtn');
const saveChangeBtn = document.getElementById('saveChangeBtn');

const table = document.getElementById('table');
const output = document.getElementById('output');

//?First elemnt in option
const defaultOption = document.createElement('option');
defaultOption.innerText = "Выберите позицию...";
defaultOption.id = "del";

/* //* Select types render
const selFrm = new DocumentFragment();
selFrm.appendChild(defaultOption);
foodList.forEach((value, index) => {
    const newOption = document.createElement('option');
    newOption.value = index;
    newOption.innerText = value.type;
    selFrm.appendChild(newOption);
})
typeSel.appendChild(selFrm); */

//* Event for type Select and render name Select
typeSel.addEventListener('change', (event) => {
    nameSel.innerHTML = '';

    nameSel.disabled = false;
    const list = foodList[event.target.value].list;

    const nameFrm = new DocumentFragment();
    nameFrm.appendChild(defaultOption);
    list.forEach((elem, index) => {
        const newOption = document.createElement('option');
        newOption.value = index;
        newOption.innerText = elem.name;
        nameFrm.appendChild(newOption);
    });
    nameSel.appendChild(nameFrm);
})

//? nameSel event
nameSel.addEventListener('change', (event) => {
    weightInp.disabled = false;

    if (nameSel.querySelector('#del')) {
        nameSel.removeChild(nameSel.querySelector('#del'));
    }
    
    const energyValue = foodList[typeSel.selectedIndex].list[event.target.value].value;
    
    weightInp.placeholder = energyValue + "кКал на 100г продукта";
})

weightInp.addEventListener('input', () => {
    if(weightInp.value) {
        addBtn.disabled = false;
    } else {
        addBtn.disabled = true;
    }
});

//? Table events
addBtn.addEventListener('click', () => {
    const row = {
        type: foodList[typeSel.selectedIndex].type,
        name: foodList[typeSel.selectedIndex].list[nameSel.selectedIndex].name,
        weight: weightInp.value,
        energy: Math.round(parseInt(weightInp.value) / 100 * foodList[typeSel.selectedIndex].list[nameSel.selectedIndex].value)
    }
    
    weightInp.value = '';

    const newRow = document.getElementById('row-template').content.cloneNode(true);

    const foodArr = localStorage.getItem('currentFoodArr') ? 
        JSON.parse(localStorage.getItem('currentFoodArr')) : {list: [], sum: 0};

    foodArr.list.push(row);
    foodArr.sum = foodArr.sum ? 
        foodArr.sum + row.energy : row.energy;

    newRow.getElementById('type').innerText = row.type;
    newRow.getElementById('name').innerText = row.name;
    newRow.getElementById('weight').innerText = `${row.weight}г.`;
    newRow.getElementById('energy').innerText = `(${row.energy}кКал)`;

    table.querySelector('tbody').appendChild(newRow);

    output.innerText = ` ${foodArr.sum} кКал`;

    localStorage.setItem('currentFoodArr', JSON.stringify(foodArr));

    addBtn.disabled = true;
    saveListBtn.disabled = false;
})


//? remove position
table.addEventListener('click', (event) => {
    const currentRow = event.target.closest('tr');

    if(currentRow) {
        const foodArr = JSON.parse(localStorage.getItem('currentFoodArr'));
        const index = currentRow.rowIndex - 1;

        foodArr.sum -= foodArr.list[index].energy;
        foodArr.list.splice(index, 1);

        if(foodArr.sum <= 0) {
            output.innerText = "добавьте продукты";
        } else {
            output.innerText = foodArr.sum + ' кКал';
        }

        localStorage.setItem('currentFoodArr', JSON.stringify(foodArr));
        table.querySelector('tbody').removeChild(currentRow); 
    }

    if (table.querySelector('tbody').querySelectorAll('tr').length === 0) {
        saveListBtn.disabled = true;
    }
});

saveListBtn.addEventListener('click', (event) => {
    const dailyPlan = localStorage.getItem('dailyPlan') ? 
        JSON.parse(localStorage.getItem('dailyPlan')) : [];
    const foodArr = JSON.parse(localStorage.getItem('currentFoodArr'));

    dailyPlan.push(foodArr);
    localStorage.setItem('dailyPlan', JSON.stringify(dailyPlan));

    table.querySelector('tbody').innerHTML = '';

    //* Add daily table 
    const newRow = document.getElementById('daily-template').content.cloneNode(true);

    newRow.querySelector('#num').innerText = dailyPlan.indexOf(foodArr) + 1;
    newRow.querySelector('#energy').innerText = foodArr.sum + ' кКал.';


    //? clear section
    dailyTable.querySelector('tbody').appendChild(newRow);
    localStorage.setItem('currentFoodArr', '');
    output.innerText = "добавьте продукты";

    saveListBtn.disabled = true;
})


//* Calc daily
const genderSel = document.getElementById('genderSel');
const ageInp = document.getElementById('ageInp');
const personWeightInp = document.getElementById('personWeightInp');
const heightInp = document.getElementById('heightInp');
const activitySel = document.getElementById('activitySel');
const calcBtn = document.getElementById('calcBtn');

calcBtn.addEventListener('click', () => {
    let sum = 0;
    let bmr = 0;
    let activeLvl = 0;
    if (genderSel.selectedIndex === 1) {
        bmr = 10 * parseInt(personWeightInp.value) + 
            6.25 * parseInt(heightInp.value) -
            5 * parseInt(ageInp.value) + 5;
    } else {
        bmr = 10 * parseInt(personWeightInp.value) + 
            6.25 * parseInt(heightInp.value) -
            5 * parseInt(ageInp.value) - 161;
    }

    switch(activitySel.selectedIndex) {
        case 1: activeLvl = 1.2; break;
        case 2: activeLvl = 1.375; break;
        case 3: activeLvl = 1.55; break;
        case 4: activeLvl = 1.725; break;
        case 5: activeLvl = 1.9; break;
    }

    sum = Math.round(bmr * activeLvl);

    dailySum.innerText = `Для сохранения веса, в день требуется: ${sum}кКал.`;

    localStorage.setItem('target', sum);
})

function renderDailyPlan() {
    const dailyFoodArr = JSON.parse(localStorage.getItem('dailyPlan'));
    dailyTable.querySelectorAll('tbody').innerHTML = '';

    const frm = new DocumentFragment();

    let i = 1;
    dailyTable.querySelector('tbody').innerHTML = '';
    for (let row of dailyFoodArr) {
        const newRow = document.getElementById('daily-template').content.cloneNode(true);

        newRow.querySelector('#num').innerText = i++;
        newRow.querySelector('#energy').innerText = row.sum + ' кКал.';

        frm.appendChild(newRow);
    }
    dailyTable.querySelector('tbody').appendChild(frm);
}

dailyTable.addEventListener('click', (event) => {
    const row = event.target.closest('tr');
    const edit = event.target.closest('#dailyEditBtn');
    const del = event.target.closest('#dailyDelBtn');

    const dailyFoodArr = JSON.parse(localStorage.getItem('dailyPlan'));
    if (del) {
        dailyFoodArr.splice(row.rowIndex - 1, 1);
        localStorage.setItem('dailyPlan', JSON.stringify(dailyFoodArr));

        renderDailyPlan();
    }

    if (edit) {
        table.querySelector('tbody').innerHTML = '';

        const currentFoodArr = dailyFoodArr[row.rowIndex - 1];

        const frm = new DocumentFragment();
        for(let row of currentFoodArr.list) {
            const newRow = document.getElementById('row-template').content.cloneNode(true);

            newRow.getElementById('type').innerText = row.type;
            newRow.getElementById('name').innerText = row.name;
            newRow.getElementById('weight').innerText = `${row.weight}г.`;
            newRow.getElementById('energy').innerText = `(${row.energy}кКал)`;

            frm.appendChild(newRow);
        }
        table.querySelector('tbody').appendChild(frm);

        sessionStorage.setItem('editId', row.rowIndex - 1);
        localStorage.setItem('currentFoodArr', JSON.stringify(currentFoodArr));
        saveChangeBtn.hidden = false;
        saveListBtn.hidden = true;


        output.innerText = currentFoodArr.sum + ' кКал.';
    }
});

saveChangeBtn.addEventListener('click', () => {
    const dailyPlan = JSON.parse(localStorage.getItem('dailyPlan'));
    const currentFoodArr = JSON.parse(localStorage.getItem('currentFoodArr'));
    const index = sessionStorage.getItem('editId');

    dailyPlan[index] = currentFoodArr;

    saveChangeBtn.hidden = true;
    saveListBtn.hidden = false;

    localStorage.setItem('dailyPlan', JSON.stringify(dailyPlan));
    localStorage.setItem('currentFoodArr', '');

    output.innerText = 'добавьте продукты';

    table.querySelector('tbody').innerHTML = '';
    renderDailyPlan();
});


//* Rule for daily
const targetInps = document.getElementById('targetInps');

targetInps.addEventListener('input', (event) => {
    const closestInp = event.target.closest('input') ? event.target.closest('input') : event.target.closest('select');

    /* genderSel
    ageInp
    personWeightInp
    heightInp
    activitySel */

    if (closestInp) {
        if (
            genderSel.selectedIndex != 0 &&
            ageInp.value &&
            personWeightInp.value &&
            heightInp.value &&
            activitySel.selectedIndex != 0
        ) {
            calcBtn.disabled = false;
        } else {
            calcBtn.disabled = true;
        }
    }
})

//*Page load code
if(localStorage.getItem('target')) {
    dailySum.innerText = `Для сохранения веса, в день требуется: ${localStorage.getItem('target')} кКал.`;
} else {
    dailySum.innerText = `Пожалуйста внесите данные`;
}

localStorage.setItem('currentFoodArr', '');
renderDailyPlan();