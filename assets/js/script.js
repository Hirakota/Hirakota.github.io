const foodList = [
    //* 0 Каши
    {
        type: "Каши",
        list: [
            {
                name: "Гречневая каша",
                value: 137
            },
            {
                name: "Манная каша",
                value: 77
            },
            {
                name: "Овсяная каша",
                value: 93
            },
            {
                name: "Рисовая каша",
                value: 79
            }
        ]
    },
    //* 1 Овощи
    {
        type: "Овощи",
        list: [
            {
                name: "Баклажаны",
                value: 22
            },
            {
                name: "Морковь",
                value: 29
            },
            {
                name: "Салат",
                value: 15
            },
            {
                name: "Фасоль",
                value: 36
            }
        ]
    },
    //3
]
    
//* variables
const typeSel = document.getElementById('typeSel');
const nameSel = document.getElementById('foodSel');
const weightInp = document.getElementById('weightInp');
const addBtn = document.getElementById('addBtn');

const table = document.getElementById('table');
const output = document.getElementById('output');

nameSel.disabled = true;
weightInp.disabled = true;
addBtn.disabled = true;

//?First elemnt in option
const defaultOption = document.createElement('option');
defaultOption.innerText = "Выберите позицию...";
defaultOption.id = "del";

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

addBtn.addEventListener('click', (event) => {
    const row = {
        type: foodList[typeSel.selectedIndex].type,
        name: foodList[typeSel.selectedIndex].list[nameSel.selectedIndex].name,
        weight: weightInp.value,
        energy: Math.round(parseInt(weightInp.value) / 100 * foodList[typeSel.selectedIndex].list[nameSel.selectedIndex].value)
    }
    
    weightInp.value = '';

    const newRow = document.getElementById('row-template').content.cloneNode(true);

    newRow.getElementById('type').innerText = row.type;
    newRow.getElementById('name').innerText = row.name;
    newRow.getElementById('weight').innerText = `${row.weight}г.`;
    newRow.getElementById('energy').innerText = `(${row.energy}кКал)`;

    table.appendChild(newRow);

    const regular = /\(([^)]+)\)/;
    const weightList = []
    for (let energy of table.querySelectorAll('#energy')) {
        weightList.push(parseInt(regular.exec(energy.innerText)[1]));
    }

    if(weightList) {
        let sum = 0;
        for(let i = 0; i < weightList.length; i++) {
            sum += weightList[i];
        }
        
        output.innerText = ` ${sum} кКал`;
    }

    addBtn.disabled = true;
})