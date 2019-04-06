const budgetController = ( ()=>{

    class Expense {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
            this.percentage = -1;
        }
    }

    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

     Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    class Income {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        }
    };

    const calculateTotal = (type) =>{
        let sum = 0;

        data.allItems[type].forEach((cur) => {
            sum += cur.value;
        });
        data.totals[type] = sum;

    };


    const data = {
        allItems: {
            expense : [],
            income : []
        },

        totals: {
            expense : 0,
            income : 0
        },

        budget: 0,
        percentage: -1
};


    return {
        addItem: (type, des, val) => {
          let newItem, ID;

            if (data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;

            } else {
                ID =0;
            }
 
            if (type ==='expense'){
                newItem = new Expense(ID, des, val);
            } else if (type ==='income'){
                newItem = new Income(ID, des, val);

        }

        data.allItems[type].push(newItem);
        return newItem;

    },



    deleteItem: (type, id) => {
        let ids,index;

         ids = data.allItems[type].map((current)=>{
            return current.id

        });

        index = ids.indexOf(id);

        if(index ==! -1){
            data.allItems[type].splice(index, 1);

        }

    },

    calculateBudget: () => {
        calculateTotal('expense');
        calculateTotal('income');


        data.budget = data.totals.income - data.totals.expense;

        if (data.totals.income >0){
            data.percentage = Math.round((data.totals.expense / data.totals.income) *100);

        } else {

            data.percentage = -1;
        }

        
    },


    calculatePercentages:()=>{
        
        data.allItems.expense.forEach((cur)=> {
            cur.calcPercentage(data.totals.income);
         });
    },  

    getPercentages:()=>{

        let allPerc = data.allItems.expense.map((cur) => {
            return cur.getPercentage();
        });
        return allPerc;

    },

    getBudget: () =>{
        return {

            budget: data.budget,
            totalInc: data.totals.income,
            totalExp: data.totals.expense,
            percentage: data.percentage
        }

    },

    testing: () => {

        console.log(data);
    }

}

})();


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const UIController = (() =>{
    let DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

        let formatNumber = (num, type) =>{
        let  numSplit, int, dec;
        
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.')

        int = numSplit[0];

        if (int.length > 3){
            int = `${int.substr(0,int.length -3)},${int.substr(int.length -3,int.length)}`;

        }

        dec = numSplit[1];

        type ==='expense' ? sign = '-' : sign = '+';

        return `${sign} ${int}.${dec}` 
    };

    let nodeListForEach = function(list, callback) {
        for (let i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    return {
        getInput: () =>{
            return{
                type : document.querySelector(DOMstrings.inputType).value,
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }

        },



        addListItem: (obj, type) => {
            let element;


            if (type ==='income'){

             element = DOMstrings.incomeContainer;

          html = `<div class="item clearfix" id="income-%id%">
                    <div class="item__description">%description%</div>
                    <div class="right clearfix">
                        <div class="item__value">%value%</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                        </div>
                    </div>`
            } else if (type ==='expense'){
                 element = DOMstrings.expensesContainer;

      html = `<div class="item clearfix" id="expense-%id%">
             <div class="item__description">%description%</div>
             <div class="right clearfix">
           <div class="item__value">%value%</div>
           <div class="item__percentage">21%</div>
           <div class="item__delete">
            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
             </div>
             </div>
             </div>`
            }

        newHtml = html.replace('%id%', obj.id);
        newHtml = newHtml.replace('%description%', obj.description);
        newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));


        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },


        deleteListItem: (selectorID)=>{

            let el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },


        clearFields: () => {
            let fields, fieldsArr;

            fields = document.querySelectorAll(`${DOMstrings.inputDescription}, ${DOMstrings.inputValue}`);

            fieldsArr = Array.prototype.slice.call(fields); 
        
            fieldsArr.forEach((current, index, array) => {
                current.value ="";
            });
        
            fieldsArr[0].focus();
        },

        displayBudget: (obj) => {
            let type;

            obj.budget >= 0 ? type = 'income' : type = 'expense';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'income');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'expense');
            
            
            if (obj.percentage > 0){
            
            document.querySelector(DOMstrings.percentageLabel).textContent = `${obj.percentage}%`;
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent ="--"

            }
        },

        displayPercentages: (percentages)=>{

            let fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

           

            nodeListForEach(fields, function(current, index) {
                
                if (percentages[index] > 0) {                   
                    current.textContent = percentages[index] + '%';
                } else {                                 
                    current.textContent = '---';            
                }
            });
        },

        displayMonth: () => {
            let now, year, month;

                now = new Date();

                months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

                month = now.getMonth();

                year = now.getFullYear();

                document.querySelector(DOMstrings.dateLabel).textContent = `${months[month]}  ${year}`;

        },

        changedType:() => {
            
            let fields = document.querySelectorAll(`${DOMstrings.inputType},${DOMstrings.inputDescription },${DOMstrings.inputValue}`)
            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus'); 
             });
             

             document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },


        getDOMstrings: () => {
            return DOMstrings;

        }

    };

})();

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const controller = ((budgetCtrl, UICtrl) => {


    const setupEventListeners = function(){
        
        const DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress',(event) =>{
            if (event.keyCode === 13 || event.which === 13){
                ctrlAddItem(); 
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);

    };

    const updateBudget = () => {

        budgetCtrl.calculateBudget();

        const budget = budgetCtrl.getBudget();

        UICtrl.displayBudget(budget);

    };

    const updatePercentages = ()=>{

        budgetCtrl.calculatePercentages();

        let percentages = budgetCtrl.getPercentages();

        UICtrl.displayPercentages(percentages);
    };

    const ctrlAddItem = () => {
      
    let input =  UICtrl.getInput();

    if (input.description !=="" && !isNaN(input.value) && input.value > 0){


    let newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    UICtrl.addListItem(newItem, input.type);
 
    UICtrl.clearFields();

    updateBudget();

    updatePercentages();
    }
    
    };


    const ctrlDeleteItem = (event)=> {
        let ItemID, splitID, type, ID;

        ItemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (ItemID){
            
            splitID = ItemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);


            budgetCtrl.deleteItem(type, ID);

            UICtrl.deleteListItem(ItemID);

            updateBudget();

            updatePercentages();
           

        }
    };

    return {
        init: () =>{
            console.log('dziala');
            UICtrl.displayMonth();
            setupEventListeners();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            });
        }

    };

})(budgetController, UIController);

controller.init();  

