//Update Storage Prototype to accept Objects
Storage.prototype.setObject = function(key, value) {
  this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
  return JSON.parse(this.getItem(key));
}
 
//Defaults
var categoryList = ['Books', 'Recipes', 'Movies', 'Restaurants'];
var books = {
  'Great Gatsby': {
    'description': 'This is a good book'
  },

  'The Bible' : {
    description: 'epic'
  },

  'Meditations': {
    description: 'marcus'
  }
};

var recipes = {
  'Apple Pie': {
    description: 'Yummy'
  },

  'Pizza Pie': {
    description: 'Cheese, Sauce, and dough'
  }
}

localStorage.setObject('categoryList', categoryList);
localStorage.setObject('Books', books);
localStorage.setObject('Recipes', recipes);

// Category Array
// var Category = function(name, description, category){
//   var name = name;
//   category = [
//     name: {
//       'description': description;
//     }
//   ];
// }


// Item Class Prototype
var Item = function(name, description, category) {
  name = name;
  category: {
    name: {
      description = description;
    }
  }
};

// var Item = {
//   name: {
//     'description': description
//   }
// }

/*
Functions
*/

//Searches Local Storage for matching Item Object and returns if found
var searchLocalStorage = function(term) {
  console.log(typeof term);
  for (var i of Object.keys(localStorage)) {
    if (i.replace(/\s+/g, '').toLowerCase() === term.replace(/\s+/g, '').toLowerCase()) {
      return i;
    } else {
      return false;
    }
  }
};

/* 
Formats String to Titlecase
-Beginning of each word is uppercase and the rest of the word is lowercase
i.e Website, Toy Story, This Is My House
*/
var formatString = function(string) {
  return string.replace(/(^|\s)[a-z]/g, function(f) {
    return f.toUpperCase();
  })
};

//Add New Item to Local Storage
var addNewItem = function(name, description, category) {
  var item = new Item(name, description, category);
  // category = formatString(category);
  // if (localStorage.includes(category)) {
  //   localStorage.getObject(category);
  // }
 

  
  
  localStorage.setObject(category, test);
  var cool = localStorage.getObject(category)
  //console.log(cool, 'pre bible')
  
  cool["The Bible"] = {'description': 'epic'};

  localStorage.setObject(category, cool);
  var drool = localStorage.getObject(category)
  //console.log(drool, 'post bible');

};

var updateItemName = function(name, category, newName) {
  if (localStorage.getObject(category)) {
    var item = localStorage.getObject(category);
    for (var prop in item) {
      if (prop === name) {
        var storedProp = item[prop];
        item[name] = item[newName];
        item[newName] = storedProp;
        delete item[name];
      }
    }
  }
};

var updateItemDescription = function(name, description, category) {
  if (localStorage.getObject(category)) {
    var item = localStorage.getObject(category);
    for (var prop in item) {
      if (prop === name) {
        item[prop].description = description;
        localStorage.setObject(category, item);
      }
    }
  } 
};

//Updates categoryList with string when user adds a new category
var pushToCategoryArray = function(category) {
  if (!categoryList.includes(category)) {
    categoryList.push(category);
    localStorage.setObject("categoryList", categoryList);
    return true;
  } else {
    alert(category + ' already exists!')
    return false;
  }
};

//Removes category string from categoryList
var popFromCategoryArray = function(category) {
  if (categoryList.includes(category)) {
    var index = categoryList.indexOf(category);
    if (index > -1) {
      categoryList.splice(index, 1);
      localStorage.setObject('categoryList', categoryList);
      alert(category + " category removed")
    }
  }
};

//Category List Functions
var populateCategoryList = function() {
  for (var e of categoryList) {
    $(".category-container").append(`<button class="category-item">${e}</div>`)
  }
};

var addToCategoryList = function (category) {
  $(".category-container").append(`<button class="category-item">${category}</div>`);
};

var removeFromCategoryList = function(category) {
  if (categoryList.includes(category)) {
    $(`button.category-item:contains(${category})`).remove();
  } else {
    alert(category + ' does not exist!')
  }
};

/*
Category Dropdown Functions
*/
var populateCategoryDropdown = function(){
  for (var e of categoryList) {
    $("select").append(`<option>${e}</option>`);
  }
};

var addToCategoryDropdown = function(category) {
  $("select").append(`<option selected>${category}</option>`);
};

var removeFromCategoryDropdown = function(category) {
  if (categoryList.includes(category)) {
    $(`option:contains(${category})`).remove();
  } else {
    alert(category + ' does not exist!')
  }
};

/*
New Category Prompt
*/
var addNewCategory = function(category) {
  if (category !== null) {
    if (category !== '') {
      category = formatString(category);
      if (pushToCategoryArray(category)) {
        addToCategoryDropdown(category);
        addToCategoryList(category);
      }
    } else {
      console.log('Category is EMPTY/NULL')
    }
  }
};

var resetDropdownBox = function() {
  $("select").prop('selectedIndex', '#select-category');
};


/* 
jQuery Begins
*/
$(document).ready(function() {
  resetDropdownBox();
  populateCategoryList();
  populateCategoryDropdown();
  /*
  Selector variables
  */
  var $inputSearchBar = $("input.search-bar");
  var $addTextBtn = $(".add-text-btn");
  var $userInputTitle = $(".user-input-title");
  var $userInputDesc = $(".user-input-desc");
  var $displayItem = $(".display-item");
  var $addCategoryItem = $("button.add-category-item");
  var $categoryRow = $(".category-row");
  var $categoryContainer = $(".category-container");
  var $itemList = $(".item-list");
  var $categoryDisplay = $(".category-details");

  /* 
  Search bar functionality
  Both on individual keypress (realtime search) and on enter
  */
  $inputSearchBar.on('keyup', function(event) {
    var $searchVal = $inputSearchBar.val();
    if (searchLocalStorage($searchVal) !== false) {
      console.log(localStorage.getObject(searchLocalStorage($searchVal)));
    }
  });

  $inputSearchBar.on('keypress', function(event) {
    var key = event.which;
    var $searchVal = $inputSearchBar.val();
    if (key === 13) {
      console.log(localStorage.getObject(searchLocalStorage($searchVal)));
    }
  });


  /*
  Add Item Button
  Adds Item in localStorage as an object.
  */
  //Click box shadow effect
  $addTextBtn.on('mousedown', function() {
    $(this).css({"box-shadow":"1px 1px"})
  });

  $addTextBtn.on("click", function(){
    //reset click box shadow effect
    $(this).css({"box-shadow":""});

    //store values
    let inputKey = formatString($userInputTitle.val());
    let inputDesc = formatString($userInputDesc.val());
    let inputCategory = $("select").val();

    if (inputCategory === null) {
      inputCategory = 'unsorted';
    }

    // Clear/Reset Item Entry Forms
    $userInputTitle.val("");
    $userInputDesc.val("");
    resetDropdownBox();

    // create new item and set in storage
    addNewItem(inputKey, inputDesc, inputCategory);




    // var item = new Item(inputKey, inputCategory, inputDesc);
    // localStorage.setObject(inputKey, item);
    // console.log('Item Stored in localStorage: ', inputKey, inputDesc, inputCategory);

    // Confirmation of Item Added to List
    let itemHtml = `<div class="display-item" data-storage-key="${inputKey}">Added to Local Storage: ${inputKey}</div>`;
    $(".display").html(itemHtml);
    $(".display").fadeTo("4000", ".75");
    setTimeout(function(){
      return $(".display").fadeTo("5000", "0");
    }, 5000);

  });


  /*
  REMOVED: Delete Button

  $(".del-text-btn").on("click", function() {
    alert('item deleted? check the console'); // maybe change to a window.confirm
    localStorage.removeItem( $('.user-input-title').val() ); // grab the title and plop here
    $userInputTitle.val("");
    $userInputDesc.val("");
  });
  */

  /*
  Add Category Button Functionality
  Prompts users to create a new catgeory and appends it to the end of the category list 
  */
  $categoryRow.on('mousedown', 'button.add-category-item', function() {
    $(this).css({"box-shadow":"1px 1px"})
  });

  $categoryRow.on("click", "button.add-category-item", function() {
    $(this).css({"box-shadow":""})
    var category = prompt('Category Name');
    addNewCategory(category);
  });


  /*
  Category Button Functianality
  Clicking on a category opens the list of items contained within that category
  */
  $categoryRow.on('mousedown', 'button.category-item', function() {
    $(this).css({"box-shadow":"1px 1px"})
  });

  $categoryRow.on('click', 'button.category-item', function(event){
    $(this).css({"box-shadow":""})
    var category = event.target.innerHTML;
    $categoryRow.html(`
    <div class="category-details">
    <button id="close"><i class="fas fa-chevron-left"></i></button>
    <div id="title">${category}</div>
    <div class="item-list">
    </div>
    </div>
    `); 
      
    if (localStorage.getObject(category) !== null) {
      var item = localStorage.getObject(category);
      for (var key in item) {
        $(".item-list").append(`<div class="item">${key}</div>`);
      }
    } else {
      $(".item-list").append(`<div class="item-holder">You should really add something!</div>`);
    }

  //Remove Category from list functionality
  //THIS NEEDS TO BE PUT SOMEWHERE
  // if ($("select").val() === category) {
  //   resetDropdownBox();
  // }

  // removeFromCategoryList(category);
  // removeFromCategoryDropdown(category);
  // popFromCategoryArray(category);

  //Enter Category Page Functionality
  //THIS IS HARDCODED NEEDS TO BE DYNAMIC
 

  });

  $("select").on("click", "#add-category", function(){
    var category = prompt('Category Name');
    addNewCategory(category);
  });

  /*
  Category Container Close Button
  X button at the top right of the category title. On click returns user
  back to the category list
  */
  $categoryRow.on('click', '#close', function() {
    $categoryRow.html('').append('<div class="category-container"><button class="add-category-item" id="add-category">+</div>')
    populateCategoryList(); 
  });

  /*
  Item Click Functionality 
  When user clicks on display item brings up edit and delete options
  */
  $displayItem.on("click", function(e){
    // get the values from the the divs?
    console.log("key=> ", e.target.dataset.storageKey); // user-input-title
    var test = localStorage.getItem(e.target.dataset.storageKey); // user-input-desc
    console.log(JSON.parse(test));

    // set those values in the form fields
    $userInputTitle.val(e.target.dataset.storageKey);
    $userInputDesc.val(localStorage.getItem(e.target.dataset.storageKey));
  });

});